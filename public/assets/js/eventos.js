import {
  apiAutenticar,
  apiObterDadosUsuario,
  apiMelhorarCarta,
  apiSalvarEscalacao,
  apiListarQuizzes,
  apiSubmeterRespostaQuiz,
  apiComprarPacote,
  apiObterRanking,
  apiObterColaboradores,
  apiTreinarPosicao,
  apiObterQuizzesRespondidos,
  apiListarOponentesLiga,
  apiObterHistoricoLiga,
  apiObterRankingPvP,
  apiRegistrarDestaqueArena
} from './api.js';

import { validarNomeUsuario } from './validacoes.js';

import {
  renderizarColecaoCartas,
  renderizarCampoTatico,
  renderizarFasesCampanha,
  renderizarQuizzes,
  renderizarLojaPacotes,
  renderizarTrofeus,
  renderizarDestaquesArena,
  renderizarRanking,
  renderizarCampoPartida,
  renderizarVitrineCartas,
  obterClasseRaridade,
  limparCacheCampo,
  limparSessaoQuiz,
  renderizarOponentesLiga,
  renderizarHistoricoLiga,
  renderizarRankingLiga,
  renderizarOponentesModal,
  renderizarTopDuelistas,
  SVG_ICONES
} from './ui.js';

let usuarioLocal = null;
let cartasLocal = [];
let campanhaLocal = {};
let trofeusLocal = [];
let trofeusRenderizadosAnterior = [];
let destaquesBancoCarregados = false;
let quizzesLocal = [];
let leaderboardLocal = [];
let rankingPvPLocal = [];
let destaquesArenaLocal = [];
let todosOponentesLocal = [];

let categoriaQuizAtiva = "Empresa";
let wsRef = null;
let wsConectado = false;
let posicaoEscalacaoAlvo = null;
let cartaInspecionadaLocal = null;
let sequenciaQuizCorretaAtual = 0;
let maiorSequenciaQuizDestacada = 0;

const TROFEUS_LIGA_MAPA = {
  "Melhor do Mês": {
    tipo: "liga",
    titulo: "Liga da Manutenção conquistada",
    subtitulo: "Fechou a trilha com domínio total.",
    descricao: "A engrenagem da manutenção foi vencida do primeiro ao último tier.",
    metaRodape: "Liga da Manutenção"
  },
  "Vendedor Destaque": {
    tipo: "liga",
    titulo: "Liga Comercial conquistada",
    subtitulo: "Marca forte no setor comercial.",
    descricao: "Consultores, estratégia e proposta viraram vitória dentro da Arena.",
    metaRodape: "Liga Comercial"
  },
  "Entregador Ágil": {
    tipo: "liga",
    titulo: "Liga Logística conquistada",
    subtitulo: "Fluxo e entrega dominados.",
    descricao: "A logística foi completada com leitura de jogo e precisão.",
    metaRodape: "Liga Logística"
  },
  "Guardião do Orçamento": {
    tipo: "liga",
    titulo: "Liga Administrativa conquistada",
    subtitulo: "Controle total da operação.",
    descricao: "A linha administrativa foi concluída com consistência e gestão.",
    metaRodape: "Liga Administrativa"
  },
  "Lenda da Nordeste": {
    tipo: "liga",
    titulo: "Liga de Elite vencida",
    subtitulo: "A Cúpula Diretiva caiu na Arena.",
    descricao: "A finalíssima da Copa Nordeste foi superada com autoridade.",
    metaRodape: "Liga de Elite"
  },
  "Seleção Implacável": {
    tipo: "conquista_coletiva",
    titulo: "Seleção Implacável",
    subtitulo: "Bônus coletivo para a formação titular.",
    descricao: "Toda a seleção recebeu XP extra e o treinador ganhou moedas pela conquista máxima.",
    metaRodape: "Conquista coletiva"
  }
};

document.addEventListener("DOMContentLoaded", () => {
  inicializarEventosAbas();
  configurarEventosFormularios();
  configurarEventosModais();
  tentarAutoLogin();
});

async function tentarAutoLogin() {
  const usuarioId = localStorage.getItem("copa_ndl_usuario_id");
  const nomeUsuario = localStorage.getItem("copa_ndl_username");

  if (usuarioId && nomeUsuario) {
    transicionarTela("tela-login", "tela-painel");
    await sincronizarDadosUsuario(usuarioId);
    conectarWebSocket(usuarioId);
  }
}

function transicionarTela(sairId, entrarId) {
  const sair = document.getElementById(sairId);
  const entrar = document.getElementById(entrarId);
  sair.classList.add("hidden");
  entrar.classList.remove("hidden");
}

function configurarEventosFormularios() {
  const formLogin = document.getElementById("form-login");
  formLogin.addEventListener("submit", async (e) => {
    e.preventDefault();

    const inputNome = document.getElementById("login-username").value;
    const validacao = validarNomeUsuario(inputNome);

    if (!validacao.valido) {
      mostrarToast(validacao.mensagem, "erro");
      return;
    }

    document.getElementById("login-spinner").classList.remove("hidden");
    document.getElementById("login-btn-text").innerText = "Carregando...";
    document.getElementById("btn-login").disabled = true;

    try {
      const res = await apiAutenticar(inputNome);

      if (!res.sucesso) {
        mostrarToast(res.mensagem || "Erro na autenticação.", "erro");
        return;
      }

      usuarioLocal = res.dados.user;
      cartasLocal = res.dados.cards;
      campanhaLocal = res.dados.campaign;
      trofeusLocal = res.dados.trophies;
      trofeusRenderizadosAnterior = [...trofeusLocal];

      localStorage.setItem("copa_ndl_usuario_id", usuarioLocal.id);
      localStorage.setItem("copa_ndl_username", usuarioLocal.nome_usuario);

      transicionarTela("tela-login", "tela-painel");
      sincronizarTelasInternas();
      conectarWebSocket(usuarioLocal.id);

      if (res.dados.isNew) {
        abrirAba("loja");
        setTimeout(() => mostrarToast("Bem-vindo a Copa Nordeste Locacoes! Resgate sua caixa inicial no Almoxarifado para receber 5 cartas.", "sucesso"), 500);
      }
    } catch (err) {
      console.error(err);
      mostrarToast("Falha de rede ao se comunicar com a Arena NDL.", "erro");
    } finally {
      document.getElementById("login-spinner").classList.add("hidden");
      document.getElementById("login-btn-text").innerText = "Entrar na Copa NDL";
      document.getElementById("btn-login").disabled = false;
    }
  });

  document.getElementById("btn-logout").onclick = () => {
    localStorage.removeItem("copa_ndl_usuario_id");
    localStorage.removeItem("copa_ndl_username");

    if (wsRef) {
      wsRef.close();
    }

    usuarioLocal = null;
    cartasLocal = [];
    campanhaLocal = {};
    trofeusLocal = [];
    trofeusRenderizadosAnterior = [];
    destaquesArenaLocal = [];
    sequenciaQuizCorretaAtual = 0;
    maiorSequenciaQuizDestacada = 0;

    transicionarTela("tela-painel", "tela-login");
    document.getElementById("login-username").value = "";
    mostrarToast("Você saiu da Arena. Até logo!", "info");
  };
}

async function sincronizarDadosUsuario(usuarioId) {
  try {
    const res = await apiObterDadosUsuario(usuarioId);
    if (res.sucesso) {
      usuarioLocal = res.dados.user;
      cartasLocal = res.dados.cards;
      campanhaLocal = res.dados.campaign;
      trofeusLocal = res.dados.trophies;
      trofeusRenderizadosAnterior = [...trofeusLocal];
      sincronizarTelasInternas();
    }
  } catch (err) {
    console.error("Falha ao sincronizar dados:", err);
  }
}

function registrarTrofeusNovos() {
  if (!Array.isArray(trofeusLocal)) {
    trofeusRenderizadosAnterior = [];
    return;
  }

  const trofeusNovos = trofeusLocal.filter((trofeu) => !trofeusRenderizadosAnterior.includes(trofeu));
  if (trofeusRenderizadosAnterior.length === 0) {
    trofeusRenderizadosAnterior = [...trofeusLocal];
    return;
  }

  trofeusNovos.forEach((trofeu) => {
    const mapeamentoLiga = TROFEUS_LIGA_MAPA[trofeu];

    if (mapeamentoLiga) {
      if (trofeu === "Seleção Implacável") {
        adicionarDestaqueArena({
          tipo: mapeamentoLiga.tipo,
          etiqueta: "Conquista coletiva",
          titulo: mapeamentoLiga.titulo,
          subtitulo: mapeamentoLiga.subtitulo,
          descricao: mapeamentoLiga.descricao,
          moedas: 120,
          xp: 30,
          meta: "Titulares em alta",
          metaRodape: "Bônus para a seleção",
          icone: "👑"
        });
        return;
      }

      adicionarDestaqueArena({
        tipo: mapeamentoLiga.tipo,
        etiqueta: "Liga concluída",
        titulo: mapeamentoLiga.titulo,
        subtitulo: mapeamentoLiga.subtitulo,
        descricao: mapeamentoLiga.descricao,
        moedas: 450,
        xp: 600,
        meta: mapeamentoLiga.metaRodape,
        metaRodape: "Conquista de liga",
        icone: "💎"
      });
      return;
    }

    const detalhesTrofeu = {
      "Conhecedor da Empresa": {
        subtitulo: "Sequência de quizzes operacionais concluída.",
        descricao: "Respostas certas transformadas em reconhecimento dentro da Arena.",
        tipo: "quiz",
        moedas: 240,
        xp: 320,
        icone: "🧠"
      },
      "Lenda do Treinamento": {
        subtitulo: "Uma carta chegou ao nível 10.",
        descricao: "Treino, consistência e evolução passiva viraram destaque oficial.",
        tipo: "conquista",
        moedas: 200,
        xp: 280,
        icone: "⚡"
      }
    }[trofeu] || {
      subtitulo: "Nova conquista registrada na temporada.",
      descricao: "Um marco importante foi adicionado à sua sala de glórias.",
      tipo: "conquista",
      moedas: 180,
      xp: 220,
      icone: "🏆"
    };

    adicionarDestaqueArena({
      tipo: detalhesTrofeu.tipo,
      etiqueta: "Conquista desbloqueada",
      titulo: trofeu,
      subtitulo: detalhesTrofeu.subtitulo,
      descricao: detalhesTrofeu.descricao,
      moedas: detalhesTrofeu.moedas,
      xp: detalhesTrofeu.xp,
      meta: "Conquista NDL",
      metaRodape: "Troféu desbloqueado",
      icone: detalhesTrofeu.icone
    });
  });

  trofeusRenderizadosAnterior = [...trofeusLocal];
}

function adicionarDestaqueArena(destaque) {
  if (!destaque) return;

  const destaqueFormatado = {
    id: `${destaque.tipo || "conquista"}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    tipo: destaque.tipo || "conquista",
    etiqueta: destaque.etiqueta || "Arena NDL",
    titulo: destaque.titulo || "Destaque da Arena",
    subtitulo: destaque.subtitulo || "",
    descricao: destaque.descricao || "",
    moedas: Number(destaque.moedas || 0),
    xp: Number(destaque.xp || 0),
    meta: destaque.meta || "Arena Nordeste",
    metaRodape: destaque.metaRodape || "Destaque recente",
    icone: destaque.icone || "🏆",
    acentoSecundario: destaque.acentoSecundario || ""
  };

  destaquesArenaLocal = [
    destaqueFormatado,
    ...destaquesArenaLocal.filter((item) => item.titulo !== destaqueFormatado.titulo || item.subtitulo !== destaqueFormatado.subtitulo)
  ].slice(0, 6);

  if (usuarioLocal?.id) {
    void apiRegistrarDestaqueArena(usuarioLocal.id, destaqueFormatado).catch((err) => {
      console.error("Falha ao salvar destaque no banco:", err);
    });
  }

  const container = document.getElementById("glorias-destaques-lista");
  if (container && !document.getElementById("aba-glorias")?.classList.contains("hidden")) {
    renderizarDestaquesArena(destaquesArenaLocal, container, compartilharDestaqueArena);
  }
}

async function compartilharDestaqueArena(destaque, acao = "salvar") {
  if (!destaque) return;

  try {
    const arquivoImagem = await gerarImagemDestaqueArena(destaque);
    const nomeArquivo = gerarNomeArquivoDestaque(destaque);

    if (acao === "salvar") {
      salvarArquivoImagem(arquivoImagem, nomeArquivo);
      mostrarToast("Imagem salva com sucesso.", "sucesso");
      return;
    }

    if (navigator.share && typeof navigator.canShare === "function" && navigator.canShare({ files: [arquivoImagem] })) {
      await navigator.share({
        title: destaque.titulo || "Destaque NDL",
        text: destaque.descricao || "Destaque da Arena Nordeste Locacoes",
        files: [arquivoImagem]
      });
      mostrarToast(
        acao === "whatsapp"
          ? "Escolha o WhatsApp e publique no Status."
          : "Escolha o Instagram na tela de compartilhamento.",
        "sucesso"
      );
      return;
    }

    salvarArquivoImagem(arquivoImagem, nomeArquivo);
    mostrarToast(
      acao === "whatsapp"
        ? "Compartilhamento nativo indisponível. A imagem foi salva para publicar no WhatsApp Status."
        : "Compartilhamento nativo indisponível. A imagem foi salva para publicar no Instagram.",
      "info"
    );
  } catch (err) {
    console.error("Falha ao exportar destaque:", err);
    mostrarToast("Não foi possível gerar a imagem do destaque.", "erro");
  }
}

async function gerarImagemDestaqueArena(destaque) {
  const capturador = window.html2canvas;
  if (typeof capturador !== "function") {
    throw new Error("html2canvas não está disponível.");
  }

  const poster = criarPosterDestaqueArena(destaque);
  document.body.appendChild(poster);

  try {
    await document.fonts?.ready;
    await Promise.all(Array.from(poster.querySelectorAll("img")).map((imagem) => new Promise((resolve) => {
      if (imagem.complete) {
        resolve();
        return;
      }
      imagem.onload = () => resolve();
      imagem.onerror = () => resolve();
    })));

    const canvas = await capturador(poster, {
      backgroundColor: "#070b16",
      scale: 2,
      width: 1080,
      height: 1350,
      windowWidth: 1080,
      windowHeight: 1350,
      scrollX: 0,
      scrollY: 0,
      useCORS: true,
      allowTaint: false,
      logging: false
    });

    if (!canvas || canvas.width === 0 || canvas.height === 0) {
      throw new Error("Falha ao converter canvas em imagem.");
    }

    const blob = await canvasParaBlob(canvas);
    return new File([blob], gerarNomeArquivoDestaque(destaque), { type: "image/png" });
  } finally {
    poster.remove();
  }
}

async function canvasParaBlob(canvas) {
  const blob = await new Promise((resolve) => {
    if (typeof canvas.toBlob === "function") {
      canvas.toBlob(resolve, "image/png", 0.98);
      return;
    }

    resolve(null);
  });

  if (!blob || blob.size === 0) {
    const dataUrl = canvas.toDataURL("image/png");
    return dataUrlParaBlob(dataUrl);
  }

  return blob;
}

function dataUrlParaBlob(dataUrl) {
  if (!dataUrl || !dataUrl.startsWith("data:image/png;base64,")) {
    throw new Error("Falha ao converter canvas em imagem.");
  }

  const base64 = dataUrl.split(",")[1];
  const bytesTexto = atob(base64);
  const bytes = new Uint8Array(bytesTexto.length);

  for (let indice = 0; indice < bytesTexto.length; indice += 1) {
    bytes[indice] = bytesTexto.charCodeAt(indice);
  }

  const blob = new Blob([bytes], { type: "image/png" });
  if (blob.size === 0) {
    throw new Error("Falha ao converter data URL em blob.");
  }

  return blob;
}

function criarPosterDestaqueArena(destaque) {
  const configuracoes = {
    conquista: { acento: "#ef4444", brilho: "rgba(239,68,68,0.18)", tituloSecundario: "CONQUISTA" },
    conquista_coletiva: { acento: "#f59e0b", brilho: "rgba(245,158,11,0.18)", tituloSecundario: "CONQUISTA COLETIVA" },
    vitoria: { acento: "#3b82f6", brilho: "rgba(59,130,246,0.18)", tituloSecundario: "VITORIA" },
    liga: { acento: "#f59e0b", brilho: "rgba(245,158,11,0.18)", tituloSecundario: "LIGA" },
    quiz: { acento: "#a855f7", brilho: "rgba(168,85,247,0.18)", tituloSecundario: "QUIZ" }
  };

  const configuracao = configuracoes[destaque.tipo] || configuracoes.conquista;

  const poster = document.createElement("div");
  poster.className = "poster-compartilhamento";
  poster.innerHTML = `
    <div class="poster-grid"></div>
    <div class="poster-conteudo">
      <div class="poster-topo">
        <img class="poster-logo" src="/assets/images/LOGO%20COLORIDA.png" alt="Nordeste Locações">
        <div class="poster-marca">Arena NDL</div>
      </div>

      <div class="poster-tag" style="border-color:${configuracao.acento}55; box-shadow: 0 0 0 1px ${configuracao.brilho}; color:${configuracao.acento};">
        ${destaque.etiqueta || "Destaque"}
      </div>

      <div class="poster-card" style="border-color:${configuracao.acento}44; background: linear-gradient(145deg, ${configuracao.brilho}, rgba(255,255,255,0.02));">
        <div class="poster-hero">
          <div class="poster-emblema" style="box-shadow: inset 0 0 0 1px ${configuracao.acento}30, 0 18px 60px rgba(0,0,0,0.45);">
            <img src="/assets/images/LOGO%20COLORIDA.png" alt="Nordeste Locações">
          </div>
          <div>
            <div class="poster-destaque" style="color:${configuracao.acento};">${configuracao.tituloSecundario}</div>
            <div class="poster-titulo">${destaque.titulo || "Destaque da Arena"}</div>
            <div class="poster-subtitulo">${destaque.subtitulo || ""}</div>
          </div>
        </div>

        <div class="poster-descricao">${destaque.descricao || ""}</div>

        <div class="poster-recompensas">
          <div class="poster-chip">🪙 +${Number(destaque.moedas || 0)} NDL</div>
          <div class="poster-chip">✨ +${Number(destaque.xp || 0)} XP</div>
          <div class="poster-chip">${destaque.meta || "Arena Nordeste"}</div>
        </div>

        <div class="poster-rodape">
          <div>
            <div class="poster-legenda">${destaque.metaRodape || "Nordeste Locações"}</div>
            <div class="poster-destaque" style="font-size: 42px; color: white;">${destaque.tipo === "vitoria" ? "GOLEADA" : "IMPACTO"}</div>
          </div>
          <div class="poster-legenda">PUBLICAR AGORA</div>
        </div>
      </div>
    </div>
  `;

  return poster;
}

function gerarNomeArquivoDestaque(destaque) {
  const slug = String(destaque?.titulo || "destaque")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40) || "destaque";

  return `ndl-${slug}.png`;
}

function salvarArquivoImagem(arquivoImagem, nomeArquivo) {
  const url = URL.createObjectURL(arquivoImagem);
  const link = document.createElement("a");
  link.href = url;
  link.download = nomeArquivo;
  link.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
function sincronizarTelasInternas() {
  if (!usuarioLocal) return;

  document.getElementById("user-coins").innerText = `${usuarioLocal.moedas} NL`;
  document.getElementById("user-display-name").innerText = usuarioLocal.nome_usuario;

  renderizarFasesCampanha(campanhaLocal, document.getElementById("campanha-lista-fases"), desafiarSetor);
  renderizarColecaoCartas(cartasLocal, document.getElementById("elenco-cartas-lista"), inspecionarCarta);
  renderizarCampoTatico(cartasLocal, abrirModalEscalacao, removerSlotPosicao);
  renderizarLojaPacotes(usuarioLocal, document.getElementById("loja-pacotes-grid"), comprarBooster);
  renderizarTrofeus(trofeusLocal, document.getElementById("glorias-trofeus-lista"));
  renderizarDestaquesArena(destaquesArenaLocal, document.getElementById("glorias-destaques-lista"), compartilharDestaqueArena);
  registrarTrofeusNovos();

  carregarQuizzes();
  carregarRanking();
  carregarOponentesLiga();
}

async function carregarQuizzes() {
  try {
    const res = await apiListarQuizzes();
    if (res.sucesso && res.dados.quizzes) {
      quizzesLocal = res.dados.quizzes;
      const quizzesRespondidos = await obterQuizzesRespondidosUsuario();
      renderizarQuizzes(
        quizzesLocal,
        categoriaQuizAtiva,
        quizzesRespondidos,
        document.getElementById("quizzes-lista-container"),
        responderQuiz
      );
    }
  } catch (err) {
    console.error(err);
  }
}

let quizzesRespondidosCache = [];

async function obterQuizzesRespondidosUsuario() {
  if (!usuarioLocal) return [];
  try {
    const res = await apiObterQuizzesRespondidos(usuarioLocal.id);
    if (res.sucesso && res.dados.answered) {
      quizzesRespondidosCache = res.dados.answered;
      return res.dados.answered.map(a => ({
        quizId: a.quizId,
        respondidoCorretamente: a.respondidoCorretamente
      }));
    }
  } catch (e) { }
  return [];
}

async function carregarRanking() {
  try {
    const res = await apiObterRanking();
    if (res.sucesso && res.dados.leaderboard) {
      leaderboardLocal = res.dados.leaderboard;
      renderizarRanking(leaderboardLocal, document.getElementById("glorias-ranking-lista"), usuarioLocal.id);
    }
  } catch (err) {
    console.error(err);
  }
}

async function carregarOponentesLiga() {
  if (!usuarioLocal) return;

  const titulares = cartasLocal.filter(c => c.eh_titular === 1);
  const aviso = document.getElementById("liga-sem-titulares");
  const container = document.getElementById("liga-lista-oponentes");

  if (titulares.length < 5) {
    aviso.classList.remove("hidden");
    container.innerHTML = "";
    document.getElementById("liga-historico-lista").innerHTML = "";
    document.getElementById("liga-ranking-lista").innerHTML = "";
    return;
  }

  aviso.classList.add("hidden");

  try {
    const [resOponentes, resHistorico, resRankingPvP] = await Promise.all([
      apiListarOponentesLiga(usuarioLocal.id),
      apiObterHistoricoLiga(usuarioLocal.id),
      apiObterRankingPvP()
    ]);

    if (resOponentes.sucesso && resOponentes.dados.oponentes) {
      todosOponentesLocal = resOponentes.dados.oponentes;
    }

    if (resHistorico.sucesso && resHistorico.dados.historico) {
      renderizarHistoricoLiga(resHistorico.dados.historico, document.getElementById("liga-historico-lista"), usuarioLocal?.nome_usuario);
    }

    if (resRankingPvP.sucesso && resRankingPvP.dados.ranking) {
      rankingPvPLocal = resRankingPvP.dados.ranking;
      renderizarTopDuelistas(rankingPvPLocal, document.getElementById("liga-top-duelistas"));
      renderizarRankingLiga(rankingPvPLocal, document.getElementById("liga-ranking-lista"), usuarioLocal.id);
    }
  } catch (err) {
    console.error("Erro ao carregar dados da Liga:", err);
  }
}

function desafiarOponenteLiga(oponente) {
  if (!wsConectado || !wsRef) {
    mostrarToast("Sem conexão com a Arena. Aguarde...", "erro");
    return;
  }

  const confirmar = confirm(`Desafiar ${oponente.nome_usuario} para um duelo na Liga?`);
  if (!confirmar) return;

  sessaoAdversarioAtivo = oponente.nome_usuario;
  abrirAba("arena");
  mostrarToast("⚔️ Desafiando ${oponente.nome_usuario}...", "info");

  wsRef.send(JSON.stringify({
    type: "start_pvp_match",
    userId: usuarioLocal.id,
    opponentId: oponente.id
  }));
}

function conectarWebSocket(usuarioId) {
  if (wsRef) wsRef.close();

  const schema = window.location.protocol === "https:" ? "wss:" : "ws:";
  const wsUrl = `${schema}//${window.location.host}/ws`;

  const socket = new WebSocket(wsUrl);
  wsRef = socket;

  socket.onopen = () => {
    wsConectado = true;
    atualizarIndicadorStatus(true);
    socket.send(JSON.stringify({ type: "auth_connect", userId: usuarioId }));
  };

  socket.onmessage = (event) => {
    try {
      const dados = JSON.parse(event.data);

      switch (dados.type) {
        case "auth_ok":
          break;
        case "match_update":
          tratarAtualizacaoPartida(dados.state);
          break;
        case "match_error":
          mostrarToast(dados.error || "Erro na partida", "erro");
          document.getElementById("arena-partida-ativa").classList.add("hidden");
          document.getElementById("arena-campanha").classList.remove("hidden");
          break;
        case "user_sync":
          if (dados.user) usuarioLocal = dados.user;
          if (dados.campaign) campanhaLocal = dados.campaign;
          if (dados.trophies) trofeusLocal = dados.trophies;
          sincronizarTelasInternas();
          break;
        case "notification":
          exibirNotificacaoSuperior(dados.message);
          break;
        case "match_cancelled":
          document.getElementById("arena-partida-ativa").classList.add("hidden");
          document.getElementById("arena-campanha").classList.remove("hidden");
          mostrarToast("Partida cancelada.", "info");
          break;
      }
    } catch (e) {
      console.error("Erro no WebSocket:", e);
    }
  };

  socket.onclose = () => {
    wsConectado = false;
    atualizarIndicadorStatus(false);
    setTimeout(() => {
      if (usuarioLocal) conectarWebSocket(usuarioId);
    }, 3000);
  };
}

function atualizarIndicadorStatus(conectado) {
  const dot = document.getElementById("status-indicador");
  const txt = document.getElementById("status-texto");
  if (conectado) {
    dot.className = "status-dot h-2.5 w-2.5 rounded-full conectado";
    txt.innerText = "Logado Arena";
    txt.className = "font-semibold text-sucesso";
  } else {
    dot.className = "status-dot h-2.5 w-2.5 rounded-full bg-rose-500";
    txt.innerText = "Buscando Arena";
    txt.className = "font-semibold text-erro";
  }
}

let matchEndTimeout = null;

function tratarAtualizacaoPartida(estadoPartida) {
  const arenaPartida = document.getElementById("arena-partida-ativa");
  const arenaCampanha = document.getElementById("arena-campanha");

  if (!estadoPartida) return;

  if (!estadoPartida.finalizada) {
    if (arenaPartida.classList.contains("hidden")) {
      arenaPartida.classList.remove("hidden");
      arenaCampanha.classList.add("hidden");
      limparCacheCampo();
    }

    document.getElementById("placar-nome-usuario").innerText = usuarioLocal.nome_usuario;
    document.getElementById("placar-nome-oponente").innerText = (sessaoAdversarioAtivo || "OPONENTE").toUpperCase();

    const containerTitularesPartida = document.getElementById("titulares-lista-partida");
    if (containerTitularesPartida.children.length === 0) {
      containerTitularesPartida.innerHTML = "";
      const titulares = cartasLocal.filter(c => c.eh_titular === 1);
      titulares.forEach(t => {
        const item = document.createElement("div");
        const vel = t.velocidade + (t.velocidade_bonus || 0);
        const overall = Math.round((vel + (t.chute + (t.chute_bonus || 0)) + (t.defesa + (t.defesa_bonus || 0)) + (t.energia + (t.energia_bonus || 0))) / 4);

        item.className = "p-3 bg-zinc-900/80 rounded-xl flex items-center justify-between border border-zinc-800";
        item.innerHTML = `
          <div class="flex items-center gap-3">
            <div class="h-9 w-9 rounded-lg flex items-center justify-center text-[10px] font-mono font-bold" style="background: linear-gradient(135deg, #e11d48, #be123c); color: white;">
              ${t.posicao.slice(0, 3)}
            </div>
            <div>
              <p class="text-xs font-semibold text-white leading-tight">${t.nome}</p>
              <p class="text-[8px] text-zinc-500 leading-none mt-0.5">${t.setor} · Lv ${t.level}</p>
            </div>
          </div>
          <div class="text-[10px] font-bold font-mono text-moeda">${overall}</div>
        `;
        containerTitularesPartida.appendChild(item);
      });
    }

    renderizarCampoPartida(estadoPartida);
  } else {
    renderizarCampoPartida(estadoPartida);

    if (matchEndTimeout) {
      clearTimeout(matchEndTimeout);
      matchEndTimeout = null;
    }

    if (estadoPartida.vencedor === "usuario") {
      mostrarToast("🏆 Vitória! +75 XP para todos os titulares!", "sucesso");
      adicionarDestaqueArena({
        tipo: "vitoria",
        etiqueta: "Vitória na partida",
        titulo: "Triunfo confirmado na Arena",
        subtitulo: sessaoAdversarioAtivo ? `Contra ${sessaoAdversarioAtivo.replaceAll("_", " ")}` : "Resultado positivo na Arena",
        descricao: `Placar final: ${estadoPartida.placarUsuario}x${estadoPartida.placarOponente}. O time saiu com vantagem e energia renovada.`,
        moedas: 150,
        xp: 260,
        meta: "Vitória NDL",
        metaRodape: "Partida concluída",
        icone: "⚽"
      });
    } else if (estadoPartida.vencedor === "oponente") {
      mostrarToast("🔴 Derrota! +75 XP de participação para os titulares.", "erro");
    } else {
      mostrarToast("🤝 Empate! +50 Moedas +75 XP de participação.", "info");
    }

    document.getElementById("btn-abandonar-partida").disabled = true;
    document.getElementById("btn-abandonar-partida").classList.add("opacity-50", "cursor-not-allowed");

    matchEndTimeout = setTimeout(() => {
      arenaPartida.classList.add("hidden");
      arenaCampanha.classList.remove("hidden");
      document.getElementById("btn-abandonar-partida").disabled = false;
      document.getElementById("btn-abandonar-partida").classList.remove("opacity-50", "cursor-not-allowed");

      const campoContainer = document.querySelector(".campo-container");
      if (campoContainer) {
        campoContainer.querySelectorAll(".gol-overlay, .confete").forEach(el => el.remove());
      }
      limparCacheCampo();
    }, 5000);
  }
}

function exibirNotificacaoSuperior(mensagem) {
  const marquise = document.getElementById("alerta-marquise");
  const texto = document.getElementById("alerta-texto");

  texto.innerText = mensagem;
  marquise.classList.remove("hidden");

  setTimeout(() => {
    marquise.classList.add("hidden");
  }, 6000);
}

let sessaoAdversarioAtivo = "";
function desafiarSetor(faseChave) {
  if (!wsConectado || !wsRef) {
    mostrarToast("Sem conexão com a Arena. Aguarde...", "erro");
    return;
  }

  const titulares = cartasLocal.filter(c => c.eh_titular === 1);
  if (titulares.length < 5) {
    mostrarToast("Escale 5 titulares! Vá em Meu Elenco.", "erro");
    abrirAba("elenco");
    return;
  }

  sessaoAdversarioAtivo = faseChave;
  mostrarToast("⚔️ Desafiando setor...", "info");

  wsRef.send(JSON.stringify({
    type: "start_match",
    userId: usuarioLocal.id,
    stageKey: faseChave
  }));
}

async function responderQuiz(quizId, opcao) {
  try {
    const res = await apiSubmeterRespostaQuiz(usuarioLocal.id, quizId, opcao);

    if (res.sucesso) {
      quizzesRespondidosCache.push({
        quizId,
        respondidoCorretamente: res.dados.correct
      });

      usuarioLocal = res.dados.user;
      cartasLocal = res.dados.cards;
      trofeusLocal = res.dados.trophies;

      document.getElementById("user-coins").innerText = `${usuarioLocal.moedas} NL`;

      if (res.dados.correct) {
        sequenciaQuizCorretaAtual += 1;
        if (sequenciaQuizCorretaAtual > maiorSequenciaQuizDestacada && [3, 5, 7].includes(sequenciaQuizCorretaAtual)) {
          maiorSequenciaQuizDestacada = sequenciaQuizCorretaAtual;
          adicionarDestaqueArena({
            tipo: "quiz",
            etiqueta: "Sequência no quiz",
            titulo: `Sequência de ${sequenciaQuizCorretaAtual} acertos`,
            subtitulo: "Resposta em série dentro da Arena.",
            descricao: "O ritmo do quiz ficou forte e a leitura das perguntas entrou no ponto.",
            moedas: 120 + (sequenciaQuizCorretaAtual * 20),
            xp: 180 + (sequenciaQuizCorretaAtual * 25),
            meta: "Quiz NDL",
            metaRodape: "Sequência ativa",
            icone: "🧠"
          });
        }
      } else {
        sequenciaQuizCorretaAtual = 0;
        maiorSequenciaQuizDestacada = 0;
      }

      sincronizarTelasInternas();
    } else {
      sequenciaQuizCorretaAtual = 0;
      maiorSequenciaQuizDestacada = 0;
      mostrarToast(res.mensagem || "Erro ao responder quiz.", "erro");
    }

    return res;
  } catch (err) {
    console.error(err);
    return null;
  }
}

async function comprarBooster(tipoPacote) {
  const overlay = document.getElementById("loja-abertura-pack");
  const animacao = document.getElementById("pack-animacao");
  const resultado = document.getElementById("pack-resultado");
  const mensagem = document.getElementById("pack-resultado-mensagem");
  const cartaContainer = document.getElementById("pack-resultado-carta");

  overlay.classList.remove("hidden");
  animacao.classList.remove("hidden");
  resultado.classList.add("hidden");

  const iconesPack = { inicial: SVG_ICONES.presente, bronze: SVG_ICONES.bronze, prata: SVG_ICONES.prata, ouro: SVG_ICONES.ouro, lendario: SVG_ICONES.lendario };
  document.querySelector(".booster-pacote-animado").innerHTML = `<div class="icon-pack-animado">${iconesPack[tipoPacote] || SVG_ICONES.presente}</div>`;

  try {
    const res = await apiComprarPacote(usuarioLocal.id, tipoPacote);

    if (!res.sucesso) {
      overlay.classList.add("hidden");
      mostrarToast(res.mensagem || "Erro ao comprar pacote.", "erro");
      return;
    }

    usuarioLocal = res.dados.user;
    cartasLocal = res.dados.cards;

    setTimeout(() => {
      animacao.classList.add("hidden");
      resultado.classList.remove("hidden");
      mensagem.innerText = res.mensagem;

      const cartasRecebidas = Array.isArray(res.dados.cardsDrawn) && res.dados.cardsDrawn.length > 0
        ? res.dados.cardsDrawn
        : (res.dados.card ? [res.dados.card] : []);

      cartaContainer.innerHTML = cartasRecebidas.length > 1
        ? '<div class="grid grid-cols-1 sm:grid-cols-2 gap-3"></div>'
        : "";

      const destinoCartas = cartasRecebidas.length > 1
        ? cartaContainer.firstElementChild
        : cartaContainer;

      cartasRecebidas.forEach((cartaRecebida) => {
        const raridadeClasse = obterClasseRaridade(cartaRecebida.raridade);
        const cardEl = document.createElement("div");
        cardEl.className = `carta-colaborador ${raridadeClasse} scale-110 mx-auto pointer-events-none animate-scale-in`;
        cardEl.innerHTML = `
          <div class="card-header">
            <span class="nivel-tag">Lv 1</span>
            <span class="raridade-badge">${cartaRecebida.raridade}</span>
          </div>
          <div>
            <h4 class="card-nome">${cartaRecebida.nome}</h4>
            <p class="card-setor">${cartaRecebida.setor}${cartaRecebida.ehDuplicado ? " - Duplicada" : ""}</p>
          </div>
          <div class="atributos-grid">
            <div class="attr-item"><span>VEL</span><span class="attr-valor">${cartaRecebida.velocidade}</span></div>
            <div class="attr-item"><span>CHU</span><span class="attr-valor">${cartaRecebida.chute}</span></div>
            <div class="attr-item"><span>DEF</span><span class="attr-valor">${cartaRecebida.defesa}</span></div>
            <div class="attr-item"><span>ENE</span><span class="attr-valor">${cartaRecebida.energia}</span></div>
          </div>
        `;
        destinoCartas.appendChild(cardEl);
      });

      if (tipoPacote === "inicial") {
        mostrarToast("Caixa inicial resgatada com sucesso!", "sucesso");
      } else if (res.dados.isDuplicate) {
        mostrarToast("Carta duplicada convertida em XP automaticamente.", "info");
      } else if (cartasRecebidas[0]) {
        mostrarToast(`Novo colaborador: ${cartasRecebidas[0].nome}!`, "sucesso");
      }

      sincronizarTelasInternas();
    }, 1500);
  } catch (err) {
    console.error(err);
    overlay.classList.add("hidden");
  }
}

function inicializarEventosAbas() {
  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      navItems.forEach(n => n.classList.remove("active"));
      item.classList.add("active");
      const tab = item.getAttribute("data-tab");
      abrirAba(tab);
    });
  });

  const btnCategorias = document.querySelectorAll(".btn-categoria");
  btnCategorias.forEach(btn => {
    btn.addEventListener("click", () => {
      btnCategorias.forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      categoriaQuizAtiva = btn.getAttribute("data-categoria");
      limparSessaoQuiz();
      carregarQuizzes();
    });
  });

  document.getElementById("btn-abandonar-partida").onclick = () => {
    if (wsRef) {
      wsRef.send(JSON.stringify({ type: "cancel_match" }));
      mostrarToast("Partida abandonada.", "info");
    }
  };
}

function abrirAba(nomeAba) {
  const abas = document.querySelectorAll(".aba-conteudo");
  abas.forEach(aba => {
    if (aba.id === `aba-${nomeAba}`) {
      aba.classList.remove("hidden");
    } else {
      aba.classList.add("hidden");
    }
  });

  if (window.innerWidth <= 768) {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  const navItems = document.querySelectorAll(".nav-item");
  navItems.forEach(n => {
    if (n.getAttribute("data-tab") === nomeAba) {
      n.classList.add("active");
    } else {
      n.classList.remove("active");
    }
  });

  if (nomeAba === "vitrine") {
    carregarVitrine();
  }
}

async function carregarVitrine() {
  const container = document.getElementById("vitrine-cartas-lista");
  const stats = document.getElementById("vitrine-stats");
  if (!container) return;

  try {
    const res = await apiObterColaboradores();
    if (res.sucesso) {
      const todos = res.dados.colaboradores;
      renderizarVitrineCartas(todos, cartasLocal, container);
      
      const possuidos = new Set(cartasLocal.map(c => c.colaborador_id)).size;
      const total = todos.length;
      const pct = Math.round((possuidos / total) * 100);
      
      if (stats) {
        stats.innerHTML = `Coleção: <span class="text-white">${possuidos}/${total}</span> (${pct}%)`;
      }
    }
  } catch (err) {
    console.error("Erro ao carregar vitrine:", err);
    container.innerHTML = `<p class="text-zinc-500 text-xs font-mono">Falha ao carregar vitrine.</p>`;
  }
}

function configurarEventosModais() {
  document.getElementById("btn-modal-selecao-fechar").onclick = () => {
    document.getElementById("modal-selecao-jogador").classList.add("hidden");
  };
  document.getElementById("btn-modal-inspecao-fechar").onclick = () => {
    document.getElementById("modal-inspecao-carta").classList.add("hidden");
  };
  document.getElementById("btn-pack-fechar").onclick = () => {
    document.getElementById("loja-abertura-pack").classList.add("hidden");
  };

  // Modal de Busca de Oponentes
  document.getElementById("btn-abrir-busca-oponente").onclick = () => {
    const modal = document.getElementById("modal-busca-oponente");
    const container = document.getElementById("lista-oponentes-modal");
    const input = document.getElementById("input-busca-oponente");
    
    input.value = "";
    modal.classList.remove("hidden");
    renderizarOponentesModal(todosOponentesLocal, container, (op) => {
      modal.classList.add("hidden");
      desafiarOponenteLiga(op);
    });
  };

  document.getElementById("btn-modal-busca-oponente-fechar").onclick = () => {
    document.getElementById("modal-busca-oponente").classList.add("hidden");
  };

  document.getElementById("input-busca-oponente").addEventListener("input", (e) => {
    const termo = e.target.value.toLowerCase();
    const filtrados = todosOponentesLocal.filter(op => 
      op.nome_usuario.toLowerCase().includes(termo) || 
      (op.time && op.time.some(c => c.setor.toLowerCase().includes(termo)))
    );
    
    renderizarOponentesModal(filtrados, document.getElementById("lista-oponentes-modal"), (op) => {
      document.getElementById("modal-busca-oponente").classList.add("hidden");
      desafiarOponenteLiga(op);
    });
  });

  document.getElementById("btn-salvar-escalacao").onclick = async () => {
    const titulares = cartasLocal.filter(c => c.eh_titular === 1);
    const lineUps = titulares.map(t => ({ cardId: t.id, position: t.posicao }));

    try {
      const res = await apiSalvarEscalacao(usuarioLocal.id, lineUps);
      if (res.sucesso) {
        mostrarToast("✅ Escalação salva com sucesso!", "sucesso");
        cartasLocal = res.dados.cards;
        sincronizarTelasInternas();
      } else {
        mostrarToast(res.mensagem || "Erro ao salvar escalação.", "erro");
      }
    } catch (e) {
      console.error(e);
    }
  };

  document.querySelectorAll(".modal-overlay").forEach(modal => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.add("hidden");
      }
    });
  });
}

function abrirModalEscalacao(posicao) {
  posicaoEscalacaoAlvo = posicao;
  const modal = document.getElementById("modal-selecao-jogador");
  const lista = document.getElementById("modal-selecao-lista");

  modal.classList.remove("hidden");
  lista.innerHTML = "";

  document.getElementById("modal-selecao-titulo").innerText = `Escalar ${posicao.replace('_', ' ')}`;

  // Mostra TODAS as cartas para troca livre
  const candidatos = [...cartasLocal];

  // Destaca quem já está na posição
  candidatos.sort((a, b) => {
    if (a.posicao === posicao) return -1;
    if (b.posicao === posicao) return 1;
    if (a.eh_titular === 1 && b.eh_titular === 0) return -1;
    if (a.eh_titular === 0 && b.eh_titular === 1) return 1;
    return 0;
  });

  if (candidatos.length === 0) {
    lista.innerHTML = `<div class="flex flex-col items-center py-8 text-zinc-500">
      <span class="text-3xl mb-2">📭</span>
      <p class="text-xs font-mono">Nenhum colaborador disponível.</p>
      <p class="text-[10px] mt-1">Abra pacotes no Almoxarifado!</p>
    </div>`;
    return;
  }

  candidatos.forEach(c => {
    const item = document.createElement("div");
    const classeRaridade = obterClasseRaridade(c.raridade);
    const vel = c.velocidade + (c.velocidade_bonus || 0);
    const chu = c.chute + (c.chute_bonus || 0);
    const jaNaPosicao = c.posicao === posicao && c.eh_titular === 1;
    const posicoesAprendidas = c.posicoes_aprendidas ? JSON.parse(c.posicoes_aprendidas) : [];
    const conhecePosicao = posicoesAprendidas.length === 0 || posicoesAprendidas.includes(posicao);

    item.className = `p-3 bg-zinc-900/80 rounded-xl flex items-center justify-between border cursor-pointer transition-all hover:bg-zinc-900 animate-fade-in ${jaNaPosicao ? 'border-primaria/50 bg-primaria/10' : 'border-zinc-800 hover:border-zinc-500'}`;

    const posAtual = c.eh_titular === 1 ? c.posicao.replace('_', ' ') : '—';

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-9 w-9 rounded-lg flex items-center justify-center text-[10px] font-bold ${classeRaridade}">
          Lv ${c.level}
        </div>
        <div>
          <p class="text-xs font-bold text-white leading-tight">${c.nome}</p>
          <p class="text-[9px] text-zinc-500 mt-0.5">${c.setor} · ${c.raridade} · ${posAtual}</p>
        </div>
      </div>
      <div class="flex items-center gap-2">
        <span class="text-[9px] text-zinc-400 font-mono">⚡${vel}</span>
        <span class="text-[9px] text-zinc-400 font-mono">🎯${chu}</span>
        ${jaNaPosicao ? '<span class="text-[9px] text-sucesso">✓</span>' : ''}
      </div>
    `;

    item.onclick = () => {
      selecionarJogadorParaPosicao(c.id, posicao);
      modal.classList.add("hidden");
      if (jaNaPosicao) {
        // Remove da posição
        c.eh_titular = 0;
        c.posicao = "";
        sincronizarTelasInternas();
        mostrarToast(`${c.nome} removido da ${posicao.replace('_', ' ')}`, "info");
      } else {
        mostrarToast(`${c.nome} escalado como ${posicao.replace('_', ' ')}`, "sucesso");
      }
    };

    lista.appendChild(item);
  });
}

function selecionarJogadorParaPosicao(cardId, posicao) {
  // Libera a posição atual de quem está ocupando o slot
  cartasLocal.forEach(c => {
    if (c.posicao === posicao && c.eh_titular === 1) {
      c.eh_titular = 0;
      c.posicao = "";
    }
  });

  // Libera a posição anterior do card selecionado (se ele já era titular em outra posição)
  const carta = cartasLocal.find(c => c.id === cardId);
  if (carta) {
    if (carta.eh_titular === 1 && carta.posicao) {
      // Libera o slot antigo que ele ocupava
      // (não precisa fazer nada pois o slot já será preenchido depois)
    }
    
    // === Evolução Passiva: Incrementa contador de usos consecutivos ===
    // Se a carta já era titular em outra posição, incrementa; senão, zera.
    if (carta.eh_titular === 1 && carta.posicao !== posicao) {
      carta.usosConsecutivos = (carta.usosConsecutivos || 0) + 1;
      // Se atingiu 5 usos consecutivos, dispara evolução automática
      if (carta.usosConsecutivos >= 5) {
        carta.usosConsecutivos = 0;
        // Marca para evolução (aplicaremos quando sincronizar)
        carta.evoluirAutomatico = true;
        mostrarToast(`🔥 ${carta.nome} atingiu 5 usos consecutivos! Evoluindo automaticamente...`, "sucesso");
      }
    } else {
      carta.usosConsecutivos = 1;
    }
    
    carta.eh_titular = 1;
    carta.posicao = posicao;
  }

  sincronizarTelasInternas();
}

function removerSlotPosicao(cardId, posicao) {
  const carta = cartasLocal.find(c => c.id === cardId);
  if (carta) {
    carta.eh_titular = 0;
    carta.posicao = "";
    mostrarToast(`${carta.nome} removido da ${posicao.replace('_', ' ')}`, "info");
    sincronizarTelasInternas();
  }
}

function inspecionarCarta(carta) {
  cartaInspecionadaLocal = carta;
  const modal = document.getElementById("modal-inspecao-carta");
  const container = document.getElementById("modal-inspecao-detalhe");

  modal.classList.remove("hidden");
  container.innerHTML = "";

  const classeRaridade = obterClasseRaridade(carta.raridade);
  const vel = carta.velocidade + (carta.velocidade_bonus || 0);
  const chu = carta.chute + (carta.chute_bonus || 0);
  const def = carta.defesa + (carta.defesa_bonus || 0);
  const ene = carta.energia + (carta.energia_bonus || 0);
  const overall = Math.round((vel + chu + def + ene) / 4);

  const custoMoedas = carta.level * 120;
  const podeTreinar = carta.xp >= 40 && usuarioLocal.moedas >= custoMoedas;

  const posicoesAprendidas = carta.posicoes_aprendidas ? JSON.parse(carta.posicoes_aprendidas) : [];

  const emojiRaridade = {
    "Mítico": "💀",
    "Lendário": "💎",
    "Épico": "⭐",
    "Raro": "🔷",
    "Comum": "⬜"
  }[carta.raridade] || "";

  container.innerHTML = `
    <div class="carta-colaborador ${classeRaridade} pointer-events-none scale-105 shadow-2xl mb-2">
      <div class="card-header">
        <span class="nivel-tag">${emojiRaridade} Lv ${carta.level}</span>
        <span class="raridade-badge">${carta.raridade}</span>
      </div>
      <div>
        <h4 class="card-nome">${carta.nome}</h4>
        <p class="card-setor">${carta.setor} ${carta.eh_titular === 1 ? `· ${carta.posicao.replace('_', ' ')}` : ''}</p>
      </div>
      <div class="atributos-grid">
        <div class="attr-item"><span>⚡ VEL</span><span class="attr-valor">${vel}</span></div>
        <div class="attr-item"><span>🎯 CHU</span><span class="attr-valor">${chu}</span></div>
        <div class="attr-item"><span>🛡️ DEF</span><span class="attr-valor">${def}</span></div>
        <div class="attr-item"><span>❤️ ENE</span><span class="attr-valor">${ene}</span></div>
      </div>
    </div>

    <div class="w-full flex items-center justify-center gap-3 mb-3">
      <span class="text-[11px] font-bold font-mono text-moeda bg-moeda/10 px-3 py-1 rounded-full">Overall ${overall}</span>
      <span class="text-[11px] font-bold font-mono text-amber-400 bg-amber-400/10 px-3 py-1 rounded-full">XP ${carta.xp}/100</span>
    </div>

    <!-- Posições Aprendidas -->
    <div class="w-full p-3 bg-zinc-900/60 rounded-xl border border-zinc-800 mb-3">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-[11px] font-bold uppercase text-zinc-400 font-mono tracking-wider">Posições</h4>
        <span class="text-[9px] font-mono text-zinc-500">${posicoesAprendidas.length > 0 ? posicoesAprendidas.map(p => p.replace('_', ' ')).join(', ') : 'Nenhuma'}</span>
      </div>
      <div class="grid grid-cols-5 gap-1">
        ${["GOLEIRO","DEFENSOR","ALA_DIREITA","ALA_ESQUERDA","ATACANTE"].map(pos => {
          const conhece = posicoesAprendidas.includes(pos);
          return `<button class="btn-treinar-pos text-[8px] font-bold py-1.5 rounded-md transition-all ${conhece ? 'bg-emerald-700/40 text-emerald-300 border border-emerald-700/50' : 'bg-zinc-800 text-zinc-500 border border-zinc-700 hover:bg-zinc-700'}" data-pos="${pos}" ${conhece ? 'disabled' : ''}>
            ${conhece ? '✓' : '+'} ${pos.replace('_', ' ').slice(0, 5)}
          </button>`;
        }).join('')}
      </div>
      <p class="text-[8px] text-zinc-600 mt-1.5">💰 300 Moedas NL para aprender nova posição</p>
    </div>

    <div class="w-full p-3 bg-zinc-900/60 rounded-xl border border-zinc-800">
      <div class="flex justify-between items-center mb-2">
        <h4 class="text-[11px] font-bold uppercase text-zinc-400 font-mono tracking-wider">Treinar Atributo</h4>
        <span class="text-[9px] font-mono text-zinc-500">💰 300 Moedas NL · 40 XP</span>
      </div>

      <div class="grid grid-cols-2 gap-2">
        <button class="btn-treinar btn-secundario text-[9px] font-bold py-2 rounded-lg text-white ${!podeTreinar ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-700'}" data-attr="velocidade" ${!podeTreinar ? 'disabled' : ''}>
          ⚡ Velocidade
        </button>
        <button class="btn-treinar btn-secundario text-[9px] font-bold py-2 rounded-lg text-white ${!podeTreinar ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-700'}" data-attr="chute" ${!podeTreinar ? 'disabled' : ''}>
          🎯 Chute
        </button>
        <button class="btn-treinar btn-secundario text-[9px] font-bold py-2 rounded-lg text-white ${!podeTreinar ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-700'}" data-attr="defesa" ${!podeTreinar ? 'disabled' : ''}>
          🛡️ Defesa
        </button>
        <button class="btn-treinar btn-secundario text-[9px] font-bold py-2 rounded-lg text-white ${!podeTreinar ? 'opacity-40 cursor-not-allowed' : 'hover:bg-zinc-700'}" data-attr="energia" ${!podeTreinar ? 'disabled' : ''}>
          ❤️ Energia
        </button>
      </div>
    </div>
  `;

  // Eventos dos botões de treinar posição
  container.querySelectorAll(".btn-treinar-pos:not([disabled])").forEach(btn => {
    btn.onclick = async () => {
      const pos = btn.getAttribute("data-pos");

      const confirmar = confirm(`Treinar ${carta.nome} para ${pos.replace('_', ' ')}? Custo: 300 Moedas NL.`);
      if (!confirmar) return;

      modal.classList.add("hidden");

      try {
        const res = await apiTreinarPosicao(usuarioLocal.id, carta.id, pos);
        if (res.sucesso) {
          mostrarToast(res.mensagem || `✅ ${carta.nome} aprendeu ${pos.replace('_', ' ')}!`, "sucesso");
          usuarioLocal = res.dados.user;
          cartasLocal = res.dados.cards;
          trofeusLocal = res.dados.trophies;
          sincronizarTelasInternas();
        } else {
          mostrarToast(res.mensagem || "Erro ao treinar posição.", "erro");
        }
      } catch (err) {
        console.error(err);
      }
    };
  });

  container.querySelectorAll(".btn-treinar").forEach(btn => {
    btn.onclick = async () => {
      const attr = btn.getAttribute("data-attr");
      modal.classList.add("hidden");

      try {
        const res = await apiMelhorarCarta(usuarioLocal.id, carta.id, attr);
        if (res.sucesso) {
          mostrarToast(`✅ ${carta.nome} treinou ${attr}! +5 pontos!`, "sucesso");

          usuarioLocal = res.dados.user;
          cartasLocal = res.dados.cards;
          trofeusLocal = res.dados.trophies;

          sincronizarTelasInternas();
        } else {
          mostrarToast(res.mensagem || "Erro durante o treinamento.", "erro");
        }
      } catch (err) {
        console.error(err);
      }
    };
  });
}

function mostrarToast(mensagem, tipo) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  const bgColor = {
    sucesso: "rgba(16, 185, 129, 0.95)",
    erro: "rgba(239, 68, 68, 0.95)",
    info: "rgba(59, 130, 246, 0.95)"
  }[tipo] || "rgba(30, 41, 59, 0.95)";

  const borderColor = {
    sucesso: "rgba(16, 185, 129, 0.3)",
    erro: "rgba(239, 68, 68, 0.3)",
    info: "rgba(59, 130, 246, 0.3)"
  }[tipo] || "rgba(255, 255, 255, 0.1)";

  toast.style.cssText = `
    background: ${bgColor};
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border: 1px solid ${borderColor};
    color: white;
    padding: 12px 18px;
    border-radius: 12px;
    font-size: 12px;
    font-weight: 600;
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
    animation: slideInRight 0.3s ease forwards;
    max-width: 360px;
    pointer-events: auto;
    cursor: pointer;
  `;
  toast.innerText = mensagem;

  toast.addEventListener("click", () => {
    toast.style.animation = "slideInRight 0.3s ease reverse forwards";
    setTimeout(() => toast.remove(), 300);
  });

  container.appendChild(toast);

  setTimeout(() => {
    if (toast.parentNode) {
      toast.style.animation = "slideInRight 0.3s ease reverse forwards";
      setTimeout(() => toast.remove(), 300);
    }
  }, 4000);
}




