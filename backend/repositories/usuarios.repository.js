import { dbGet, dbAll, dbRun } from '../database/connection.js';

export const usuariosRepository = {
  async obterUsuarioPorNome(nomeUsuario) {
    return await dbGet("SELECT * FROM usuarios WHERE nome_usuario = ?", [nomeUsuario]);
  },

  async criarUsuario(nomeUsuario) {
    const resultado = await dbRun("INSERT INTO usuarios (nome_usuario) VALUES (?)", [nomeUsuario]);
    return await this.obterUsuarioPorId(resultado.lastID);
  },

  async obterUsuarioPorId(usuarioId) {
    return await dbGet("SELECT * FROM usuarios WHERE id = ?", [usuarioId]);
  },

  async obterTodosUsuarios() {
    return await dbAll("SELECT * FROM usuarios ORDER BY vitorias DESC, gols_marcados DESC LIMIT 100");
  },

  async obterCartasUsuario(usuarioId) {
    return await dbAll(`
      SELECT
        cu.id,
        cu.usuario_id,
        cu.colaborador_id,
        cu.xp,
        cu.level,
        cu.velocidade_bonus,
        cu.chute_bonus,
        cu.defesa_bonus,
        cu.energia_bonus,
        cu.eh_titular,
        cu.posicao,
        cu.posicoes_aprendidas,
        c.nome,
        c.setor,
        c.velocidade,
        c.chute,
        c.defesa,
        c.energia,
        c.raridade
      FROM cartas_usuario cu
      JOIN colaboradores c ON cu.colaborador_id = c.id
      WHERE cu.usuario_id = ?
    `, [usuarioId]);
  },

  async obterColaboradoresDisponiveis() {
    return await dbAll("SELECT * FROM colaboradores");
  },

  async adicionarCartaAoUsuario(usuarioId, colaboradorId) {
    const cartaExistente = await dbGet(`
      SELECT * FROM cartas_usuario WHERE usuario_id = ? AND colaborador_id = ?
    `, [usuarioId, colaboradorId]);

    if (cartaExistente) {
      await dbRun(`
        UPDATE cartas_usuario
        SET xp = xp + 150
        WHERE usuario_id = ? AND colaborador_id = ?
      `, [usuarioId, colaboradorId]);
      return { ehDuplicado: true };
    }

    await dbRun(`
      INSERT INTO cartas_usuario (usuario_id, colaborador_id, eh_titular, posicao, posicoes_aprendidas)
      VALUES (?, ?, 0, '', '[]')
    `, [usuarioId, colaboradorId]);

    return { ehDuplicado: false };
  },

  async marcarCaixaInicialComoResgatada(usuarioId) {
    await dbRun(`
      UPDATE usuarios
      SET caixa_inicial_resgatada = 1,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [usuarioId]);
  },

  async atualizarStatusTitularCarta(usuarioId, cartaUsuarioId, ehTitular, posicao) {
    await dbRun(`
      UPDATE cartas_usuario
      SET eh_titular = ?, posicao = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND usuario_id = ?
    `, [ehTitular, posicao, cartaUsuarioId, usuarioId]);
  },

  async adicionarXpCarta(usuarioId, cartaId, xp) {
    await dbRun(`
      UPDATE cartas_usuario
      SET xp = xp + ?
      WHERE id = ? AND usuario_id = ?
    `, [xp, cartaId, usuarioId]);
  },

  async atualizarAtributoCarta(usuarioId, cartaUsuarioId, atributo, custoXp, custoMoedas) {
    const usuario = await this.obterUsuarioPorId(usuarioId);
    if (!usuario || usuario.moedas < custoMoedas) return false;

    const campoBonus = `${atributo}_bonus`;

    await dbRun(`
      UPDATE cartas_usuario
      SET ${campoBonus} = ${campoBonus} + 5,
          level = level + 1,
          xp = MAX(0, xp - ?),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND usuario_id = ?
    `, [custoXp, cartaUsuarioId, usuarioId]);

    await dbRun(`
      UPDATE usuarios
      SET moedas = moedas - ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [custoMoedas, usuarioId]);

    return true;
  },

  async adicionarMoedas(usuarioId, quantidade) {
    await dbRun("UPDATE usuarios SET moedas = moedas + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [quantidade, usuarioId]);
  },

  async concederRecompensaSelecao(usuarioId, moedasTreinador, xpPorTitular) {
    await dbRun("UPDATE usuarios SET moedas = moedas + ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [moedasTreinador, usuarioId]);

    const titulares = await dbAll(`
      SELECT id
      FROM cartas_usuario
      WHERE usuario_id = ? AND eh_titular = 1
    `, [usuarioId]);

    for (const titular of titulares) {
      await dbRun(`
        UPDATE cartas_usuario
        SET xp = xp + ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ? AND usuario_id = ?
      `, [xpPorTitular, titular.id, usuarioId]);
    }

    return {
      totalTitulares: titulares.length,
      moedasTreinador,
      xpPorTitular
    };
  },

  async gravarResultadoPartida(usuarioId, venceu, golsMarcados) {
    const incrementoVitoria = venceu ? 1 : 0;
    const incrementoDerrota = venceu ? 0 : 1;

    await dbRun(`
      UPDATE usuarios
      SET vitorias = vitorias + ?,
          derrotas = derrotas + ?,
          gols_marcados = gols_marcados + ?,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [incrementoVitoria, incrementoDerrota, golsMarcados, usuarioId]);
  },

  async obterQuizzes() {
    return await dbAll("SELECT * FROM quizzes");
  },

  async salvarRespostaQuiz(usuarioId, quizId, respondidoCorretamente) {
    await dbRun(`
      INSERT INTO quizzes_usuario (usuario_id, quiz_id, respondido_corretamente)
      VALUES (?, ?, ?)
      ON CONFLICT(usuario_id, quiz_id) DO UPDATE SET respondido_corretamente = excluded.respondido_corretamente, updated_at = CURRENT_TIMESTAMP
    `, [usuarioId, quizId, respondidoCorretamente ? 1 : 0]);

    const contagem = await dbGet("SELECT COUNT(*) as total FROM quizzes_usuario WHERE usuario_id = ?", [usuarioId]);
    await dbRun("UPDATE usuarios SET quizzes_respondidos = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?", [contagem.total, usuarioId]);
  },

  async obterIdsQuizzesConcluidosUsuario(usuarioId) {
    const linhas = await dbAll(`
      SELECT quiz_id FROM quizzes_usuario WHERE usuario_id = ? AND respondido_corretamente = 1
    `, [usuarioId]);
    return linhas.map((linha) => linha.quiz_id);
  },

  async obterCampanhaUsuario(usuarioId) {
    const linhas = await dbAll("SELECT fase_chave, venceu FROM campanhas_usuario WHERE usuario_id = ?", [usuarioId]);
    const mapaCampanha = {};

    for (const linha of linhas) {
      mapaCampanha[linha.fase_chave] = linha.venceu === 1;
    }

    return mapaCampanha;
  },

  async salvarFaseCampanha(usuarioId, faseChave, venceu) {
    await dbRun(`
      INSERT INTO campanhas_usuario (usuario_id, fase_chave, venceu)
      VALUES (?, ?, ?)
      ON CONFLICT(usuario_id, fase_chave) DO UPDATE SET venceu = excluded.venceu, jogado_em = CURRENT_TIMESTAMP
    `, [usuarioId, faseChave, venceu ? 1 : 0]);
  },

  async obterTrofeusUsuario(usuarioId) {
    const linhas = await dbAll("SELECT trofeu_chave FROM trofeus_usuario WHERE usuario_id = ?", [usuarioId]);
    return linhas.map((linha) => linha.trofeu_chave);
  },

  async obterDestaquesUsuario(usuarioId, limite = 12) {
    const linhas = await dbAll(`
      SELECT
        destaque_chave,
        tipo,
        etiqueta,
        titulo,
        subtitulo,
        descricao,
        moedas,
        xp,
        meta,
        meta_rodape,
        icone,
        acento_secundario,
        created_at
      FROM destaques_usuario
      WHERE usuario_id = ?
      ORDER BY datetime(created_at) DESC, id DESC
      LIMIT ?
    `, [usuarioId, limite]);

    return linhas.map((linha) => ({
      destaqueChave: linha.destaque_chave,
      tipo: linha.tipo,
      etiqueta: linha.etiqueta,
      titulo: linha.titulo,
      subtitulo: linha.subtitulo || "",
      descricao: linha.descricao || "",
      moedas: linha.moedas || 0,
      xp: linha.xp || 0,
      meta: linha.meta || "",
      metaRodape: linha.meta_rodape || "",
      icone: linha.icone || "🏆",
      acentoSecundario: linha.acento_secundario || "",
      createdAt: linha.created_at
    }));
  },

  async salvarDestaqueUsuario(usuarioId, destaque) {
    const destaqueChave = destaque.destaqueChave || this.gerarChaveDestaque(destaque);

    await dbRun(`
      INSERT INTO destaques_usuario (
        usuario_id,
        destaque_chave,
        tipo,
        etiqueta,
        titulo,
        subtitulo,
        descricao,
        moedas,
        xp,
        meta,
        meta_rodape,
        icone,
        acento_secundario,
        updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
      ON CONFLICT(usuario_id, destaque_chave) DO UPDATE SET
        tipo = excluded.tipo,
        etiqueta = excluded.etiqueta,
        titulo = excluded.titulo,
        subtitulo = excluded.subtitulo,
        descricao = excluded.descricao,
        moedas = excluded.moedas,
        xp = excluded.xp,
        meta = excluded.meta,
        meta_rodape = excluded.meta_rodape,
        icone = excluded.icone,
        acento_secundario = excluded.acento_secundario,
        updated_at = CURRENT_TIMESTAMP
    `, [
      usuarioId,
      destaqueChave,
      destaque.tipo || "conquista",
      destaque.etiqueta || "Arena NDL",
      destaque.titulo || "Destaque da Arena",
      destaque.subtitulo || "",
      destaque.descricao || "",
      Number(destaque.moedas || 0),
      Number(destaque.xp || 0),
      destaque.meta || "",
      destaque.metaRodape || "",
      destaque.icone || "🏆",
      destaque.acentoSecundario || ""
    ]);

    return destaqueChave;
  },

  gerarChaveDestaque(destaque) {
    return [
      destaque.tipo || "conquista",
      destaque.etiqueta || "arena-ndl",
      destaque.titulo || "destaque-da-arena",
      destaque.subtitulo || "",
      destaque.descricao || ""
    ]
      .join("|")
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9|]+/g, "-")
      .replace(/\|+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 180);
  },

  async desbloquearTrofeu(usuarioId, trofeuChave) {
    await dbRun(`
      INSERT OR IGNORE INTO trofeus_usuario (usuario_id, trofeu_chave)
      VALUES (?, ?)
    `, [usuarioId, trofeuChave]);
  },

  async treinarPosicaoCarta(usuarioId, cartaUsuarioId, novaPosicao) {
    const carta = await dbGet(`
      SELECT * FROM cartas_usuario WHERE id = ? AND usuario_id = ?
    `, [cartaUsuarioId, usuarioId]);
    if (!carta) return { sucesso: false, mensagem: "Carta nao encontrada." };

    const posicoesAprendidas = JSON.parse(carta.posicoes_aprendidas || '[]');
    if (posicoesAprendidas.includes(novaPosicao)) {
      return { sucesso: false, mensagem: `Esta carta ja conhece a posicao ${novaPosicao.replace('_', ' ')}.` };
    }

    const usuario = await this.obterUsuarioPorId(usuarioId);
    const custo = 300;

    if (usuario.moedas < custo) {
      return { sucesso: false, mensagem: `Moedas insuficientes. Custo: ${custo} Moedas NDL. Voce tem: ${usuario.moedas}.` };
    }

    posicoesAprendidas.push(novaPosicao);
    await dbRun(`
      UPDATE cartas_usuario
      SET posicoes_aprendidas = ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND usuario_id = ?
    `, [JSON.stringify(posicoesAprendidas), cartaUsuarioId, usuarioId]);

    await dbRun(`
      UPDATE usuarios
      SET moedas = moedas - ?, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [custo, usuarioId]);

    return {
      sucesso: true,
      mensagem: `${carta.nome} aprendeu a posicao ${novaPosicao.replace('_', ' ')}! -${custo} Moedas NDL.`
    };
  },

  async listarOponentesLiga(usuarioIdExcluir) {
    const usuarios = await dbAll(`
      SELECT id, nome_usuario, vitorias, derrotas, gols_marcados
      FROM usuarios WHERE id != ? ORDER BY vitorias DESC
    `, [usuarioIdExcluir]);

    const resultado = [];
    for (const u of usuarios) {
      const titulares = await this.obterCartasUsuario(u.id);
      const time = titulares.filter(c => c.eh_titular === 1);
      const overall = time.length > 0
        ? Math.round(time.reduce((sum, c) => {
            const vel = c.velocidade + (c.velocidade_bonus || 0);
            const chu = c.chute + (c.chute_bonus || 0);
            const def = c.defesa + (c.defesa_bonus || 0);
            const ene = c.energia + (c.energia_bonus || 0);
            return sum + Math.round((vel + chu + def + ene) / 4);
          }, 0) / time.length)
        : 0;
      resultado.push({ ...u, time, overall });
    }
    return resultado;
  },

  async obterQuizzesRespondidosUsuario(usuarioId) {
    const linhas = await dbAll(`
      SELECT quiz_id, respondido_corretamente FROM quizzes_usuario WHERE usuario_id = ?
    `, [usuarioId]);

    return linhas.map((linha) => ({
      quizId: linha.quiz_id,
      respondidoCorretamente: linha.respondido_corretamente === 1
    }));
  },

  async salvarHistoricoPartida(usuarioId, oponenteNome, golsUsuario, golsOponente, venceu, tipo) {
    await dbRun(`
      INSERT INTO historico_partidas (usuario_id, oponente_nome, gols_usuario, gols_oponente, venceu, tipo)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [usuarioId, oponenteNome, golsUsuario, golsOponente, venceu ? 1 : 0, tipo]);
  },

  async obterHistoricoPartidas(usuarioId, limite = 4) {
    return await dbAll(`
      SELECT * FROM historico_partidas
      WHERE usuario_id = ?
      ORDER BY created_at DESC
      LIMIT ?
    `, [usuarioId, limite]);
  },

  async obterRankingPvP(limite = 50) {
    return await dbAll(`
      SELECT 
        u.id, 
        u.nome_usuario,
        COUNT(CASE WHEN hp.venceu = 1 THEN 1 END) as vitorias_pvp,
        COUNT(CASE WHEN hp.venceu = 0 THEN 1 END) as derrotas_pvp,
        IFNULL(SUM(hp.gols_usuario), 0) as gols_pvp,
        (
          SELECT ROUND(AVG((cu.velocidade + cu.velocidade_bonus + cu.chute + cu.chute_bonus + cu.defesa + cu.defesa_bonus + cu.energia + cu.energia_bonus) / 4))
          FROM cartas_usuario cu
          WHERE cu.usuario_id = u.id AND cu.eh_titular = 1
        ) as overall
      FROM usuarios u
      JOIN historico_partidas hp ON u.id = hp.usuario_id
      WHERE hp.tipo = 'pvp'
      GROUP BY u.id
      ORDER BY vitorias_pvp DESC, gols_pvp DESC
      LIMIT ?
    `, [limite]);
  }
};
