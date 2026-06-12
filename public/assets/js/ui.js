export function obterClasseRaridade(raridade) {
  switch (raridade) {
    case "Mítico": return "mitico";
    case "Lendário": return "lendario";
    case "Épico": return "epico";
    case "Raro": return "raro";
    default: return "comum";
  }
}

export function obterEmojiRaridade(raridade) {
  switch (raridade) {
    case "Mítico": return "💀";
    case "Lendário": return "💎";
    case "Épico": return "⭐";
    case "Raro": return "🔷";
    default: return "⬜";
  }
}

export const SVG_ICONES = {
  presente: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="7" width="18" height="4" rx="1"/><path d="M12 7v14"/><path d="M16 7c0-2.5-1.5-4-4-4S8 4.5 8 7"/></svg>`,
  bronze: `<svg viewBox="0 0 24 24" fill="none" stroke="#cd7f32" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  prata: `<svg viewBox="0 0 24 24" fill="none" stroke="#c0c0c0" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  ouro: `<svg viewBox="0 0 24 24" fill="none" stroke="#ffd700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  lendario: `<svg viewBox="0 0 24 24" fill="none" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 9l10-7 10 7-10 13z"/><path d="M2 9h20"/></svg>`,
  moedas: `<svg viewBox="0 0 24 24" fill="none" stroke="#fbbf24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="8" cy="8" r="6"/><path d="M16 8c0 4.418-3.582 8-8 8"/><circle cx="16" cy="16" r="6"/><path d="M8 16c0 4.418 3.582 8 8 8"/></svg>`,
  gratis: `<svg viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3l1.5 5.5L19 10l-5.5 1.5L12 17l-1.5-5.5L5 10l5.5-1.5z"/><path d="M18 14l.5 2 2 .5-2 .5-.5 2-.5-2-2-.5 2-.5z"/></svg>`
};

export function renderizarColecaoCartas(cartas, elementoContainer, callbackInspecionar) {
  elementoContainer.innerHTML = "";

  if (cartas.length === 0) {
    elementoContainer.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500">
      <span class="text-5xl mb-4">📭</span>
      <p class="text-sm font-semibold">Nenhum colaborador na coleção</p>
      <p class="text-xs mt-1">Abra pacotes no Almoxarifado para contratar!</p>
    </div>`;
    return;
  }

  cartas.forEach((c, index) => {
  const card = document.createElement("div");
  const classeRaridade = obterClasseRaridade(c.raridade);
  card.className = `carta-colaborador ${classeRaridade} ${c.eh_titular === 1 ? 'titular-selecionada' : ''}`;
  card.style.animationDelay = `${index * 0.1}s`;
    const velTotal = c.velocidade + (c.velocidade_bonus || 0);
    const chuTotal = c.chute + (c.chute_bonus || 0);
    const defTotal = c.defesa + (c.defesa_bonus || 0);
    const eneTotal = c.energia + (c.energia_bonus || 0);

    const xpMax = 100;
    const xpPorcentagem = Math.min(100, (c.xp / xpMax) * 100);
    const emojiRaridade = obterEmojiRaridade(c.raridade);

    const posicoesAprendidas = c.posicoes_aprendidas ? JSON.parse(c.posicoes_aprendidas) : [];
    const posicoesBadge = posicoesAprendidas.length > 0
      ? posicoesAprendidas.map(p => `<span class="text-[6px] px-1 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">${p.slice(0,3)}</span>`).join('')
      : '';

    card.innerHTML = `
      <div class="card-header">
        <span class="nivel-tag">${emojiRaridade} Lv ${c.level}</span>
        <span class="raridade-badge">${c.raridade}</span>
      </div>
      <div>
        <h4 class="card-nome">${c.nome}</h4>
        <p class="card-setor">${c.setor} ${c.eh_titular === 1 ? `· <span class="text-sucesso font-bold">${c.posicao.replace('_', ' ')}</span>` : ''}</p>
      </div>
      <div class="atributos-grid">
        <div class="attr-item"><span>⚡ VEL</span><span class="attr-valor">${velTotal}</span></div>
        <div class="attr-item"><span>🎯 CHU</span><span class="attr-valor">${chuTotal}</span></div>
        <div class="attr-item"><span>🛡️ DEF</span><span class="attr-valor">${defTotal}</span></div>
        <div class="attr-item"><span>❤️ ENE</span><span class="attr-valor">${eneTotal}</span></div>
      </div>
      ${posicoesBadge ? `<div class="flex gap-0.5 justify-center mt-1">${posicoesBadge}</div>` : ''}
      <div class="xp-bar-container">
        <div class="xp-bar-fill" style="width: ${xpPorcentagem}%"></div>
      </div>
      <span class="xp-text">XP ${c.xp}/${xpMax}</span>
    `;

    card.addEventListener("click", () => callbackInspecionar(c));
    elementoContainer.appendChild(card);
  });
}

export function renderizarVitrineCartas(todosColaboradores, cartasUsuario, elementoContainer) {
  elementoContainer.innerHTML = "";

  const idsPossuidos = new Set(cartasUsuario.map(c => c.colaborador_id));

  todosColaboradores.forEach((colab, index) => {
    const jaPossui = idsPossuidos.has(colab.id);
    const card = document.createElement("div");
    const classeRaridade = obterClasseRaridade(colab.raridade);
    const emojiRaridade = obterEmojiRaridade(colab.raridade);
    
    card.className = `carta-colaborador ${classeRaridade} ${jaPossui ? '' : 'bloqueada'}`;
    card.style.animationDelay = `${index * 0.05}s`;

    // Se possui, pegamos os dados da carta do usuário (nível, etc.)
    // Se não possui, usamos os dados base do colaborador
    const dadosExibicao = jaPossui 
      ? cartasUsuario.find(c => c.colaborador_id === colab.id)
      : colab;

    const vel = dadosExibicao.velocidade + (dadosExibicao.velocidade_bonus || 0);
    const chu = dadosExibicao.chute + (dadosExibicao.chute_bonus || 0);
    const def = dadosExibicao.defesa + (dadosExibicao.defesa_bonus || 0);
    const ene = dadosExibicao.energia + (dadosExibicao.energia_bonus || 0);

    card.innerHTML = `
      <div class="card-header">
        <span class="nivel-tag">${emojiRaridade} Lv ${dadosExibicao.level || 1}</span>
        <span class="raridade-badge">${colab.raridade}</span>
      </div>
      <div>
        <h4 class="card-nome">${colab.nome}</h4>
        <p class="card-setor">${colab.setor} ${!jaPossui ? '<span class="text-[9px] opacity-50 ml-1">(Bloqueado)</span>' : ''}</p>
      </div>
      <div class="atributos-grid">
        <div class="attr-item"><span>⚡ VEL</span><span class="attr-valor">${vel}</span></div>
        <div class="attr-item"><span>🎯 CHU</span><span class="attr-valor">${chu}</span></div>
        <div class="attr-item"><span>🛡️ DEF</span><span class="attr-valor">${def}</span></div>
        <div class="attr-item"><span>❤️ ENE</span><span class="attr-valor">${ene}</span></div>
      </div>
      ${jaPossui ? `
        <div class="xp-bar-container">
          <div class="xp-bar-fill" style="width: ${Math.min(100, ((dadosExibicao.xp || 0) / 100) * 100)}%"></div>
        </div>
        <span class="xp-text">XP ${dadosExibicao.xp || 0}/100</span>
      ` : `
        <div class="mt-2 text-center">
          <span class="text-[10px] font-bold text-zinc-600 uppercase tracking-tighter">🔒 Não Adquirido</span>
        </div>
      `}
    `;

    elementoContainer.appendChild(card);
  });
}

export function renderizarCampoTatico(cartas, callbackEscolherSlot, callbackRemoverSlot) {
  const slots = document.querySelectorAll(".titular-slot");
  const titulares = cartas.filter(c => c.eh_titular === 1);

  slots.forEach(slot => {
    const posicao = slot.getAttribute("data-posicao");
    const containerPlaceholder = slot.querySelector(".slot-placeholder");
    const titularPosicao = titulares.find(t => t.posicao === posicao);

    if (titularPosicao) {
      const classeRaridade = obterClasseRaridade(titularPosicao.raridade);
      const vel = titularPosicao.velocidade + (titularPosicao.velocidade_bonus || 0);
      const chu = titularPosicao.chute + (titularPosicao.chute_bonus || 0);
      const def = titularPosicao.defesa + (titularPosicao.defesa_bonus || 0);
      const ene = titularPosicao.energia + (titularPosicao.energia_bonus || 0);
      const overall = Math.round((vel + chu + def + ene) / 4);

      containerPlaceholder.className = `slot-placeholder w-32 h-16 rounded-xl border border-borda-card bg-zinc-950 flex flex-col justify-center px-3 py-1 cursor-pointer transition-all shadow-inner relative text-left group`;
      containerPlaceholder.innerHTML = `
        <button class="btn-remover-slot absolute -top-1.5 -right-1.5 h-4 w-4 bg-rose-600 hover:bg-rose-500 rounded-full flex items-center justify-center text-[8px] text-white opacity-0 group-hover:opacity-100 transition-opacity z-10 font-bold leading-none">✕</button>
        <div class="flex justify-between items-center w-full">
          <span class="text-[10px] font-bold text-white truncate max-w-[80px]">${titularPosicao.nome.split(' ')[0]}</span>
          <span class="text-[8px] font-mono text-moeda flex items-center gap-0.5"><span class="text-[7px]">🏅</span>${overall}</span>
        </div>
        <div class="text-[8px] text-zinc-500 truncate leading-none mt-0.5">${titularPosicao.setor}</div>
        <div class="flex gap-1 mt-0.5">
          <span class="text-[7px] text-zinc-600 font-mono">⚡${vel}</span>
          <span class="text-[7px] text-zinc-600 font-mono">🎯${chu}</span>
          <span class="text-[7px] text-zinc-600 font-mono">🛡️${def}</span>
        </div>
      `;

      const btnRemove = containerPlaceholder.querySelector(".btn-remover-slot");
      btnRemove.onclick = (e) => {
        e.stopPropagation();
        if (callbackRemoverSlot) callbackRemoverSlot(titularPosicao.id, posicao);
      };
    } else {
      containerPlaceholder.className = `slot-placeholder cursor-pointer w-28 h-12 rounded-xl border-2 border-dashed border-emerald-800 hover:border-emerald-500 bg-zinc-950/80 flex items-center justify-center text-[10px] text-zinc-500 font-medium transition-all hover:bg-emerald-950/30`;
      containerPlaceholder.innerHTML = '<span class="flex items-center gap-1">➕ <span>Escalar</span></span>';
    }

    containerPlaceholder.onclick = (e) => {
      if (e.target.closest('.btn-remover-slot')) return;
      e.preventDefault();
      callbackEscolherSlot(posicao);
    };
  });
}

export function renderizarFasesCampanha(campanha, elementoContainer, callbackJogar) {
  elementoContainer.innerHTML = "";

  const LIGAS = [
    {
      id: "liga_manutencao", nome: "Liga da Manutenção", emoji: "🔧", cor: "#e11d48",
      descricao: "Mecânicos, almoxarifes e equipe de serviços que mantêm a operação no ar.",
      tiers: [
        { chave: "manut_0", nome: "Aprendizes da Oficina", estrelas: "⭐", recompensa: 80 },
        { chave: "manut_1", nome: "Mecânicos Efetivos", estrelas: "⭐⭐", recompensa: 120 },
        { chave: "manut_2", nome: "Especialistas Técnicos", estrelas: "⭐⭐⭐", recompensa: 180 },
        { chave: "manut_3", nome: "Liderança da Manutenção", estrelas: "⭐⭐⭐⭐", recompensa: 280 }
      ]
    },
    {
      id: "liga_comercial", nome: "Liga Comercial", emoji: "💼", cor: "#3b82f6",
      descricao: "Consultores, designers e estrategistas que vendem e promovem a NDL.",
      tiers: [
        { chave: "com_0", nome: "Consultores Júnior", estrelas: "⭐", recompensa: 80 },
        { chave: "com_1", nome: "Consultores Pleno", estrelas: "⭐⭐", recompensa: 120 },
        { chave: "com_2", nome: "Consultores Sênior", estrelas: "⭐⭐⭐", recompensa: 180 },
        { chave: "com_3", nome: "Alta Gestão Comercial", estrelas: "⭐⭐⭐⭐", recompensa: 280 }
      ]
    },
    {
      id: "liga_logistica", nome: "Liga Logística", emoji: "🚚", cor: "#f59e0b",
      descricao: "Motoristas, motociclistas e heróis da logística que entregam resultados.",
      tiers: [
        { chave: "log_0", nome: "Logística Operacional", estrelas: "⭐", recompensa: 80 },
        { chave: "log_1", nome: "Logística Tática", estrelas: "⭐⭐", recompensa: 120 },
        { chave: "log_2", nome: "Supervisão Logística", estrelas: "⭐⭐⭐", recompensa: 220 }
      ]
    },
    {
      id: "liga_administrativa", nome: "Liga Administrativa", emoji: "📊", cor: "#a855f7",
      descricao: "Financeiro, RH, contabilidade, compras — a engrenagem que faz a empresa girar.",
      tiers: [
        { chave: "adm_0", nome: "Assistentes Administrativos", estrelas: "⭐", recompensa: 80 },
        { chave: "adm_1", nome: "Analistas e Plenos", estrelas: "⭐⭐", recompensa: 120 },
        { chave: "adm_2", nome: "Especialistas e Sêniores", estrelas: "⭐⭐⭐", recompensa: 180 },
        { chave: "adm_3", nome: "Liderança Administrativa", estrelas: "⭐⭐⭐⭐", recompensa: 280 }
      ]
    },
    {
      id: "liga_elite", nome: "Liga de Elite", emoji: "💎", cor: "#ef4444",
      descricao: "NIT, BI e a Cúpula Diretiva — o confronto final da Arena NDL.",
      tiers: [
        { chave: "elite_0", nome: "Escalão de Suporte", estrelas: "⭐⭐", recompensa: 100 },
        { chave: "elite_1", nome: "Analistas & BI", estrelas: "⭐⭐⭐", recompensa: 150 },
        { chave: "elite_2", nome: "Supervisão & Estratégia", estrelas: "⭐⭐⭐⭐", recompensa: 250 },
        { chave: "elite_3", nome: "Alta Diretoria", estrelas: "⭐⭐⭐⭐⭐", recompensa: 450 }
      ]
    }
  ];

  LIGAS.forEach(liga => {
    const todosVencidos = liga.tiers.every(t => campanha[t.chave] === true);

    const cardLiga = document.createElement("div");
    cardLiga.className = "card-fase flex flex-col";
    if (todosVencidos) cardLiga.classList.add("concluida");

    let tiersHTML = "";
    liga.tiers.forEach((t, idx) => {
      const venceu = campanha[t.chave] === true;
      const anteriorVencido = idx === 0 || liga.tiers.slice(0, idx).every(t2 => campanha[t2.chave] === true);
      const disponivel = !venceu && (idx === 0 || anteriorVencido);
      const bloqueado = !venceu && !disponivel;

      tiersHTML += `
        <div class="flex items-center justify-between py-2 px-3 rounded-lg transition-all ${venceu ? 'bg-emerald-950/30 border border-emerald-800/30' : bloqueado ? 'opacity-40' : 'bg-zinc-900/30 hover:bg-zinc-800/30 border border-zinc-800/30'}" style="${venceu ? '' : bloqueado ? '' : ''}">
          <div class="flex items-center gap-2.5">
            <span class="text-[11px] font-mono ${venceu ? 'text-emerald-400' : bloqueado ? 'text-zinc-600' : 'text-zinc-400'}">${venceu ? '✅' : bloqueado ? '🔒' : '⚔️'}</span>
            <div>
              <span class="text-[11px] font-semibold text-white leading-tight">${t.nome}</span>
              <div class="text-[8px] text-zinc-500 font-mono mt-0.5">${t.estrelas} · 💰 ${venceu ? `${Math.floor(t.recompensa / 2)} (50% rejogada)` : t.recompensa}</div>
            </div>
          </div>
          <button class="${venceu ? 'inline-flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white border border-blue-300/50 text-[10px] font-bold py-1.5 px-3 rounded-lg shadow-lg shadow-blue-600/40 ring-1 ring-blue-300/20 transition-all hover:scale-105 active:scale-95' : bloqueado ? 'text-zinc-700 text-[10px] cursor-not-allowed' : 'btn-primario text-[9px] font-bold py-1 px-3 rounded-lg text-white hover:scale-105 transition-all'}" ${bloqueado ? 'disabled' : ''}>
            ${venceu ? '🔄 Rejogar (50%)' : bloqueado ? '🔒 Bloqueado' : '⚔️ Desafiar'}
          </button>
        </div>
      `;
    });

    const progresso = liga.tiers.filter(t => campanha[t.chave] === true).length;
    const total = liga.tiers.length;

    cardLiga.innerHTML = `
      <div>
        <div class="flex items-center justify-between gap-3 mb-2">
          <div class="flex items-center gap-2">
            <span class="text-2xl">${liga.emoji}</span>
            <div>
              <h4 class="text-sm font-bold text-white font-display">${liga.nome}</h4>
              <span class="text-[9px] text-zinc-500 font-mono">${progresso}/${total} tiers · ${liga.cor ? `<span style="color:${liga.cor}">●</span>` : ''}</span>
            </div>
          </div>
          ${todosVencidos ? '<span class="text-[9px] font-bold text-sucesso bg-emerald-900/30 px-2 py-0.5 rounded-full">🏆 Completa!</span>' : ''}
        </div>
        <p class="text-[10px] text-zinc-500 mb-3 leading-relaxed">${liga.descricao}</p>
      </div>
      <div class="flex flex-col gap-1.5">
        ${tiersHTML}
      </div>
    `;

    // Eventos nos botões
    cardLiga.querySelectorAll("button").forEach(btn => {
      if (btn.disabled) return;
      const tierIdx = Array.from(cardLiga.querySelectorAll("button")).indexOf(btn);
      if (tierIdx >= 0 && tierIdx < liga.tiers.length) {
        const tier = liga.tiers[tierIdx];
        btn.onclick = () => callbackJogar(tier.chave);
      }
    });

    elementoContainer.appendChild(cardLiga);
  });
}

let quizFila = [];
let quizPerguntasBase = [];
let quizUltimaPerguntaId = null;
let quizAcertosSessao = 0;
let quizErrosSessao = 0;
let quizTotalRespondidos = 0;
let quizAguardandoResposta = true;
let quizAnimando = false;

const QUIZ_EMOJI = { "empresa": "🏢", "segurança": "🦺", "operacional": "🔧", "setores": "🏗️", "manutenção": "🔩", "logística": "🚚", "comercial": "💼", "almoxarifado": "📦", "nit": "💻", "financeiro": "💰", "gente e gestão": "👥" };
let quizFeedbackModalEl = null;
let quizAudioContext = null;

function obterContextoAudioQuiz() {
  if (quizAudioContext) return quizAudioContext;
  const AudioContextClasse = window.AudioContext || window.webkitAudioContext;
  if (!AudioContextClasse) return null;
  quizAudioContext = new AudioContextClasse();
  return quizAudioContext;
}

function tocarSomRespostaQuiz() {
  const ctx = obterContextoAudioQuiz();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const agora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.connect(ganho);
  ganho.connect(ctx.destination);

  oscilador.type = "square";
  oscilador.frequency.setValueAtTime(320, agora);
  oscilador.frequency.exponentialRampToValueAtTime(420, agora + 0.05);
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(0.06, agora + 0.01);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.08);
  oscilador.start(agora);
  oscilador.stop(agora + 0.1);
}

function tocarSomAcertoQuiz() {
  const ctx = obterContextoAudioQuiz();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const agora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.connect(ganho);
  ganho.connect(ctx.destination);

  oscilador.type = "triangle";
  oscilador.frequency.setValueAtTime(523.25, agora);
  oscilador.frequency.exponentialRampToValueAtTime(659.25, agora + 0.12);
  oscilador.frequency.exponentialRampToValueAtTime(783.99, agora + 0.24);
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(0.14, agora + 0.03);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.4);
  oscilador.start(agora);
  oscilador.stop(agora + 0.45);
}

function tocarSomErroQuiz() {
  const ctx = obterContextoAudioQuiz();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const agora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.connect(ganho);
  ganho.connect(ctx.destination);

  oscilador.type = "sawtooth";
  oscilador.frequency.setValueAtTime(220, agora);
  oscilador.frequency.exponentialRampToValueAtTime(130, agora + 0.16);
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(0.1, agora + 0.02);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.28);
  oscilador.start(agora);
  oscilador.stop(agora + 0.32);
}

function tocarSomAvancarQuiz() {
  const ctx = obterContextoAudioQuiz();
  if (!ctx) return;
  if (ctx.state === "suspended") {
    ctx.resume();
  }

  const agora = ctx.currentTime;
  const oscilador = ctx.createOscillator();
  const ganho = ctx.createGain();
  oscilador.connect(ganho);
  ganho.connect(ctx.destination);

  oscilador.type = "sine";
  oscilador.frequency.setValueAtTime(660, agora);
  oscilador.frequency.exponentialRampToValueAtTime(880, agora + 0.08);
  ganho.gain.setValueAtTime(0.0001, agora);
  ganho.gain.exponentialRampToValueAtTime(0.05, agora + 0.01);
  ganho.gain.exponentialRampToValueAtTime(0.0001, agora + 0.11);
  oscilador.start(agora);
  oscilador.stop(agora + 0.13);
}

function obterModalFeedbackQuiz() {
  if (quizFeedbackModalEl) return quizFeedbackModalEl;

  quizFeedbackModalEl = document.createElement("div");
  quizFeedbackModalEl.id = "quiz-feedback-modal";
  quizFeedbackModalEl.className = "modal-overlay quiz-feedback-modal hidden";
  quizFeedbackModalEl.innerHTML = `
    <div class="modal-content quiz-feedback-content max-w-md">
      <h3>
        <span id="quiz-feedback-titulo">Resultado</span>
        <button id="btn-quiz-feedback-fechar" class="close-modal-btn" type="button">×</button>
      </h3>
      <div class="modal-body quiz-feedback-body">
        <div id="quiz-feedback-icon" class="quiz-feedback-icono"></div>
        <p id="quiz-feedback-mensagem" class="quiz-feedback-texto"></p>
        <div id="quiz-feedback-recompensas" class="quiz-feedback-recompensas"></div>
        <div class="quiz-feedback-actions">
          <button id="btn-quiz-proxima-pergunta" class="quiz-next-btn" type="button">Próxima pergunta →</button>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(quizFeedbackModalEl);

  quizFeedbackModalEl.querySelector("#btn-quiz-feedback-fechar").addEventListener("click", () => fecharModalFeedbackQuiz());

  return quizFeedbackModalEl;
}

function fecharModalFeedbackQuiz() {
  if (!quizFeedbackModalEl) return;
  quizFeedbackModalEl.classList.add("hidden");
}

function abrirModalFeedbackQuiz(dadosQuiz, callbackProximaPergunta) {
  const modal = obterModalFeedbackQuiz();
  const acertou = Boolean(dadosQuiz?.acertou);
  const titulo = modal.querySelector("#quiz-feedback-titulo");
  const icone = modal.querySelector("#quiz-feedback-icon");
  const mensagem = modal.querySelector("#quiz-feedback-mensagem");
  const recompensas = modal.querySelector("#quiz-feedback-recompensas");
  const botaoFechar = modal.querySelector("#btn-quiz-feedback-fechar");
  const botaoProxima = modal.querySelector("#btn-quiz-proxima-pergunta");

  titulo.innerText = acertou ? "Resposta correta" : "Resposta incorreta";
  icone.innerHTML = acertou ? "✅" : "❌";
  icone.className = `quiz-feedback-icono ${acertou ? "acerto" : "erro"}`;

  mensagem.innerText = dadosQuiz?.mensagem || (acertou ? "Você acertou a resposta." : "Você errou a resposta.");

  const moedasGanhas = Number(dadosQuiz?.moedasGanhas || (acertou ? 80 : 15));
  const respostaCorreta = dadosQuiz?.respostaCorreta || "";
  const respostaSelecionada = dadosQuiz?.respostaSelecionada || "";
  const respostaCorretaTexto = dadosQuiz?.respostaCorretaTexto || "";
  const itemSelecionadoTexto = dadosQuiz?.respostaSelecionadaTexto || "";

  recompensas.innerHTML = `
    <div class="quiz-recompensa-item">
      <span class="quiz-recompensa-rotulo">Moedas</span>
      <strong class="quiz-recompensa-valor">🪙 +${moedasGanhas}</strong>
    </div>
    <div class="quiz-recompensa-item">
      <span class="quiz-recompensa-rotulo">Você marcou</span>
      <strong class="quiz-recompensa-valor">${itemSelecionadoTexto || respostaSelecionada || "-"}</strong>
    </div>
    <div class="quiz-recompensa-item quiz-resposta-certa">
      <span class="quiz-recompensa-rotulo">Correta</span>
      <strong class="quiz-recompensa-valor">${respostaCorretaTexto || respostaCorreta || "-"}</strong>
    </div>
  `;

  botaoFechar.style.display = "none";
  botaoProxima.onclick = () => {
    fecharModalFeedbackQuiz();
    if (typeof callbackProximaPergunta === "function") {
      callbackProximaPergunta();
    }
  };

  modal.classList.remove("hidden");
}

export function limparSessaoQuiz() {
  quizFila = [];
  quizPerguntasBase = [];
  quizUltimaPerguntaId = null;
  quizAcertosSessao = 0;
  quizErrosSessao = 0;
  quizTotalRespondidos = 0;
}

export function renderizarQuizzes(quizzes, categoriaSelecionada, quizzesRespondidos, elementoContainer, callbackResponder) {
  elementoContainer.innerHTML = "";
  quizAguardandoResposta = true;
  quizAnimando = false;

  const filtrados = quizzes.filter(q => q.categoria.toLowerCase() === categoriaSelecionada.toLowerCase());

  if (filtrados.length === 0) {
    elementoContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-16 text-zinc-500">
      <span class="text-4xl mb-3">📝</span>
      <p class="text-sm font-semibold">Nenhum quiz disponível</p>
      <p class="text-xs mt-1">Tente outra categoria</p>
    </div>`;
    quizFila = [];
    quizPerguntasBase = [];
    quizUltimaPerguntaId = null;
    return;
  }

  quizPerguntasBase = [...filtrados];
  recriarFilaQuiz(quizPerguntasBase, quizUltimaPerguntaId);

  // Cabeçalho da sessão
  const shell = document.createElement("div");
  shell.className = "quiz-shell";
  elementoContainer.appendChild(shell);

  const overview = document.createElement("div");
  overview.className = "quiz-overview";
  overview.innerHTML = `
    <div class="quiz-overview-card">
      <span class="quiz-overview-label">Categoria ativa</span>
      <span class="quiz-overview-valor">${categoriaSelecionada}</span>
      <p class="quiz-overview-texto">${filtrados.length} perguntas disponiveis nesta trilha.</p>
    </div>
    <div class="quiz-overview-card">
      <span class="quiz-overview-label">Sessao</span>
      <span class="quiz-overview-valor" id="quiz-session-total">0</span>
      <p class="quiz-overview-texto">Respondidas nesta rodada</p>
    </div>
    <div class="quiz-overview-card">
      <span class="quiz-overview-label">Acertos</span>
      <span class="quiz-overview-valor" id="quiz-session-hits">0</span>
      <p class="quiz-overview-texto">Respostas corretas</p>
    </div>
    <div class="quiz-overview-card">
      <span class="quiz-overview-label">Moedas</span>
      <span class="quiz-overview-valor moeda"><span id="quiz-session-coins">0</span> NL</span>
      <p class="quiz-overview-texto">Saldo da sessao</p>
    </div>
  `;
  shell.appendChild(overview);

  const header = document.createElement("div");
  header.className = "quiz-header-info";
  header.id = "quiz-header-info";
  header.innerHTML = `
    <div class="quiz-progress" id="quiz-progress-dots"></div>
    <div class="quiz-session-score" id="quiz-session-score">Sessao atual: <span id="quiz-session-status">Aguardando resposta</span></div>
  `;
  shell.appendChild(header);

  const wrapper = document.createElement("div");
  wrapper.id = "quiz-card-wrapper";
  wrapper.className = "quiz-card-wrapper";
  wrapper.style.cssText = "position: relative; min-height: 300px;";
  shell.appendChild(wrapper);

  atualizarResumoQuiz();
  mostrarProximoQuiz(quizzesRespondidos, callbackResponder);
}

function recriarFilaQuiz(filtrados, idUltimaPergunta = null) {
  quizFila = [...filtrados];
  for (let i = quizFila.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [quizFila[i], quizFila[j]] = [quizFila[j], quizFila[i]];
  }

  if (quizFila.length > 1 && idUltimaPergunta !== null && quizFila[0].id === idUltimaPergunta) {
    const indiceTroca = 1 + Math.floor(Math.random() * (quizFila.length - 1));
    [quizFila[0], quizFila[indiceTroca]] = [quizFila[indiceTroca], quizFila[0]];
  }
}

function atualizarResumoQuiz(statusAtual = "Aguardando resposta") {
  const totalMoedas = quizAcertosSessao * 80 + quizErrosSessao * 15;
  const scoreEl = document.getElementById("quiz-session-coins");
  const totalEl = document.getElementById("quiz-session-total");
  const hitsEl = document.getElementById("quiz-session-hits");
  const statusEl = document.getElementById("quiz-session-status");
  const progressEl = document.getElementById("quiz-progress-dots");

  if (scoreEl) scoreEl.innerText = totalMoedas;
  if (totalEl) totalEl.innerText = quizTotalRespondidos;
  if (hitsEl) hitsEl.innerText = quizAcertosSessao;
  if (statusEl) statusEl.innerText = statusAtual;

  if (progressEl) {
    const historico = [
      ...Array.from({ length: quizAcertosSessao }, () => "acerto"),
      ...Array.from({ length: quizErrosSessao }, () => "erro")
    ].slice(-8);

    progressEl.innerHTML = historico.length > 0
      ? historico.map((tipo, indice) => `<span class="quiz-progress-dot ${tipo} ${indice === historico.length - 1 ? 'ativo' : ''}"></span>`).join("")
      : `<span class="quiz-status-badge">Sessao iniciada</span>`;
  }
}

function mostrarProximoQuiz(quizzesRespondidos, callbackResponder) {
  const wrapper = document.getElementById("quiz-card-wrapper");
  if (!wrapper) return;
  if (quizPerguntasBase.length === 0) return;

  if (quizFila.length === 0) {
    recriarFilaQuiz(quizPerguntasBase, quizUltimaPerguntaId);
  }

  if (quizFila.length === 0) return;

  const perguntaAtual = quizFila.shift();
  quizUltimaPerguntaId = perguntaAtual.id;

  quizAguardandoResposta = true;
  quizAnimando = false;

  const quizRespondido = quizzesRespondidos.find((item) => item.quizId === perguntaAtual.id);
  const acertouAntes = quizRespondido?.respondidoCorretamente;

  const card = document.createElement("div");
  card.className = "card-quiz animando-entrada quiz-card-entrada";
  card.id = "quiz-card-ativo";

  const emojiCategoria = QUIZ_EMOJI[perguntaAtual.categoria.toLowerCase()] || "??";
  const letras = ["A", "B", "C", "D"];
  const opcoes = [
    perguntaAtual.opcao_a,
    perguntaAtual.opcao_b,
    perguntaAtual.opcao_c,
    perguntaAtual.opcao_d
  ];

  card.innerHTML = `
    <div class="flex justify-between items-start gap-3">
      <div class="flex flex-col gap-3">
        <span class="quiz-categoria-tag">${emojiCategoria} ${perguntaAtual.categoria}</span>
        ${quizRespondido ? `<span class="quiz-status-badge">${acertouAntes ? "Já acertado" : "Respondido anteriormente"}</span>` : `<span class="quiz-status-badge">Pergunta inédita</span>`}
      </div>
      <span class="text-[9px] font-mono text-zinc-600">Quiz #${perguntaAtual.id}</span>
    </div>
    <h4 class="quiz-pergunta">${perguntaAtual.pergunta}</h4>
    <div class="options-container space-y-2.5" id="quiz-opcoes-container">
      ${opcoes.map((opcao, indice) => `
        <button class="opcao-resposta" data-opcao="${letras[indice]}" data-correta="${perguntaAtual.resposta_correta}" data-texto="${opcao}">
          <span class="opcao-letra">${letras[indice]}</span>
          ${opcao}
        </button>
      `).join('')}
    </div>
  `;

  wrapper.innerHTML = "";
  wrapper.appendChild(card);
  atualizarResumoQuiz(`Categoria ${perguntaAtual.categoria}`);

  void card.offsetWidth;

  card.querySelectorAll(".opcao-resposta").forEach((botao) => {
    botao.onclick = async () => {
      if (!quizAguardandoResposta || quizAnimando) return;
      quizAguardandoResposta = false;
      quizAnimando = true;
      tocarSomRespostaQuiz();

      const opcaoEscolhida = botao.getAttribute("data-opcao");
      const respostaCorreta = botao.getAttribute("data-correta");
      const respostaSelecionadaTexto = botao.getAttribute("data-texto") || "";
      const acertou = opcaoEscolhida === respostaCorreta;

      card.querySelectorAll(".opcao-resposta").forEach((elementoBotao) => {
        elementoBotao.disabled = true;
        elementoBotao.classList.add("desabilitada");
      });

      botao.classList.remove("desabilitada");
      if (acertou) {
        botao.classList.add("certa");
        criarConfeteQuiz(card);
      } else {
        botao.classList.add("errada");
        card.querySelectorAll(".opcao-resposta").forEach((elementoBotao) => {
          if (elementoBotao.getAttribute("data-opcao") === respostaCorreta) {
            elementoBotao.classList.remove("desabilitada");
            elementoBotao.classList.add("certa");
          }
        });
      }

      quizTotalRespondidos++;
      if (acertou) quizAcertosSessao++;
      else quizErrosSessao++;
      atualizarResumoQuiz(acertou ? "Resposta correta" : "Resposta incorreta");

      if (acertou) {
        tocarSomAcertoQuiz();
      } else {
        tocarSomErroQuiz();
      }

      const respostaBackend = await callbackResponder(perguntaAtual.id, opcaoEscolhida);
      const dadosResposta = respostaBackend?.dados || {};
      const respostaCorretaTexto = Array.from(card.querySelectorAll(".opcao-resposta"))
        .find((elementoBotao) => elementoBotao.getAttribute("data-opcao") === respostaCorreta)
        ?.getAttribute("data-texto") || "";

      abrirModalFeedbackQuiz({
        acertou,
        mensagem: respostaBackend?.mensagem || (acertou ? "Resposta correta!" : "Resposta incorreta!"),
        moedasGanhas: dadosResposta.moedasGanhas,
        xpGanho: dadosResposta.xpGanho,
        respostaCorreta,
        respostaCorretaTexto,
        respostaSelecionadaTexto
      }, () => {
        tocarSomAvancarQuiz();
        const cardAtual = document.getElementById("quiz-card-ativo");
        if (cardAtual) {
          cardAtual.classList.add("animando-saida");
          setTimeout(() => {
            quizAnimando = false;
            mostrarProximoQuiz(quizzesRespondidos, callbackResponder);
          }, 280);
          return;
        }

        quizAnimando = false;
        mostrarProximoQuiz(quizzesRespondidos, callbackResponder);
      });
    };
  });
}
function criarConfeteQuiz(card) {
  const container = document.createElement("div");
  container.className = "quiz-confete-container";
  card.appendChild(container);

  const cores = ["#e11d48", "#fbbf24", "#10b981", "#3b82f6", "#a855f7", "#fff"];
  for (let i = 0; i < 20; i++) {
    const el = document.createElement("div");
    el.className = "quiz-confete";
    const angle = Math.random() * Math.PI * 2;
    const dist = 40 + Math.random() * 80;
    el.style.setProperty("--tx", `${Math.cos(angle) * dist}px`);
    el.style.setProperty("--ty", `${Math.sin(angle) * dist}px`);
    el.style.background = cores[Math.floor(Math.random() * cores.length)];
    el.style.animationDelay = `${Math.random() * 0.15}s`;
    container.appendChild(el);
  }
  setTimeout(() => container.remove(), 1000);
}

export function renderizarOponentesModal(oponentes, elementoContainer, callbackDesafiar) {
  elementoContainer.innerHTML = "";

  if (oponentes.length === 0) {
    elementoContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-10 text-zinc-500">
      <span class="text-3xl mb-2">🔍</span>
      <p class="text-xs font-mono">Nenhum oponente encontrado.</p>
    </div>`;
    return;
  }

  oponentes.forEach(op => {
    const item = document.createElement("div");
    item.className = "p-4 bg-zinc-900/60 rounded-xl border border-zinc-800 flex items-center justify-between hover:border-primaria/40 transition-all group cursor-pointer";

    const time = op.time || [];
    const titularesCount = time.filter(c => c.eh_titular === 1).length;
    const completo = titularesCount >= 5;

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <div class="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-white font-black text-sm group-hover:bg-primaria/20 group-hover:text-primaria transition-colors">
          ${op.nome_usuario.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 class="text-sm font-bold text-white group-hover:text-primaria transition-colors">${op.nome_usuario}</h4>
          <p class="text-[9px] text-zinc-500 font-mono">⚔️ ${op.vitorias}V · ⚽ ${op.gols_marcados} gols</p>
        </div>
      </div>
      <div class="flex items-center gap-4">
        <div class="text-right hidden sm:block">
          <span class="text-sm font-black font-mono text-moeda">${op.overall || '—'}</span>
          <p class="text-[7px] text-zinc-600 font-mono uppercase">Overall</p>
        </div>
        <button class="btn-desafiar px-4 py-2 rounded-lg text-[10px] font-bold text-white transition-all ${completo ? 'bg-primaria hover:bg-rose-700' : 'bg-zinc-800 text-zinc-600 cursor-not-allowed'}" ${completo ? '' : 'disabled'}>
          ${completo ? 'DESAFIAR' : 'INCOMPLETO'}
        </button>
      </div>
    `;

    item.onclick = (e) => {
      if (completo) callbackDesafiar(op);
    };

    elementoContainer.appendChild(item);
  });
}

export function renderizarOponentesLiga(oponentes, elementoContainer, callbackDesafiar) {
  elementoContainer.innerHTML = "";

  if (oponentes.length === 0) {
    elementoContainer.innerHTML = `<div class="col-span-full flex flex-col items-center justify-center py-16 text-zinc-500">
      <span class="text-5xl mb-4">🏟️</span>
      <p class="text-sm font-semibold">Nenhum oponente disponível</p>
      <p class="text-xs mt-1">Aguarde até que mais colegas entrem na Arena NDL!</p>
    </div>`;
    return;
  }

  oponentes.forEach(op => {
    const card = document.createElement("div");
    card.className = "bg-card rounded-2xl border border-zinc-800 p-5 flex flex-col gap-4 hover:border-zinc-600 transition-all";

    const time = op.time || [];
    const titularesCount = time.filter(c => c.eh_titular === 1).length;
    const completo = titularesCount >= 5;

    card.innerHTML = `
      <div class="flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="h-10 w-10 rounded-xl bg-gradient-to-br from-primaria to-rose-700 flex items-center justify-center text-white font-black text-sm">
            ${op.nome_usuario.charAt(0).toUpperCase()}
          </div>
          <div>
            <h4 class="text-sm font-bold text-white">${op.nome_usuario}</h4>
            <p class="text-[9px] text-zinc-500 font-mono">⚔️ ${op.vitorias}V · ${op.derrotas || 0}D · ⚽ ${op.gols_marcados} gols</p>
          </div>
        </div>
        <div class="text-right">
          <span class="text-lg font-black font-mono text-moeda">${op.overall || '—'}</span>
          <p class="text-[8px] text-zinc-600 font-mono uppercase">Overall</p>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5 min-h-[28px]">
        ${time.filter(c => c.eh_titular === 1).map(c => {
          const raridadeCor = { "Mítico": "#ef4444", "Lendário": "#f59e0b", "Épico": "#a855f7", "Raro": "#3b82f6", "Comum": "#71717a" };
          const cor = raridadeCor[c.raridade] || "#71717a";
          return `<span class="text-[9px] font-mono font-semibold px-2 py-0.5 rounded-full" style="background:${cor}20;color:${cor};border:1px solid ${cor}40">${c.nome.split(' ')[0]}</span>`;
        }).join('')}
        ${!completo ? '<span class="text-[9px] text-zinc-600 font-mono">⏳ Time incompleto</span>' : ''}
      </div>

      <button class="btn-desafiar w-full py-2.5 rounded-xl text-xs font-bold text-white transition-all ${completo ? 'btn-primario hover:scale-[1.02]' : 'bg-zinc-800 text-zinc-500 cursor-not-allowed'}" ${completo ? '' : 'disabled'}>
        ${completo ? '⚔️ Desafiar para Duelo' : '🚫 Time incompleto'}
      </button>
    `;

    card.querySelector("button").onclick = () => {
      if (completo) callbackDesafiar(op);
    };

    elementoContainer.appendChild(card);
  });
}

export function renderizarHistoricoLiga(historico, elementoContainer, nomeUsuario) {
  elementoContainer.innerHTML = "";

  if (!historico || historico.length === 0) {
    elementoContainer.innerHTML = `<div class="flex flex-col items-center justify-center py-8 text-zinc-500">
      <span class="text-3xl mb-2">🤺</span>
      <p class="text-xs font-mono">Nenhum duelo realizado ainda.</p>
      <p class="text-[10px] mt-1">Desafie um colega acima!</p>
    </div>`;
    return;
  }

  historico.forEach(p => {
    const item = document.createElement("div");
    const venceu = p.venceu === 1;
    item.className = `flex items-center justify-between py-2.5 px-3.5 rounded-lg border ${venceu ? 'bg-emerald-950/20 border-emerald-800/20' : 'bg-rose-950/20 border-rose-800/20'}`;

    item.innerHTML = `
      <div class="flex items-center gap-2.5 min-w-0">
        <span class="text-sm">${venceu ? '🏆' : '🔴'}</span>
        <div class="min-w-0">
          <p class="text-xs font-semibold text-white truncate">${nomeUsuario || 'Você'} <span class="text-zinc-500">vs</span> ${p.oponente_nome}</p>
          <p class="text-[9px] text-zinc-500 font-mono">${new Date(p.created_at).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' })}</p>
        </div>
      </div>
      <div class="flex items-center gap-1.5 font-mono font-bold shrink-0">
        <span class="text-sm ${venceu ? 'text-moeda' : 'text-rose-400'}">${p.gols_usuario}</span>
        <span class="text-[10px] text-zinc-600">:</span>
        <span class="text-sm ${venceu ? 'text-rose-400' : 'text-moeda'}">${p.gols_oponente}</span>
      </div>
    `;

    elementoContainer.appendChild(item);
  });
}

export function renderizarTopDuelistas(ranking, elementoContainer) {
  elementoContainer.innerHTML = "";
  
  // Pega apenas os 5 primeiros
  const top5 = [...ranking].slice(0, 5);

  if (top5.length === 0) {
    elementoContainer.innerHTML = `<p class="text-[10px] text-zinc-500 font-mono text-center py-4">Aguardando duelos...</p>`;
    return;
  }

  top5.forEach((player, index) => {
    const item = document.createElement("div");
    item.className = "flex items-center justify-between p-3 bg-zinc-900/40 rounded-xl border border-zinc-800/50 hover:border-primaria/30 transition-all";
    
    const medalhas = ["🥇", "🥈", "🥉", "🏅", "🏅"];
    const corPosicao = ["text-amber-400", "text-zinc-300", "text-amber-700", "text-zinc-500", "text-zinc-500"];

    item.innerHTML = `
      <div class="flex items-center gap-3">
        <span class="text-sm ${corPosicao[index]} font-black font-mono w-5">${medalhas[index]}</span>
        <div class="h-8 w-8 rounded-lg bg-zinc-800 flex items-center justify-center text-[10px] font-bold text-white uppercase">
          ${player.nome_usuario.charAt(0)}
        </div>
        <div>
          <p class="text-xs font-bold text-white leading-none">${player.nome_usuario}</p>
          <p class="text-[8px] text-zinc-500 font-mono mt-1">${player.vitorias_pvp} Vitórias · ${player.gols_pvp} Gols</p>
        </div>
      </div>
      <div class="text-right">
        <p class="text-[10px] font-black font-mono text-moeda">${player.overall || '—'}</p>
        <p class="text-[7px] text-zinc-600 font-mono uppercase">Overall</p>
      </div>
    `;
    elementoContainer.appendChild(item);
  });
}

export function renderizarRankingLiga(listaUsuarios, elementoContainer, usuarioAtualId) {
  elementoContainer.innerHTML = "";

  if (listaUsuarios.length === 0) {
    elementoContainer.innerHTML = `<p class="text-zinc-500 text-center py-6 text-xs font-mono">Ranking vazio.</p>`;
    return;
  }

  const top3Emojis = ["🥇", "🥈", "🥉"];

  listaUsuarios.forEach((usr, idx) => {
    const item = document.createElement("div");
    const ehAtual = usr.id === usuarioAtualId;
    item.className = `grid grid-cols-12 text-xs py-2 px-3 rounded-lg ${ehAtual ? 'bg-primaria/10 border border-primaria/25' : 'bg-zinc-950/20 border border-transparent'} items-center`;

    const posicao = idx < 3 ? `<span class="text-sm">${top3Emojis[idx]}</span>` : `<span class="font-mono font-bold text-zinc-500">#${idx + 1}</span>`;

    item.innerHTML = `
      <span class="col-span-2 flex justify-center">${posicao}</span>
      <span class="col-span-5 font-semibold text-white truncate flex items-center gap-1">
        ${usr.nome_usuario}
        ${ehAtual ? '<span class="text-[8px] bg-primaria/20 text-primaria px-1 py-0.5 rounded-full font-bold">VOCÊ</span>' : ''}
      </span>
      <span class="col-span-2 text-center font-mono font-bold text-sucesso">${usr.vitorias_pvp ?? 0}</span>
      <span class="col-span-3 text-center font-mono text-rose-400">${usr.derrotas_pvp ?? 0}</span>
    `;

    elementoContainer.appendChild(item);
  });
}

export function renderizarLojaPacotes(usuario, elementoContainer, callbackComprar) {
  elementoContainer.innerHTML = "";

  const pacotes = [
    { tipo: "inicial", nome: "Caixa Inicial", preco: 0, svg: SVG_ICONES.presente, desc: "5 cartas aleatórias · Comum 82% · Raro 15% · Épico 2% · Lendário 0,5% · Mítico 0,05%", cor: "bronze", ocultar: usuario.caixa_inicial_resgatada === 1, textoBotao: "Resgatar Caixa" },
    { tipo: "bronze", nome: "Booster Bronze", preco: 150, svg: SVG_ICONES.bronze, desc: "Comum 80% · Raro 18% · Épico 2%", cor: "bronze" },
    { tipo: "prata", nome: "Booster Prata", preco: 300, svg: SVG_ICONES.prata, desc: "Raro 50% · Épico 13% · Lendário 2%", cor: "prata" },
    { tipo: "ouro", nome: "Booster Ouro", preco: 600, svg: SVG_ICONES.ouro, desc: "Épico 43% · Lendário 10% · Mítico 2%", cor: "ouro" },
    { tipo: "lendario", nome: "Booster Lendário", preco: 1200, svg: SVG_ICONES.lendario, desc: "Lendário 33% · Mítico 7% · Sem Comuns", cor: "lendario" }
  ];

  pacotes.forEach(p => {
    if (p.ocultar) {
      return;
    }

    const card = document.createElement("div");
    card.className = `card-pacote ${p.cor}`;
    const podeComprar = usuario.moedas >= p.preco;

    card.innerHTML = `
      <div class="icon-pack-wrapper animate-float" style="animation-delay: ${Math.random()}s; width:48px;height:48px">${p.svg}</div>
      <h4 class="text-sm font-bold text-white font-display">${p.nome}</h4>
      <p class="text-[10px] text-zinc-400 max-w-[150px] leading-tight">${p.desc}</p>
      <div class="mt-2 text-sm font-black text-moeda flex items-center gap-1">
        <span class="icon-inline" style="width:1em;height:1em;display:inline-block;vertical-align:middle">${p.preco === 0 ? SVG_ICONES.gratis : ''}</span>${p.preco === 0 ? ' Gratis' : '$ ' + p.preco} <span class="text-[9px] font-normal text-zinc-500">${p.preco === 0 ? 'resgate unico' : 'NL'}</span>
      </div>
      <button class="btn-primario text-[10px] py-2.5 px-5 rounded-lg text-white w-full transition-all ${!podeComprar ? 'opacity-50 cursor-not-allowed' : ''}" ${!podeComprar ? 'disabled' : ''}>
        <span class="icon-inline" style="width:1em;height:1em;display:inline-block;vertical-align:middle;margin-right:4px">${podeComprar ? SVG_ICONES.presente : SVG_ICONES.moedas}</span> ${podeComprar ? (p.textoBotao || 'Abrir Pacote') : 'Saldo Insuficiente'}
      </button>
    `;

    card.querySelector("button").onclick = () => callbackComprar(p.tipo);
    elementoContainer.appendChild(card);
  });
}

export function renderizarTrofeus(trofeusAdquiridos, elementoContainer) {
  elementoContainer.innerHTML = "";

  const conquistas = [
    { chave: "Melhor do Mês", titulo: "Melhor do Mês", desc: "Venceu todos os tiers da Liga da Manutenção.", emoji: "🔧", cor: "#e11d48" },
    { chave: "Vendedor Destaque", titulo: "Vendedor Destaque", desc: "Venceu todos os tiers da Liga Comercial.", emoji: "💼", cor: "#3b82f6" },
    { chave: "Entregador Ágil", titulo: "Entregador Ágil", desc: "Venceu todos os tiers da Liga Logística.", emoji: "🚚", cor: "#f59e0b" },
    { chave: "Guardião do Orçamento", titulo: "Guardião do Orçamento", desc: "Venceu todos os tiers da Liga Administrativa.", emoji: "📊", cor: "#a855f7" },
    { chave: "Lenda da Nordeste", titulo: "Lenda da Nordeste", desc: "Derrotou a Alta Diretoria na Liga de Elite!", emoji: "💎", cor: "#ef4444" },
    { chave: "Seleção Implacável", titulo: "Seleção Implacável", desc: "Recebeu bônus coletivo e fortaleceu toda a seleção.", emoji: "👥", cor: "#f59e0b" },
    { chave: "Conhecedor da Empresa", titulo: "Colaborador Padrão", desc: "Respondeu pelo menos 6 quizzes operacionais corretamente.", emoji: "🧠", cor: "#3b82f6" },
    { chave: "Lenda do Treinamento", titulo: "Treinador Lendário", desc: "Elevou qualquer carta de colaborador ao Nível 10.", emoji: "⚡", cor: "#a855f7" }
  ];

  conquistas.forEach(t => {
    const conquistado = trofeusAdquiridos.includes(t.chave);
    const card = document.createElement("div");
    card.className = `card-trofeu ${conquistado ? '' : 'bloqueado'}`;

    card.innerHTML = `
      <div class="trofeu-icon-container" style="${conquistado ? `box-shadow: 0 0 20px ${t.cor}40; border: 1px solid ${t.cor}30` : ''}">${conquistado ? t.emoji : '🔒'}</div>
      <div class="flex-1">
        <h4 class="text-sm font-bold text-white leading-none">${t.titulo}</h4>
        <p class="text-[10px] text-zinc-500 mt-1 leading-snug">${t.desc}</p>
      </div>
      <div class="text-lg">${conquistado ? '✅' : '⏳'}</div>
    `;

    elementoContainer.appendChild(card);
  });
}

export function renderizarDestaquesArena(destaques, elementoContainer, callbackCompartilhar) {
  elementoContainer.innerHTML = "";

  if (!Array.isArray(destaques) || destaques.length === 0) {
    elementoContainer.innerHTML = `
      <div class="col-span-full destaque-vazio">
        <div class="destaque-vazio-icone">🏁</div>
        <h4 class="text-sm font-bold text-white">Ainda sem cards de destaque</h4>
        <p class="text-[11px] text-zinc-500 mt-1 leading-snug">
          As vitórias, conquistas e sequências do quiz vão aparecer aqui em formato compartilhável.
        </p>
      </div>
    `;
    return;
  }

  const mapaTipos = {
    conquista: {
      etiqueta: "Conquista",
      icone: "🏆",
      acento: "#ef4444",
      legenda: "Nova marca desbloqueada"
    },
    conquista_coletiva: {
      etiqueta: "Conquista",
      icone: "👥",
      acento: "#f59e0b",
      legenda: "Bônus para toda a seleção"
    },
    vitoria: {
      etiqueta: "Vitória",
      icone: "⚽",
      acento: "#3b82f6",
      legenda: "Resultado de partida"
    },
    liga: {
      etiqueta: "Liga",
      icone: "👑",
      acento: "#f59e0b",
      legenda: "Fechou uma liga completa"
    },
    quiz: {
      etiqueta: "Quiz",
      icone: "🧠",
      acento: "#a855f7",
      legenda: "Sequência de acertos"
    }
  };

  destaques.slice(0, 6).forEach((destaque) => {
    const configuracao = mapaTipos[destaque.tipo] || mapaTipos.conquista;
    const card = document.createElement("article");
    card.className = `card-destaque-arena tipo-${destaque.tipo || "conquista"}`;

    const moedas = Number(destaque.moedas || 0);
    const xp = Number(destaque.xp || 0);
    const meta = destaque.meta || configuracao.legenda;
    const subtitulo = destaque.subtitulo || "";
    const descricao = destaque.descricao || "";

    card.innerHTML = `
      <div class="card-destaque-topo">
        <div class="card-destaque-marca">
          <img class="card-destaque-logo" src="/assets/images/LOGO%20COLORIDA.png" alt="Nordeste Locações">
        </div>
        <span class="card-destaque-badge">${destaque.etiqueta || configuracao.etiqueta}</span>
      </div>

      <div class="card-destaque-header">
        <div class="card-destaque-icone">${destaque.icone || configuracao.icone}</div>
        <div class="min-w-0">
          <h4 class="card-destaque-titulo">${destaque.titulo || "Destaque da Arena"}</h4>
          <p class="card-destaque-subtitulo">${subtitulo}</p>
        </div>
      </div>

      <p class="card-destaque-descricao">${descricao}</p>

      <div class="card-destaque-recompensas">
        <span class="card-destaque-chip">🪙 ${moedas} NDL</span>
        <span class="card-destaque-chip">✨ ${xp} XP</span>
        <span class="card-destaque-chip">${meta}</span>
      </div>

      <div class="card-destaque-rodape">
        <span class="card-destaque-meta">${destaque.metaRodape || "Arena Nordeste"}</span>
        <div class="acoes-destaque">
          <button class="btn-destaque-acao instagram" type="button" data-acao="instagram">Instagram</button>
          <button class="btn-destaque-acao whatsapp" type="button" data-acao="whatsapp">WhatsApp</button>
          <button class="btn-destaque-acao salvar" type="button" data-acao="salvar">Salvar</button>
        </div>
      </div>
    `;

    card.querySelectorAll(".btn-destaque-acao").forEach((botao) => {
      botao.onclick = () => {
        if (typeof callbackCompartilhar === "function") {
          callbackCompartilhar(destaque, botao.getAttribute("data-acao"));
        }
      };
    });

    card.style.setProperty("--acento-destaque", configuracao.acento);
    card.style.setProperty("--acento-secundario", destaque.acentoSecundario || configuracao.acento);
    elementoContainer.appendChild(card);
  });
}

export function renderizarRanking(listaUsuarios, elementoContainer, usuarioAtualId) {
  elementoContainer.innerHTML = "";

  if (listaUsuarios.length === 0) {
    elementoContainer.innerHTML = `<p class="text-zinc-500 text-center py-6 text-xs font-mono">Ranking indisponível.</p>`;
    return;
  }

  const top3Emojis = ["🥇", "🥈", "🥉"];

  listaUsuarios.forEach((usr, idx) => {
    const item = document.createElement("div");
    const ehUsuarioAtual = usr.id === usuarioAtualId;
    item.className = `ranking-row grid grid-cols-12 text-xs py-2.5 px-3.5 rounded-lg ${ehUsuarioAtual ? 'bg-primaria/10 border border-primaria/25' : 'bg-zinc-950/20 border border-transparent'} items-center`;

    const posicaoDisplay = idx < 3
      ? `<span class="text-sm">${top3Emojis[idx]}</span>`
      : `<span class="font-mono font-bold text-zinc-500">#${idx + 1}</span>`;

    item.innerHTML = `
      <span class="col-span-2 flex items-center justify-center">${posicaoDisplay}</span>
      <span class="col-span-5 font-semibold text-white truncate flex items-center gap-1">
        ${usr.nome_usuario}
        ${ehUsuarioAtual ? '<span class="text-[8px] bg-primaria/20 text-primaria px-1.5 py-0.5 rounded-full font-bold">VOCÊ</span>' : ''}
      </span>
      <span class="col-span-2 text-center font-mono font-bold text-sucesso flex items-center justify-center gap-0.5">
        <span>⚔️</span>${usr.vitorias}
      </span>
      <span class="col-span-3 text-center font-mono text-zinc-300 flex items-center justify-center gap-0.5">
        <span>⚽</span>${usr.gols_marcados}
      </span>
    `;

    elementoContainer.appendChild(item);
  });
}

// Cache de elementos do campo para atualização in-place (sem recriar)
let campoPlayerCache = new Map();
let campoBolaEl = null;
let golOverlayTimeout = null;

export function limparCacheCampo() {
  campoPlayerCache.clear();
  campoBolaEl = null;
  const container = document.getElementById("campo-jogadores");
  if (container) container.innerHTML = "";
  if (golOverlayTimeout) {
    clearTimeout(golOverlayTimeout);
    golOverlayTimeout = null;
  }
}
// Sistema de Áudio Gamificado (Web Audio API)
const AudioArena = {
  ctx: null,
  init() {
    if (this.ctx) return;
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
  },
  play(tipo) {
    if (!this.ctx) this.init();
    if (this.ctx.state === 'suspended') this.ctx.resume();

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.connect(gain);
    gain.connect(this.ctx.destination);

    const agora = this.ctx.currentTime;

    switch (tipo) {
      case 'kick':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(150, agora);
        osc.frequency.exponentialRampToValueAtTime(40, agora + 0.1);
        gain.gain.setValueAtTime(0.3, agora);
        gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.1);
        osc.start();
        osc.stop(agora + 0.1);
        break;
      case 'tackle':
        osc.type = 'square';
        osc.frequency.setValueAtTime(80, agora);
        gain.gain.setValueAtTime(0.1, agora);
        gain.gain.linearRampToValueAtTime(0, agora + 0.05);
        osc.start();
        osc.stop(agora + 0.05);
        break;
      case 'goal':
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, agora);
        osc.frequency.exponentialRampToValueAtTime(880, agora + 0.2);
        osc.frequency.exponentialRampToValueAtTime(660, agora + 0.4);
        gain.gain.setValueAtTime(0.2, agora);
        gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.8);
        osc.start();
        osc.stop(agora + 0.8);
        break;
      case 'whistle':
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, agora);
        osc.frequency.exponentialRampToValueAtTime(1500, agora + 0.1);
        osc.frequency.exponentialRampToValueAtTime(1200, agora + 0.2);
        gain.gain.setValueAtTime(0.1, agora);
        gain.gain.linearRampToValueAtTime(0.1, agora + 0.2);
        gain.gain.linearRampToValueAtTime(0, agora + 0.3);
        osc.start();
        osc.stop(agora + 0.3);
        break;
      case 'skill':
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(200, agora);
        osc.frequency.exponentialRampToValueAtTime(800, agora + 0.3);
        gain.gain.setValueAtTime(0.05, agora);
        gain.gain.exponentialRampToValueAtTime(0.01, agora + 0.4);
        osc.start();
        osc.stop(agora + 0.4);
        break;
    }
  }
};

function criarDisplayClima(campo) {
  const div = document.createElement("div");
  div.id = "clima-display";
  div.className = "absolute top-4 left-1/2 -translate-x-1/2 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-white z-20 border border-white/10";
  campo.appendChild(div);
  return div;
}

function obterEmojiClima(clima) {
  switch (clima) {
    case "Sol": return "☀️";
    case "Nublado": return "☁️";
    case "Chuva": return "🌧️";
    default: return "☀️";
  }
}

export function renderizarCampoPartida(estadoPartida) {
  const minutoDisplay = `${estadoPartida.minuto}'`;
  document.getElementById("placar-minuto").innerText = minutoDisplay;
  document.getElementById("placar-gols-usuario").innerText = estadoPartida.placarUsuario;
  document.getElementById("placar-gols-oponente").innerText = estadoPartida.placarOponente;
  document.getElementById("partida-narracao").innerText = estadoPartida.narracao;

  // Gatilhos de Áudio baseados no evento
  if (estadoPartida.tipoEvento === "kickoff") AudioArena.play('whistle');
  if (estadoPartida.tipoEvento === "pass") AudioArena.play('kick');
  if (estadoPartida.tipoEvento === "tackle") AudioArena.play('tackle');
  if (estadoPartida.tipoEvento === "goal") AudioArena.play('goal');
  if (estadoPartida.narracao && estadoPartida.narracao.includes("🌟")) AudioArena.play('skill');
const containerJogadores = document.getElementById("campo-jogadores");
const campoContainer = document.querySelector(".campo-container");


  // Cria elementos dos jogadores uma única vez
  if (campoPlayerCache.size === 0) {
    estadoPartida.jogadores.forEach(p => {
      const el = document.createElement("div");
      const comBola = p.id === estadoPartida.bola.donoId;
      el.className = `jogador-no-campo ${p.ehUsuario ? 'usuario' : 'oponente'} ${comBola ? 'com-bola' : ''}`;

      const staminaColor = '#10b981';
      el.innerHTML = `
        <div class="avatar">
          <span class="posicao-tag">${p.posicao.slice(0, 3)}</span>
          <span>${p.nome.slice(0, 2).toUpperCase()}</span>
        </div>
        <div class="nome-tag">${p.nome.split(" ")[0]}</div>
        <div class="stamina-bar">
          <div class="stamina-bar-fill" style="width:100%;background:${staminaColor}"></div>
        </div>
      `;
      el.style.left = `${p.x}%`;
      el.style.top = `${p.y}%`;
      el.dataset.playerId = p.id;
      containerJogadores.appendChild(el);
      campoPlayerCache.set(p.id, el);
    });
  }

  // Atualiza posições e estados dos jogadores in-place
  estadoPartida.jogadores.forEach(p => {
    const el = campoPlayerCache.get(p.id);
    if (!el) return;

    el.style.left = `${p.x}%`;
    el.style.top = `${p.y}%`;

    const comBola = p.id === estadoPartida.bola.donoId;
    el.classList.toggle("com-bola", comBola);
    
    // Indicação de habilidade ativa (Brilho dourado/azul)
    el.classList.toggle("habilidade-ativa", p.habilidadeAtiva);

    const staminaPercent = p.stamina !== undefined ? p.stamina : 100;
    const staminaColor = staminaPercent > 65 ? '#10b981' : staminaPercent > 35 ? '#f59e0b' : '#ef4444';
    const barFill = el.querySelector(".stamina-bar-fill");
    if (barFill) {
      barFill.style.width = `${staminaPercent}%`;
      barFill.style.background = staminaColor;
    }
  });

  // Clima
  if (estadoPartida.clima) {
    const campo = document.querySelector(".campo-container");
    campo.dataset.clima = estadoPartida.clima;
    const climaDisplay = document.getElementById("clima-display") || criarDisplayClima(campo);
    climaDisplay.innerText = `${obterEmojiClima(estadoPartida.clima)} ${estadoPartida.clima}`;
  }

  // Bola
  if (!campoBolaEl) {
    campoBolaEl = document.getElementById("campo-bola");
  }
  if (campoBolaEl) {
    campoBolaEl.style.left = `${estadoPartida.bola.x}%`;
    campoBolaEl.style.top = `${estadoPartida.bola.y}%`;
  }

  // Overlay de gol
  if (estadoPartida.tipoEvento === "goal") {
    exibirOverlayGol(estadoPartida, campoContainer);
  }
}

function exibirOverlayGol(estadoPartida, campoContainer) {
  if (!campoContainer) campoContainer = document.querySelector(".campo-container");
  if (!campoContainer) return;

  if (golOverlayTimeout) {
    clearTimeout(golOverlayTimeout);
    campoContainer.querySelectorAll(".gol-overlay, .confete").forEach(el => el.remove());
  }

  const overlay = document.createElement("div");
  overlay.className = "gol-overlay";
  overlay.innerHTML = `
    <span class="gol-text">⚽ GOL</span>
    <span class="gol-sub">${estadoPartida.placarUsuario} - ${estadoPartida.placarOponente}</span>
  `;
  campoContainer.appendChild(overlay);

  // Efeito de Tremer Campo
  campoContainer.classList.add("shake");
  setTimeout(() => campoContainer.classList.remove("shake"), 600);

  for (let i = 0; i < 50; i++) {
    const confete = document.createElement("div");
    confete.className = "confete";
    const cores = ["#e11d48", "#fbbf24", "#10b981", "#3b82f6", "#a855f7", "#fff"];
    confete.style.cssText = `
      left: ${5 + Math.random() * 90}%;
      top: ${-5 + Math.random() * 10}%;
      background: ${cores[Math.floor(Math.random() * cores.length)]};
      width: ${4 + Math.random() * 6}px;
      height: ${4 + Math.random() * 6}px;
      animation-delay: ${Math.random() * 0.3}s;
      animation-duration: ${1.5 + Math.random() * 1}s;
      border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
    `;
    campoContainer.appendChild(confete);
  }

  golOverlayTimeout = setTimeout(() => {
    const golEl = campoContainer.querySelector(".gol-overlay");
    if (golEl) golEl.remove();
    campoContainer.querySelectorAll(".confete").forEach(c => c.remove());
    golOverlayTimeout = null;
  }, 2500);
}




