# 🏆 Copa Nordeste Locações — Arena NDL

**Plataforma interativa de gamificação para disseminação da cultura organizacional, treinamento operacional e integração entre colaboradores.**

> Desenvolvido por **Caique Custodio** — NIT  
> Stack: Node.js + Express + SQLite3 + WebSocket + Vanilla JS

---

## 🎯 Proposta

Transformar o aprendizado contínuo, o conhecimento dos setores e a cultura da empresa em uma experiência gamificada onde cada colaborador é um **jogador** que coleta cartas, treina atributos, responde quizzes e desafia colegas em partidas simuladas de futebol.

### Pilares

- **Cultura & Pertencimento** — Ligas temáticas representam setores reais (Manutenção, Comercial, Logística, Administrativo, Elite/NIT)
- **Treinamento Operacional** — Quizzes de segurança, normas (NR-35, NR-12) e processos internos
- **Reconhecimento** — Troféus desbloqueáveis ao dominar ligas e alcançar marcos
- **Integração** — Duelo entre colegas (PvP) usando os times titulares de cada um

---

## ⚙️ Funcionalidades

### 🧑‍🤝‍🧑 Autenticação
- Login por nome de usuário (criação automática se não existir)
- Sessão persistente via `localStorage`

### 🃏 Cartas de Colaboradores
- 15 colaboradores reais da NDL com atributos únicos
- 5 raridades: `Comum → Raro → Épico → Lendário → Mítico`
- 4 atributos: **Velocidade**, **Chute**, **Defesa**, **Energia**
- Overall calculado pela média dos atributos
- Sistema de **XP** (0–100 por nível) para evolução
- Progressão de nível ao treinar atributos (+5 por treino)

### 📦 Almoxarifado (Pacotes Booster)
| Pacote | Custo | Raridades |
|--------|-------|-----------|
| Caixa Inicial | Grátis (1x) | 5 cartas iniciais |
| Booster Bronze | 150 NDL | Comum 80%, Raro 18%, Épico 2% |
| Booster Prata | 300 NDL | Raro 50%, Épico 13%, Lendário 2% |
| Booster Ouro | 600 NDL | Épico 43%, Lendário 10%, Mítico 2% |
| Booster Lendário | 1200 NDL | Lendário 33%, Mítico 7% |

- Duplicatas viram **+150 XP** para a carta existente

### 🛡️ Meu Elenco
- Visualização da coleção completa com atributos, nível e XP
- **Campo tático** 5 posições: Goleiro, Defensor, Ala Esquerda, Ala Direita, Atacante
- Seleção de titulares via drag/modal
- Salvamento da escalação no servidor
- **Treino de posição** (300 NDL) — habilita novas posições para a carta

### 🧠 Quizzes Operacionais
- 4 categorias: **Empresa**, **Segurança**, **Operacional**, **Setores**
- Modo infinito com fila embaralhada
- Acerto: +80 Moedas NDL · +50 XP (carta aleatória)
- Erro: +15 Moedas NDL de consolação
- Feedback visual com animações e confetes

### 🏟️ Arena (Campanha)
- 5 ligas com tiers progressivos:

| Liga | Tiers | Recompensa total |
|------|-------|-----------------|
| 🔧 Manutenção | 4 tiers | 660 NDL |
| 💼 Comercial | 4 tiers | 660 NDL |
| 🚚 Logística | 3 tiers | 420 NDL |
| 📊 Administrativa | 4 tiers | 660 NDL |
| 👑 Elite | 4 tiers | 950 NDL |

- Simulação de futebol 2D em tempo real via WebSocket
- Narração automática, clima dinâmico (Sol, Nublado, Chuva)
- Habilidades especiais por raridade (Chute Atômico, Velocidade da Luz, Muralha Defensiva)
- **Rejogada**: tiers já vencidos podem ser repetidos com 50% da recompensa
- XP de participação: **+15 XP** por carta por partida

### ⚔️ Liga PvP
- Desafie outros colaboradores da NDL
- O time titular do oponente é usado como adversário real
- Placar, estatísticas e notificações em tempo real
- Histórico dos últimos 4 duelos
- Ranking da Liga com vitórias/derrotas

### 🏆 Troféus (Conquistas)

| Troféu | Requisito |
|--------|-----------|
| 🔧 Melhor do Mês | Completar a Liga da Manutenção |
| 💼 Vendedor Destaque | Completar a Liga Comercial |
| 🚚 Entregador Ágil | Completar a Liga Logística |
| 📊 Guardião do Orçamento | Completar a Liga Administrativa |
| 👑 Lenda da Nordeste | Completar a Liga de Elite |
| 🧠 Colaborador Padrão | Acertar 6 quizzes |
| ⚡ Treinador Lendário | Elevar qualquer carta ao Nível 10 |

### 📊 Ranking & Glórias
- Leaderboard global por vitórias e gols marcados
- Sala de troféus com conquistas desbloqueadas/bloqueadas
- Vitrine de todos os colaboradores disponíveis na plataforma

---

## 🧰 Stack Técnica

| Camada | Tecnologia |
|--------|-----------|
| Backend | Node.js + Express |
| Banco | SQLite3 (via `sqlite3`) |
| Tempo Real | WebSocket (`ws`) |
| Frontend | Vanilla JS (ES Modules) |
| Estilo | CSS custom (tema escuro gamificado) |
| Segurança | Helmet, CORS, Rate Limiting |
| Transparência | Logs de requisições e erros |

---

## 🚀 Como Rodar

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor (desenvolvimento)
npm run dev

# 3. Acessar
# http://127.0.0.1:3000
```

> O banco SQLite (`nordeste_copa.db`) é criado automaticamente na primeira execução com dados iniciais (colaboradores, quizzes).

> Se `http://localhost:3000` mostrar `404` ou o aviso de CSP do Chrome DevTools, use `http://127.0.0.1:3000`. Neste ambiente, `localhost` pode apontar para outro processo já ativo na porta 3000.

## Acesso pela rede local

O servidor já está configurado para escutar em `0.0.0.0`, então outros dispositivos na mesma rede podem acessar a aplicação usando o IP local da máquina, por exemplo:

```txt
http://192.168.0.10:3000
```

Substitua `192.168.0.10` pelo IP real do computador que está executando o sistema.

## PWA e produção

O sistema está preparado como PWA para o domínio:

```txt
https://copa.nordesteloc.com.br
```

Recursos ativos:

- Manifest em `/manifest.webmanifest`
- Service Worker em `/service-worker.js`
- Cache de app shell, CSS, JS, imagens e ícones
- Cache de APIs `GET` com estratégia rede primeiro e fallback local
- Página offline em `/offline.html`
- Botão de instalação quando o navegador liberar o prompt

Para instalação em celulares, o domínio de produção precisa usar HTTPS. Em desenvolvimento, `localhost` e `127.0.0.1` também são aceitos pelo navegador para testar PWA.

### Variáveis de Ambiente

| Variável | Padrão | Descrição |
|----------|--------|-----------|
| `PORT` | `3000` | Porta do servidor |
| `DB_PATH` | `./nordeste_copa.db` | Caminho do banco SQLite |
| `TRUST_PROXY` | — | Habilita trust proxy atrás de reverse proxy |
| `ENABLE_ORIGIN_ISOLATION` | `false` | Reativa COOP/OAC apenas quando o app estiver em HTTPS e precisar de isolamento de origem |
| `NODE_ENV` | `development` | Modo de execução |

Variaveis adicionais usadas pelo deploy atual:

```txt
APP_URL=http://localhost:3000
PWA_ENABLED=false
```

Na VPS:

```txt
APP_URL=https://copa.nordesteloc.com.br
PWA_ENABLED=true
PORT=3011
```

---

## 🗂️ Estrutura do Projeto

```
copa-nordeste-locacoes/
├── backend/
│   ├── controllers/        # Controladores das rotas
│   ├── database/           # Conexão, seeds, migrações
│   ├── middlewares/        # Segurança, logs, erro
│   ├── repositories/       # Acesso a dados (SQL)
│   ├── routes/             # Definição de rotas REST
│   └── services/           # Lógica de negócio (quiz, pacote, partida)
├── public/
│   ├── assets/
│   │   ├── css/            # Estilos (reset, variáveis, global, componentes)
│   │   └── js/             # Módulos (api, eventos, ui, validações)
│   └── index.html          # SPA — tela única
├── server.js               # Entry point + WebSocket
├── package.json
└── nordeste_copa.db        # Banco SQLite (auto-criado)
```

---

## 🧪 API REST

| Método | Rota | Descrição |
|--------|------|-----------|
| `POST` | `/api/auth` | Autenticar/criar usuário |
| `GET` | `/api/user/:id` | Dados completos do usuário |
| `POST` | `/api/card/upgrade` | Treinar atributo de carta |
| `POST` | `/api/card/set-starters` | Salvar escalação titular |
| `POST` | `/api/card/train-position` | Treinar nova posição |
| `GET` | `/api/quizzes` | Listar quizzes |
| `POST` | `/api/quizzes/submit` | Responder quiz |
| `GET` | `/api/quizzes/answered/:id` | Quizzes respondidos |
| `POST` | `/api/package/buy` | Comprar pacote booster |
| `GET` | `/api/leaderboard` | Ranking de jogadores |
| `GET` | `/api/colaboradores` | Galeria de colaboradores |
| `GET` | `/api/liga/oponentes/:userId` | Oponentes para PvP |
| `GET` | `/api/liga/historico/:userId` | Histórico de duelos |

### WebSocket (`ws://host/ws`)

| Mensagem | Descrição |
|----------|-----------|
| `auth_connect` | Associar conexão ao usuário |
| `start_match` | Iniciar partida de campanha |
| `start_pvp_match` | Iniciar duelo PvP |
| `cancel_match` | Abandonar partida |
| `ping` | Keep-alive |

Eventos recebidos: `match_update`, `user_sync`, `notification`, `match_error`, `match_cancelled`, `auth_ok`, `pong`

---

## 🎮 Mecânicas de Jogo

### Sistema de Partida
- Simulação em tempo real (tick a cada 200ms)
- Duração: até 50 minutos de jogo (ou até 2 gols de diferença)
- Posicionamento automático dos jogadores no campo
- Passe, drible, desarme e finalização com base nos atributos
- Goleiro defende com base no atributo `Defesa`
- Clima afeta o desempenho (Chuva: −25% de效能)

### Fontes de Moedas NDL
| Atividade | Ganho |
|-----------|-------|
| Quiz (acerto) | +80 NDL |
| Quiz (erro) | +15 NDL |
| Partida (vitória) | Recompensa do tier (+80 a +450) |
| Partida (empate) | +50 NDL |
| Partida (rejogada) | 50% da recompensa |

### Fontes de XP
| Atividade | XP |
|-----------|-----|
| Quiz (acerto) | +50 XP (carta aleatória) |
| Partida (qualquer resultado) | +15 XP por titular |
| Carta duplicada | +150 XP |
| Treinar atributo | −40 XP (custo) |

---

## 🏗️ Roadmap / Próximos Passos

- [ ] Sistema de temporadas e reset de ranking
- [ ] Notificações push para desafios PvP
- [ ] Loja de itens cosméticos (temas de carta)
- [ ] Torneios agendados entre setores
- [ ] App mobile (PWA)

---

## 📄 Licença

Proprietário — Nordeste Locações © 2025  
Desenvolvido em conformidade com o padrão corporativo **NIT**.
