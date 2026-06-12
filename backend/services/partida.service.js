import { usuariosRepository } from '../repositories/usuarios.repository.js';
import { dbAll } from '../database/connection.js';

// ── CONFIGURAÇÃO DAS LIGAS ──────────────────────────────────────────────
const LIGAS = [
  {
    id: "liga_manutencao",
    nome: "Liga da Manutenção",
    setores: ["MANUTENCAO", "OFICINA", "ALMOXARIFADO", "SERVICOS GERAIS", "SERVICOS DIVERSOS"],
    emoji: "🔧",
    cor: "#e11d48",
    descricao: "Mecânicos, almoxarifes e equipe de serviços que mantêm a operação no ar.",
    tiers: [
      { chave: "manut_0", nome: "Aprendizes da Oficina", nivelMin: 0, nivelMax: 1, estrelas: "⭐", dificuldade: 0.7, recompensa: 80 },
      { chave: "manut_1", nome: "Mecânicos Efetivos", nivelMin: 2, nivelMax: 2, estrelas: "⭐⭐", dificuldade: 0.85, recompensa: 120 },
      { chave: "manut_2", nome: "Especialistas Técnicos", nivelMin: 3, nivelMax: 3, estrelas: "⭐⭐⭐", dificuldade: 1.0, recompensa: 180 },
      { chave: "manut_3", nome: "Liderança da Manutenção", nivelMin: 4, nivelMax: 5, estrelas: "⭐⭐⭐⭐", dificuldade: 1.2, recompensa: 280 }
    ]
  },
  {
    id: "liga_comercial",
    nome: "Liga Comercial",
    setores: ["COMERCIAL", "MARKETING"],
    emoji: "💼",
    cor: "#3b82f6",
    descricao: "Consultores, designers e estrategistas que vendem e promovem a NDL.",
    tiers: [
      { chave: "com_0", nome: "Consultores Júnior", nivelMin: 0, nivelMax: 1, estrelas: "⭐", dificuldade: 0.7, recompensa: 80 },
      { chave: "com_1", nome: "Consultores Pleno", nivelMin: 2, nivelMax: 2, estrelas: "⭐⭐", dificuldade: 0.85, recompensa: 120 },
      { chave: "com_2", nome: "Consultores Sênior", nivelMin: 3, nivelMax: 3, estrelas: "⭐⭐⭐", dificuldade: 1.0, recompensa: 180 },
      { chave: "com_3", nome: "Alta Gestão Comercial", nivelMin: 4, nivelMax: 5, estrelas: "⭐⭐⭐⭐", dificuldade: 1.2, recompensa: 280 }
    ]
  },
  {
    id: "liga_logistica",
    nome: "Liga Logística",
    setores: ["LOGISTICA", "LOGÍSTICA", "LOGISTICA"],
    emoji: "🚚",
    cor: "#f59e0b",
    descricao: "Motoristas, motociclistas e heróis da logística que entregam resultados.",
    tiers: [
      { chave: "log_0", nome: "Logística Operacional", nivelMin: 0, nivelMax: 1, estrelas: "⭐", dificuldade: 0.7, recompensa: 80 },
      { chave: "log_1", nome: "Logística Tática", nivelMin: 2, nivelMax: 2, estrelas: "⭐⭐", dificuldade: 0.85, recompensa: 120 },
      { chave: "log_2", nome: "Supervisão Logística", nivelMin: 3, nivelMax: 5, estrelas: "⭐⭐⭐", dificuldade: 1.1, recompensa: 220 }
    ]
  },
  {
    id: "liga_administrativa",
    nome: "Liga Administrativa",
    setores: ["ADMINISTRATIVO", "Administrativo", "GENTE E GESTAO", "FINANCEIRO", "CONTABIL", "COMPRAS", "RH"],
    emoji: "📊",
    cor: "#a855f7",
    descricao: "Financeiro, RH, contabilidade, compras — a engrenagem que faz a empresa girar.",
    tiers: [
      { chave: "adm_0", nome: "Assistentes Administrativos", nivelMin: 0, nivelMax: 1, estrelas: "⭐", dificuldade: 0.7, recompensa: 80 },
      { chave: "adm_1", nome: "Analistas e Plenos", nivelMin: 2, nivelMax: 2, estrelas: "⭐⭐", dificuldade: 0.85, recompensa: 120 },
      { chave: "adm_2", nome: "Especialistas e Sêniores", nivelMin: 3, nivelMax: 3, estrelas: "⭐⭐⭐", dificuldade: 1.0, recompensa: 180 },
      { chave: "adm_3", nome: "Liderança Administrativa", nivelMin: 4, nivelMax: 5, estrelas: "⭐⭐⭐⭐", dificuldade: 1.2, recompensa: 280 }
    ]
  },
  {
    id: "liga_elite",
    nome: "Liga de Elite",
    setores: ["NIT", "BI", "DIRETORIA"],
    emoji: "👑",
    cor: "#ef4444",
    descricao: "NIT, BI e a Cúpula Diretiva — o confronto final da Arena NDL.",
    tiers: [
      { chave: "elite_0", nome: "Escalão de Suporte", nivelMin: 0, nivelMax: 1, estrelas: "⭐⭐", dificuldade: 0.8, recompensa: 100 },
      { chave: "elite_1", nome: "Analistas & BI", nivelMin: 2, nivelMax: 2, estrelas: "⭐⭐⭐", dificuldade: 0.95, recompensa: 150 },
      { chave: "elite_2", nome: "Supervisão & Estratégia", nivelMin: 3, nivelMax: 3, estrelas: "⭐⭐⭐⭐", dificuldade: 1.1, recompensa: 250 },
      { chave: "elite_3", nome: "Alta Diretoria", nivelMin: 4, nivelMax: 5, estrelas: "⭐⭐⭐⭐⭐", dificuldade: 1.35, recompensa: 450 }
    ]
  }
];

// ── AUXILIARES ──────────────────────────────────────────────────────────
function classificarNivelCargo(cargo) {
  const c = (cargo || '').toUpperCase();
  if (c.includes('GERENTE')) return 5;
  if (c.includes('COORDENADOR') || c.includes('SUPERVISOR') || c.includes('ESPECIALISTA') || c.includes('LIDER')) return 4;
  if (c.includes('SENIOR')) return 3;
  if (c.includes('PLENO')) return 2;
  if (c.includes('ANALISTA') || c.includes('CONSULTOR') || c.includes('DESIGNER') || c.includes('COMPRADOR')) return 2;
  if (c.includes('MECANICO') && !c.includes('JUNIOR') && !c.includes('AUX')) return 2;
  if (c.includes('ESTAGIARIO') || c.includes('AUX') || c.includes('JUNIOR') || c.includes('MOTORISTA') || c.includes('MOTOCICLISTA')) return 1;
  if (c.includes('ASSISTENTE') && (c.includes('III') || c.includes('SENIOR'))) return 2;
  if (c.includes('ASSISTENTE') || c.includes('OFICIAL') || c.includes('SERVICOS')) return 1;
  return 1;
}

function extrairInfoFaseChave(faseChave) {
  for (const liga of LIGAS) {
    for (let i = 0; i < liga.tiers.length; i++) {
      if (liga.tiers[i].chave === faseChave) {
        return { liga, tierIndex: i, tier: liga.tiers[i] };
      }
    }
  }
  return null;
}

// ── TIME OPONENTE ───────────────────────────────────────────────────────
const ELITE_FIXOS = ["Rafael Morais", "Ricardo Antero", "Emerson Neri", "Rinaldi Oliveira Martins", "Nicassio Bernardo Silva"];
const ELITE_EXTRAS = ["Erika Bethania Rizza Machado", "Vitor Fernandes Mendes Martins", "Felipe Reis Verissimo"];

export async function obterTimeOponente(faseChave) {
  const info = extrairInfoFaseChave(faseChave);

  // Time fixo para Alta Diretoria
  if (faseChave === "elite_3") {
    const placeholders = [...ELITE_FIXOS, ...ELITE_EXTRAS].map(() => '?').join(',');
    const todos = await dbAll(`SELECT * FROM colaboradores WHERE nome IN (${placeholders})`,
      [...ELITE_FIXOS, ...ELITE_EXTRAS]);

    const mapa = Object.fromEntries(todos.map(c => [c.nome, c]));

    // Sempre pega os fixos, embaralha e tira 5
    let selecionados = ELITE_FIXOS.map(n => mapa[n]).filter(Boolean);

    // Às vezes adiciona um extra no lugar de alguém
    if (Math.random() < 0.5) {
      const extra = ELITE_EXTRAS.filter(n => mapa[n]);
      if (extra.length > 0) {
        const sorteado = extra[Math.floor(Math.random() * extra.length)];
        selecionados[Math.floor(Math.random() * selecionados.length)] = mapa[sorteado];
      }
    }

    // Chance de personagem secreto (Felipe)
    if (Math.random() < 0.3 && mapa["Felipe Reis Verissimo"]) {
      const idx = Math.floor(Math.random() * selecionados.length);
      selecionados[idx] = mapa["Felipe Reis Verissimo"];
    }

    return montarTimeOponente(embaralhar(selecionados).slice(0, 5), 1.35);
  }

  if (!info) {
    const colabs = await usuariosRepository.obterColaboradoresDisponiveis();
    return montarTimeOponente(embaralhar(colabs).slice(0, 5), 0.8);
  }

  const { liga, tier } = info;
  const setores = liga.setores;

  // Busca TODOS os colaboradores dos setores da liga
  const placeholdersSetor = setores.map(() => '?').join(',');
  const todos = await dbAll(`SELECT * FROM colaboradores WHERE setor IN (${placeholdersSetor})`, [...setores]);

  // Classifica por nível de cargo
  const classificados = todos.map(c => ({
    ...c,
    nivel: classificarNivelCargo(c.cargo)
  }));

  // Filtra pelo range de nível do tier
  let filtrados = classificados.filter(c => c.nivel >= tier.nivelMin && c.nivel <= tier.nivelMax);

  // Se não houver suficientes, expande para níveis adjacentes
  if (filtrados.length < 5) {
    const adjacentes = classificados
      .filter(c => c.nivel < tier.nivelMin || c.nivel > tier.nivelMax)
      .sort((a, b) => Math.abs(a.nivel - tier.nivelMin) - Math.abs(b.nivel - tier.nivelMin));
    filtrados = [...filtrados, ...adjacentes];
  }

  if (filtrados.length < 5) {
    filtrados = classificados;
  }

  // Fallback global
  if (filtrados.length < 5) {
    const colabs = await usuariosRepository.obterColaboradoresDisponiveis();
    return montarTimeOponente(embaralhar(colabs).slice(0, 5), 0.8);
  }

  const selecionados = embaralhar(filtrados).slice(0, 5);
  return montarTimeOponente(selecionados, tier.dificuldade);
}

function montarTimeOponente(colaboradores, dificuldade) {
  const posicoes = ["GOLEIRO", "DEFENSOR", "ALA_DIREITA", "ALA_ESQUERDA", "ATACANTE"];
  return colaboradores.map((colab, index) => ({
    id: `opp_${index + 1}`,
    nome: colab.nome,
    setor: colab.setor,
    velocidade: Math.min(99, Math.round((colab.velocidade || 50) * dificuldade)),
    chute: Math.min(99, Math.round((colab.chute || 50) * dificuldade)),
    defesa: Math.min(99, Math.round((colab.defesa || 50) * dificuldade)),
    energia: Math.min(99, Math.round((colab.energia || 50) * dificuldade)),
    raridade: colab.raridade || 'Comum',
    posicao: posicoes[index],
    ehUsuario: false,
    x: 0, y: 0,
    stamina: 100
  }));
}

function embaralhar(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// ── NARRAÇÕES ───────────────────────────────────────────────────────────
const NARRACOES_GOL = [
  "GOOOOOOL! Que golaço! A torcida vai à loucura!",
  "REDE! Bola no fundo do gol! Golaço!",
  "É GOL! Finalização perfeita, sem chances para o goleiro!",
  "GOLAÇO! Que jogada ensaiada linda!",
  "BANG! Bola explodindo no fundo da rede! Gol do jogo!"
];

// ── SIMULAÇÃO ───────────────────────────────────────────────────────────
export class SimulacaoPartida {
  constructor(usuarioId, faseChave, titularesUsuario) {
    this.usuarioId = usuarioId;
    this.faseChave = faseChave;
    this.minuto = 0;
    this.placarUsuario = 0;
    this.placarOponente = 0;
    this.jogadores = [];
    this.bola = { x: 50, y: 50, donoId: null };
    this.vencedor = null;
    this.finalizada = false;
    this.pausaPosGol = 0;
    this.proximaSaidaUsuario = true;
    this.ultimaHabilidade = null;

    const climas = ["Sol", "Nublado", "Chuva"];
    this.clima = climas[Math.floor(Math.random() * climas.length)];
    this.climaMod = this.clima === "Chuva" ? 0.75 : 1.0;

    this.jogadoresUsuario = titularesUsuario.map((carta) => ({
      id: `user_${carta.id}`,
      nome: carta.nome,
      setor: carta.setor,
      velocidade: Math.min(99, (carta.velocidade || 0) + (carta.velocidade_bonus || 0)),
      chute: Math.min(99, (carta.chute || 0) + (carta.chute_bonus || 0)),
      defesa: Math.min(99, (carta.defesa || 0) + (carta.defesa_bonus || 0)),
      energia: Math.min(99, (carta.energia || 0) + (carta.energia_bonus || 0)),
      raridade: carta.raridade,
      posicao: carta.posicao || "ATACANTE",
      ehUsuario: true,
      x: 0, y: 0,
      stamina: 100,
      habilidadeAtiva: false
    }));
  }

  async inicializar() {
    const oponentes = await obterTimeOponente(this.faseChave);
    this.jogadores = [...this.jogadoresUsuario, ...oponentes];
    this.resetarPosicoes(true);
    this.pausaPosGol = 10;
  }

  inicializarPvP(jogadoresOponente) {
    this.jogadores = [...this.jogadoresUsuario, ...jogadoresOponente];
    this.resetarPosicoes(true);
    this.pausaPosGol = 10;
  }

  resetarPosicoes(saidaUsuario) {
    const posicoes = {
      GOLEIRO: { u: [8, 50], o: [92, 50] },
      DEFENSOR: { u: [28, 50], o: [72, 50] },
      ALA_DIREITA: { u: [42, 78], o: [58, 22] },
      ALA_ESQUERDA: { u: [42, 22], o: [58, 78] },
      ATACANTE: { u: [55, 50], o: [45, 50] }
    };

    this.jogadores.forEach(p => {
      const pos = posicoes[p.posicao] || posicoes.ATACANTE;
      const coord = p.ehUsuario ? pos.u : pos.o;
      p.x = coord[0] + (Math.random() - 0.5) * 4;
      p.y = coord[1] + (Math.random() - 0.5) * 4;
      p.stamina = Math.min(100, p.stamina + 15);
    });

    this.bola.x = 50;
    this.bola.y = 50;
    const atacanteDono = this.jogadores.find(p => p.ehUsuario === saidaUsuario && p.posicao === "ATACANTE");
    this.bola.donoId = atacanteDono ? atacanteDono.id : null;
  }

  ativarHabilidade(jogador) {
    if (jogador.habilidadeAtiva) return null;

    let msg = "";
    switch (jogador.raridade) {
      case "Mítico":
        jogador.chute += 40;
        msg = "🔥 CHUTE ATÔMICO ATIVADO!";
        break;
      case "Lendário":
        jogador.velocidade += 40;
        msg = "⚡ VELOCIDADE DA LUZ!";
        break;
      case "Épico":
        jogador.defesa += 40;
        msg = "🛡️ MURALHA DEFENSIVA!";
        break;
      default:
        jogador.stamina = Math.min(100, jogador.stamina + 30);
        msg = "💊 GÁS EXTRA!";
    }

    jogador.habilidadeAtiva = true;
    setTimeout(() => {
      if (jogador.raridade === "Mítico") jogador.chute -= 40;
      if (jogador.raridade === "Lendário") jogador.velocidade -= 40;
      if (jogador.raridade === "Épico") jogador.defesa -= 40;
      jogador.habilidadeAtiva = false;
    }, 5000);

    return msg;
  }

  async tick() {
    if (this.finalizada) {
      return this.obterEstado("end", "Fim de jogo!");
    }

    this.jogadores.forEach(p => {
      if (!p.habilidadeAtiva && Math.random() < 0.004) {
        const msg = this.ativarHabilidade(p);
        if (msg) this.ultimaHabilidade = { nome: p.nome, msg };
      }
    });

    if (this.pausaPosGol === 0) {
      this.tickContador = (this.tickContador || 0) + 1;
      if (this.tickContador >= 2) {
        this.minuto += 1;
        this.tickContador = 0;
      }
    }

    if (this.pausaPosGol > 0) {
      this.pausaPosGol--;
      if (this.pausaPosGol === 0) {
        this.resetarPosicoes(this.proximaSaidaUsuario);
      }
      return this.obterEstado("idle", "⚡ A partida recomeçará em breve...");
    }

    if (this.minuto >= 50 || this.placarUsuario >= 2 || this.placarOponente >= 2) {
      return await this.finalizarPartida();
    }

    this.jogadores.forEach(p => {
      if (p.posicao === "GOLEIRO") {
        p.y += (this.bola.y - p.y) * 0.15;
        p.x += (p.ehUsuario ? 5 - p.x : 95 - p.x) * 0.1;
        return;
      }

      const energiaFactor = p.stamina / 100;
      const velEfetiva = p.velocidade * (0.4 + energiaFactor * 0.6) * this.climaMod;
      const taxaInterpolacao = 0.05 + (velEfetiva / 100) * 0.04;

      let alvoX, alvoY;
      const direcao = p.ehUsuario ? 1 : -1;
      const distAteBola = Math.hypot(p.x - this.bola.x, p.y - this.bola.y);
      const bolaComInimigo = this.bola.donoId && this.jogadores.find(j => j.id === this.bola.donoId)?.ehUsuario !== p.ehUsuario;

      if (bolaComInimigo && distAteBola < 30) {
        alvoX = this.bola.x;
        alvoY = this.bola.y;
      } else {
        switch (p.posicao) {
          case "DEFENSOR":
            alvoX = p.ehUsuario ? 15 + this.bola.x * 0.2 : 85 - (100 - this.bola.x) * 0.2;
            alvoY = 50 + (this.bola.y - 50) * 0.4;
            break;
          case "ALA_DIREITA":
            alvoX = p.ehUsuario ? 30 + this.bola.x * 0.35 : 70 - (100 - this.bola.x) * 0.35;
            alvoY = p.ehUsuario ? 80 : 20;
            break;
          case "ALA_ESQUERDA":
            alvoX = p.ehUsuario ? 30 + this.bola.x * 0.35 : 70 - (100 - this.bola.x) * 0.35;
            alvoY = p.ehUsuario ? 20 : 80;
            break;
          default:
            alvoX = p.ehUsuario ? 45 + this.bola.x * 0.45 : 55 - (100 - this.bola.x) * 0.45;
            alvoY = 50 + (this.bola.y - 50) * 0.5;
            break;
        }
      }

      if (this.bola.donoId === p.id) {
        alvoX = p.ehUsuario ? 100 : 0;
        alvoY = 50 + (this.bola.y - 50) * 0.1;
      }

      alvoX = Math.max(5, Math.min(95, alvoX));
      alvoY = Math.max(5, Math.min(95, alvoY));

      p.x += (alvoX - p.x) * taxaInterpolacao;
      p.y += (alvoY - p.y) * taxaInterpolacao;

      p.stamina = Math.max(10, p.stamina - (0.12 / this.climaMod) + (p.energia / 100) * 0.08);
    });

    if (!this.bola.donoId) return this.bolaSolta();

    const dono = this.jogadores.find(p => p.id === this.bola.donoId);
    if (!dono) { this.bola.donoId = null; return this.obterEstado("idle", "Bola em disputa!"); }

    this.bola.x = dono.x;
    this.bola.y = dono.y;

    const ehLadoUsuario = dono.ehUsuario;
    const distanciaAteGol = ehLadoUsuario ? (100 - dono.x) : dono.x;

    const oponentesPerto = this.jogadores.filter(p => p.ehUsuario !== dono.ehUsuario && p.posicao !== "GOLEIRO" && Math.hypot(p.x - dono.x, p.y - dono.y) < 10);
    if (oponentesPerto.length > 0) {
      const ladrao = oponentesPerto[0];
      if (ladrao.defesa * (0.5 + Math.random() * 0.6) > dono.velocidade * (0.4 + Math.random() * 0.5)) {
        this.bola.donoId = ladrao.id;
        return this.obterEstado("tackle", `⚡ ${ladrao.nome} roubou a bola!`);
      }
    }

    if (Math.random() < 0.15) {
      const companheiros = this.jogadores.filter(p => p.ehUsuario === dono.ehUsuario && p.id !== dono.id && (ehLadoUsuario ? p.x > dono.x : p.x < dono.x));
      if (companheiros.length > 0) {
        const receptor = companheiros[Math.floor(Math.random() * companheiros.length)];
        this.bola.donoId = receptor.id;
        return this.obterEstado("pass", `⚽ Passe de ${dono.nome} para ${receptor.nome}!`);
      }
    }

    if (distanciaAteGol < 30 && Math.random() < 0.3) {
      const goleiro = this.jogadores.find(p => p.ehUsuario !== dono.ehUsuario && p.posicao === "GOLEIRO");
      if ((dono.chute * 0.7 + Math.random() * 40) > (goleiro?.defesa * 0.6 + Math.random() * 40)) {
        this.bola.donoId = null;
        this.bola.x = ehLadoUsuario ? 100 : 0;
        this.bola.y = 45 + Math.random() * 10;
        if (dono.ehUsuario) this.placarUsuario++; else this.placarOponente++;
        this.pausaPosGol = 15;
        this.proximaSaidaUsuario = !dono.ehUsuario;
        return this.obterEstado("goal", `${NARRACOES_GOL[Math.floor(Math.random() * NARRACOES_GOL.length)]} ${dono.nome} marca!`);
      } else {
        this.bola.donoId = null;
        this.bola.x = ehLadoUsuario ? 95 : 5;
        this.bola.y = 50 + (Math.random() - 0.5) * 40;
        return this.obterEstado("save", `🧤 Defesa de ${goleiro?.nome || 'Goleiro'}!`);
      }
    }

    return this.obterEstado("dribble", `🏃 ${dono.nome} avança!`);
  }

  async finalizarPartida() {
    this.finalizada = true;
    this.vencedor = this.placarUsuario > this.placarOponente ? "usuario" : (this.placarOponente > this.placarUsuario ? "oponente" : "empate");
    await usuariosRepository.gravarResultadoPartida(this.usuarioId, this.vencedor === "usuario", this.placarUsuario, this.placarOponente);

    // Award XP to all user cards for participating
    const xpPorCarta = 15;
    for (const jogador of this.jogadoresUsuario) {
      const cartaId = Number(jogador.id.replace('user_', ''));
      await usuariosRepository.adicionarXpCarta(this.usuarioId, cartaId, xpPorCarta);
    }

    const info = extrairInfoFaseChave(this.faseChave);
    const recompensaPadrao = 80;
    const recompensa = info ? info.tier.recompensa : recompensaPadrao;
    const nomeLiga = info ? info.liga.nome : this.faseChave;

    let msg = "";
    if (this.vencedor === "usuario") {
      const campanha = await usuariosRepository.obterCampanhaUsuario(this.usuarioId);
      const jaVenceu = campanha[this.faseChave] === true;
      const recompensaFinal = jaVenceu ? Math.floor(recompensa / 2) : recompensa;

      if (!jaVenceu) {
        await usuariosRepository.salvarFaseCampanha(this.usuarioId, this.faseChave, true);
      }
      await usuariosRepository.adicionarMoedas(this.usuarioId, recompensaFinal);
      msg = `🏆 Vitória contra ${nomeLiga}! ${this.placarUsuario}x${this.placarOponente}! +${recompensaFinal} Moedas${jaVenceu ? ' (rejogada)' : ''}! 💪 +${this.jogadoresUsuario.length * xpPorCarta} XP`;

      // Troféus específicos
      if (this.faseChave === "elite_3") {
        await usuariosRepository.desbloquearTrofeu(this.usuarioId, "Lenda da Nordeste");
      }
      const ligaCompleta = await verificarLigaCompleta(this.usuarioId, info?.liga);
      if (ligaCompleta) {
        const trofeusLiga = {
          "liga_manutencao": "Melhor do Mês",
          "liga_comercial": "Vendedor Destaque",
          "liga_logistica": "Entregador Ágil",
          "liga_administrativa": "Guardião do Orçamento",
          "liga_elite": "Lenda da Nordeste"
        };
        const trofeu = trofeusLiga[info?.liga?.id];
        if (trofeu) {
          await usuariosRepository.desbloquearTrofeu(this.usuarioId, trofeu);
        }
        if (info?.liga?.id === "liga_elite") {
          await usuariosRepository.desbloquearTrofeu(this.usuarioId, "Seleção Implacável");
          await usuariosRepository.concederRecompensaSelecao(this.usuarioId, 120, 30);
        }
        msg += ` 🎉 ${info.liga.nome} COMPLETA!`;
      }
    } else if (this.vencedor === "empate") {
      await usuariosRepository.adicionarMoedas(this.usuarioId, 50);
      msg = `🤝 Empate contra ${nomeLiga}! ${this.placarUsuario}x${this.placarOponente}. +50 Moedas. 💪 +${this.jogadoresUsuario.length * xpPorCarta} XP`;
    } else {
      msg = `💔 Derrota contra ${nomeLiga}! ${this.placarOponente}x${this.placarUsuario}. Treine mais! 💪 +${this.jogadoresUsuario.length * xpPorCarta} XP`;
    }
    return this.obterEstado("end", msg);
  }

  bolaSolta() {
    let maisPerto = this.jogadores[0];
    let menorDist = 999;
    this.jogadores.forEach(p => {
      const d = Math.hypot(p.x - this.bola.x, p.y - this.bola.y);
      if (d / Math.max(10, p.velocidade) < menorDist) { menorDist = d / p.velocidade; maisPerto = p; }
    });
    this.bola.donoId = maisPerto.id;
    return this.obterEstado("pass", `📥 ${maisPerto.nome} recupera a bola!`);
  }

  obterEstado(tipoEvento, narracao) {
    let narracaoFinal = narracao;
    if (this.ultimaHabilidade) {
      narracaoFinal = `🌟 ${this.ultimaHabilidade.nome}: ${this.ultimaHabilidade.msg}`;
      this.ultimaHabilidade = null;
    }
    return {
      minuto: this.minuto,
      placarUsuario: this.placarUsuario,
      placarOponente: this.placarOponente,
      jogadores: this.jogadores.map(p => ({ 
        ...p, 
        stamina: Math.round(p.stamina),
        habilidadeAtiva: p.habilidadeAtiva 
      })),
      bola: { ...this.bola },
      narracao: narracaoFinal,
      tipoEvento,
      finalizada: this.finalizada,
      vencedor: this.vencedor,
      clima: this.clima
    };
  }
}

async function verificarLigaCompleta(usuarioId, liga) {
  if (!liga) return false;
  const campanha = await usuariosRepository.obterCampanhaUsuario(usuarioId);
  return liga.tiers.every(t => campanha[t.chave] === true);
}

export { LIGAS, extrairInfoFaseChave };
