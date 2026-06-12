import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 1. Carregar .env local em desenvolvimento
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf-8');
  envContent.split('\n').forEach(line => {
    const [key, ...values] = line.split('=');
    if (key && values.length && !line.startsWith('#')) {
      process.env[key.trim()] = values.join('=').trim();
    }
  });
}

import { initDatabase } from './backend/database/seed.js';
import { usuariosRepository } from './backend/repositories/usuarios.repository.js';
import { SimulacaoPartida, extrairInfoFaseChave } from './backend/services/partida.service.js';
import apiRouter from './backend/routes/api.routes.js';
import { logRequest, erroMiddleware, registrarLog } from './backend/middlewares/erro.middleware.js';

const app = express();
const server = http.createServer(app);
const PORT = process.env.PORT || 3000;
const deveUsarIsolamentoOrigem = process.env.ENABLE_ORIGIN_ISOLATION === 'true';

// 2. Middlewares padrão NIT e Segurança
app.use(helmet({
  contentSecurityPolicy: false, // Desabilita para facilitar carregamento local e integração com WS
  crossOriginOpenerPolicy: deveUsarIsolamentoOrigem ? { policy: 'same-origin' } : false,
  originAgentCluster: deveUsarIsolamentoOrigem
}));
app.use(cors());
app.use(express.json());
app.use(logRequest);

// Evita 404 ruidoso do Chrome DevTools ao verificar recursos específicos do navegador.
app.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
  return res.status(204).end();
});

if (process.env.TRUST_PROXY) {
  app.set('trust proxy', process.env.TRUST_PROXY === 'true' ? true : process.env.TRUST_PROXY);
}

// 3. Rotas da API
app.use('/api', apiRouter);

// Servir arquivos estáticos do frontend (Padrão pasta /public)
const pastaPublica = path.join(__dirname, 'public');

app.get('/service-worker.js', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
  res.setHeader('Service-Worker-Allowed', '/');
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  return next();
});

app.get('/manifest.webmanifest', (req, res, next) => {
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Content-Type', 'application/manifest+json; charset=utf-8');
  return next();
});

app.use(express.static(pastaPublica));

app.get('*', (req, res) => {
  res.sendFile(path.join(pastaPublica, 'index.html'));
});

// 4. WebSocket Server Arena NDL
const wss = new WebSocketServer({ noServer: true });
const clientes = new Map();

function broadcastGeral(payload) {
  const mensagem = JSON.stringify(payload);
  clientes.forEach((session) => {
    if (session.ws.readyState === WebSocket.OPEN) {
      session.ws.send(mensagem);
    }
  });
}

// Expõe a função de broadcast para uso fora do server se necessário
app.set('broadcastGeral', broadcastGeral);

wss.on('connection', (ws) => {
  console.log("Cliente conectado via WebSocket Arena NDL.");
  clientes.set(ws, {
    ws,
    usuarioId: null,
    partidaAtiva: null,
    intervaloPartida: null
  });

  ws.on('message', async (message) => {
    try {
      const dados = JSON.parse(message);
      const sessao = clientes.get(ws);
      if (!sessao) return;

      switch (dados.type) {
        case "auth_connect": {
          sessao.usuarioId = Number(dados.userId);
          console.log(`WebSocket associado ao usuário ID: ${sessao.usuarioId}`);
          
          ws.send(JSON.stringify({
            type: "auth_ok",
            mensagem: "Conexão em tempo real estabelecida com a Arena NDL."
          }));
          break;
        }

        case "start_match": {
          const { stageKey, userId } = dados;
          if (!userId || !stageKey) {
            ws.send(JSON.stringify({ type: "match_error", error: "Dados da partida inválidos." }));
            return;
          }

          // Busca escalação de titulares
          const cartas = await usuariosRepository.obterCartasUsuario(Number(userId));
          const titulares = cartas.filter(c => c.eh_titular === 1);

          if (titulares.length < 5) {
            ws.send(JSON.stringify({
              type: "match_error",
              error: "Seu time precisa de exatamente 5 titulares escalados antes de entrar na Arena! Vá na aba Meu Elenco para escalar."
            }));
            return;
          }

          // Limpa partida anterior se houver
          if (sessao.intervaloPartida) {
            clearInterval(sessao.intervaloPartida);
          }

          console.log(`Iniciando simulação de partida para usuário ${userId} contra ${stageKey}`);
          const partida = new SimulacaoPartida(Number(userId), stageKey, titulares);
          await partida.inicializar();
          
          sessao.partidaAtiva = partida;

          // Notificação de broadcast
          const usuario = await usuariosRepository.obterUsuarioPorId(Number(userId));
          const infoLiga = extrairInfoFaseChave(stageKey);
          const nomeAdversario = infoLiga ? `${infoLiga.liga.nome} · ${infoLiga.tier.nome}` : stageKey.toUpperCase();
          broadcastGeral({
            type: "notification",
            message: `⚽ ${usuario.nome_usuario} iniciou uma partida contra ${nomeAdversario}!`
          });

          // Envia o pontapé inicial
          ws.send(JSON.stringify({
            type: "match_update",
            state: partida.obterEstado("kickoff", "O árbitro apita! Bola rolando na Arena Nordeste!")
          }));

          // Inicia o loop da simulação (a cada 200ms processa um tick)
          sessao.intervaloPartida = setInterval(async () => {
            if (ws.readyState !== WebSocket.OPEN) {
              clearInterval(sessao.intervaloPartida);
              return;
            }

            try {
              const estadoTick = await partida.tick();
              
              ws.send(JSON.stringify({
                type: "match_update",
                state: estadoTick
              }));

              if (estadoTick.finalizada) {
                clearInterval(sessao.intervaloPartida);
                sessao.partidaAtiva = null;
                sessao.intervaloPartida = null;

                // Envia dados do usuário sincronizados pós-partida
                const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));
                const campanhaAtualizada = await usuariosRepository.obterCampanhaUsuario(Number(userId));
                const trofeusAtualizados = await usuariosRepository.obterTrofeusUsuario(Number(userId));

                ws.send(JSON.stringify({
                  type: "user_sync",
                  user: usuarioAtualizado,
                  campaign: campanhaAtualizada,
                  trophies: trofeusAtualizados
                }));

                // Notificação em caso de vitória
                if (partida.vencedor === "usuario") {
                  const infoLiga = extrairInfoFaseChave(stageKey);
                  const nomeAdversario = infoLiga ? `${infoLiga.liga.nome} · ${infoLiga.tier.nome}` : stageKey.toUpperCase();
                  broadcastGeral({
                    type: "notification",
                    message: `🏆 VITÓRIA! ${usuario.nome_usuario} venceu ${nomeAdversario} por ${partida.placarUsuario}x${partida.placarOponente}! Sensacional!`
                  });
                }
              }
            } catch (err) {
              console.error("Erro no loop da simulação de partida:", err);
              clearInterval(sessao.intervaloPartida);
            }
          }, 200);

          break;
        }

        case "start_pvp_match": {
          const { userId, opponentId } = dados;
          const usuarioPvp = await usuariosRepository.obterUsuarioPorId(Number(userId));
          if (!userId || !opponentId) {
            ws.send(JSON.stringify({ type: "match_error", error: "Dados da partida PvP inválidos." }));
            return;
          }

          const cartasUsuario = await usuariosRepository.obterCartasUsuario(Number(userId));
          const titulares = cartasUsuario.filter(c => c.eh_titular === 1);

          if (titulares.length < 5) {
            ws.send(JSON.stringify({
              type: "match_error",
              error: "Seu time precisa de exatamente 5 titulares escalados! Vá em Meu Elenco."
            }));
            return;
          }

          const cartasOponente = await usuariosRepository.obterCartasUsuario(Number(opponentId));
          const titularesOponente = cartasOponente.filter(c => c.eh_titular === 1);

          if (titularesOponente.length < 5) {
            ws.send(JSON.stringify({
              type: "match_error",
              error: "O oponente não tem 5 titulares escalados. Escolha outro adversário."
            }));
            return;
          }

          const oponenteInfo = await usuariosRepository.obterUsuarioPorId(Number(opponentId));

          const posicoes = ["GOLEIRO", "DEFENSOR", "ALA_DIREITA", "ALA_ESQUERDA", "ATACANTE"];

          const jogadoresOponente = titularesOponente.map((carta, index) => {
            const pos = carta.posicao || posicoes[index % posicoes.length];
            return {
              id: `pvp_opp_${carta.id}`,
              nome: carta.nome,
              setor: carta.setor,
              velocidade: Math.min(99, (carta.velocidade || 0) + (carta.velocidade_bonus || 0)),
              chute: Math.min(99, (carta.chute || 0) + (carta.chute_bonus || 0)),
              defesa: Math.min(99, (carta.defesa || 0) + (carta.defesa_bonus || 0)),
              energia: Math.min(99, (carta.energia || 0) + (carta.energia_bonus || 0)),
              raridade: carta.raridade,
              posicao: pos,
              ehUsuario: false,
              x: 0, y: 0,
              stamina: 100,
              habilidadeAtiva: false
            };
          });

          if (sessao.intervaloPartida) {
            clearInterval(sessao.intervaloPartida);
          }

          const partida = new SimulacaoPartida(Number(userId), `pvp_${opponentId}`, titulares);
          partida.inicializarPvP(jogadoresOponente);

          sessao.partidaAtiva = partida;

          broadcastGeral({
            type: "notification",
            message: `⚔️ ${usuarioPvp.nome_usuario} desafiou ${oponenteInfo.nome_usuario} para um duelo na Liga!`
          });

          ws.send(JSON.stringify({
            type: "match_update",
            state: partida.obterEstado("kickoff", "O árbitro apita! Duelo PvP na Liga NDL!")
          }));

          sessao.intervaloPartida = setInterval(async () => {
            if (ws.readyState !== WebSocket.OPEN) {
              clearInterval(sessao.intervaloPartida);
              return;
            }

            try {
              const estadoTick = await partida.tick();

              ws.send(JSON.stringify({
                type: "match_update",
                state: estadoTick
              }));

              if (estadoTick.finalizada) {
                clearInterval(sessao.intervaloPartida);
                sessao.partidaAtiva = null;
                sessao.intervaloPartida = null;

                // Atualiza estatísticas do oponente também
                const venceuOponente = partida.vencedor === "oponente";
                await usuariosRepository.gravarResultadoPartida(Number(opponentId), venceuOponente, partida.placarOponente);

                // Salva histórico da partida para ambos
                const venceuUsuario = partida.vencedor === "usuario";
                await usuariosRepository.salvarHistoricoPartida(Number(userId), oponenteInfo.nome_usuario, partida.placarUsuario, partida.placarOponente, venceuUsuario, 'pvp');
                await usuariosRepository.salvarHistoricoPartida(Number(opponentId), usuarioPvp.nome_usuario, partida.placarOponente, partida.placarUsuario, venceuOponente, 'pvp');

                const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));
                const trofeusAtualizados = await usuariosRepository.obterTrofeusUsuario(Number(userId));

                ws.send(JSON.stringify({
                  type: "user_sync",
                  user: usuarioAtualizado,
                  trophies: trofeusAtualizados
                }));

                if (partida.vencedor === "usuario") {
                  broadcastGeral({
                    type: "notification",
                    message: `🏆 ${usuarioPvp.nome_usuario} venceu ${oponenteInfo.nome_usuario} na Liga por ${partida.placarUsuario}x${partida.placarOponente}!`
                  });
                } else if (partida.vencedor === "oponente") {
                  broadcastGeral({
                    type: "notification",
                    message: `💪 ${oponenteInfo.nome_usuario} derrotou ${usuarioPvp.nome_usuario} na Liga por ${partida.placarOponente}x${partida.placarUsuario}!`
                  });
                }
              }
            } catch (err) {
              console.error("Erro no loop da simulação PvP:", err);
              clearInterval(sessao.intervaloPartida);
            }
          }, 200);

          break;
        }

        case "cancel_match": {
          if (sessao.intervaloPartida) {
            clearInterval(sessao.intervaloPartida);
            sessao.intervaloPartida = null;
          }
          sessao.partidaAtiva = null;
          ws.send(JSON.stringify({ type: "match_cancelled" }));
          break;
        }

        case "ping": {
          ws.send(JSON.stringify({ type: "pong" }));
          break;
        }
      }
    } catch (err) {
      console.error("Erro ao tratar mensagem WebSocket:", err);
    }
  });

  ws.on('close', () => {
    const sessao = clientes.get(ws);
    if (sessao) {
      if (sessao.intervaloPartida) {
        clearInterval(sessao.intervaloPartida);
      }
      clientes.delete(ws);
    }
    console.log("Cliente WebSocket desconectado.");
  });
});

// Trata o upgrade de requisição HTTP para WebSocket
server.on('upgrade', (request, socket, head) => {
  const pathname = new URL(request.url || '', `http://${request.headers.host}`).pathname;
  if (pathname === '/ws' || pathname === '/ws/') {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

// Middleware de erros globais
app.use(erroMiddleware);

// Inicializa banco de dados e ouve na porta
initDatabase()
  .then(() => {
    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Servidor rodando na porta ${PORT} em modo ${process.env.NODE_ENV || 'development'}`);
      registrarLog(`Servidor iniciado na porta ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erro crítico na inicialização do banco SQLite:', err);
    registrarLog(`Erro crítico de inicialização: ${err.message}`, 'error');
    process.exit(1);
  });
