import { usuariosRepository } from '../repositories/usuarios.repository.js';
import { quizService } from '../services/quiz.service.js';
import { pacoteService } from '../services/pacote.service.js';

export const usuariosController = {
  async autenticarUsuario(req, res, next) {
    try {
      const { username } = req.body;
      if (!username) {
        return res.status(400).json({ sucesso: false, mensagem: "O nome de usuÃ¡rio Ã© obrigatÃ³rio." });
      }

      const nomeLimpo = username.trim();
      if (nomeLimpo.length < 2) {
        return res.status(400).json({ sucesso: false, mensagem: "O nome de usuÃ¡rio deve ter pelo menos 2 caracteres." });
      }

      let usuario = await usuariosRepository.obterUsuarioPorNome(nomeLimpo);
      let ehNovo = false;

      if (!usuario) {
        usuario = await usuariosRepository.criarUsuario(nomeLimpo);
        ehNovo = true;
      }

      const cartas = await usuariosRepository.obterCartasUsuario(usuario.id);
      const campanha = await usuariosRepository.obterCampanhaUsuario(usuario.id);
      const trofeus = await usuariosRepository.obterTrofeusUsuario(usuario.id);
      const destaques = await usuariosRepository.obterDestaquesUsuario(usuario.id, 12);

      return res.json({
        sucesso: true,
        mensagem: "Autenticado com sucesso na Arena NDL.",
        dados: {
          user: usuario,
          cards: cartas,
          campaign: campanha,
          trophies: trofeus,
          isNew: ehNovo
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async obterDadosUsuario(req, res, next) {
    try {
      const usuarioId = Number(req.params.id);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ sucesso: false, mensagem: "ID de usuÃ¡rio invÃ¡lido." });
      }

      const usuario = await usuariosRepository.obterUsuarioPorId(usuarioId);
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: "UsuÃ¡rio nÃ£o encontrado." });
      }

      const cartas = await usuariosRepository.obterCartasUsuario(usuarioId);
      const campanha = await usuariosRepository.obterCampanhaUsuario(usuarioId);
      const trofeus = await usuariosRepository.obterTrofeusUsuario(usuarioId);
      const destaques = await usuariosRepository.obterDestaquesUsuario(usuarioId, 12);

      return res.json({
        sucesso: true,
        mensagem: "Dados do usuÃ¡rio obtidos com sucesso.",
        dados: {
          user: usuario,
          cards: cartas,
          campaign: campanha,
          trophies: trofeus
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async melhorarAtributoCarta(req, res, next) {
    try {
      const { userId, userCardId, attribute } = req.body;
      if (!userId || !userCardId || !attribute) {
        return res.status(400).json({ sucesso: false, mensagem: "Dados insuficientes para melhoria." });
      }

      const cartas = await usuariosRepository.obterCartasUsuario(Number(userId));
      const carta = cartas.find(c => c.id === Number(userCardId));

      if (!carta) {
        return res.status(404).json({ sucesso: false, mensagem: "Carta nÃ£o encontrada." });
      }

      const custoMoedas = carta.level * 120;
      const custoXp = 40;

      if (carta.xp < custoXp) {
        return res.status(400).json({ sucesso: false, mensagem: `XP insuficiente. Requer ${custoXp} XP.` });
      }

      const sucesso = await usuariosRepository.atualizarAtributoCarta(
        Number(userId),
        Number(userCardId),
        attribute,
        custoXp,
        custoMoedas
      );

      if (!sucesso) {
        return res.status(400).json({ sucesso: false, mensagem: "Saldo de Moedas NDL insuficiente." });
      }

      // Desbloqueia conquista caso o nÃ­vel de treinamento seja alto (Lv >= 10)
      const cartasAtualizadas = await usuariosRepository.obterCartasUsuario(Number(userId));
      const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));
      
      const possuiNivel10 = cartasAtualizadas.some(c => c.level >= 10);
      if (possuiNivel10) {
        await usuariosRepository.desbloquearTrofeu(Number(userId), "Lenda do Treinamento");
      }

      // Sincroniza novamente os trofÃ©us atualizados
      const trofeusAtualizados = await usuariosRepository.obterTrofeusUsuario(Number(userId));

      return res.json({
        sucesso: true,
        mensagem: "Carta de colaborador treinada com sucesso!",
        dados: {
          cards: cartasAtualizadas,
          user: usuarioAtualizado,
          trophies: trofeusAtualizados
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async escalarTime(req, res, next) {
    try {
      const { userId, lineUps } = req.body;
      if (!userId || !lineUps || !Array.isArray(lineUps)) {
        return res.status(400).json({ sucesso: false, mensagem: "EscalaÃ§Ã£o de titulares invÃ¡lida." });
      }

      const cartas = await usuariosRepository.obterCartasUsuario(Number(userId));

      // Reseta todas as cartas primeiro
      for (const c of cartas) {
        await usuariosRepository.atualizarStatusTitularCarta(Number(userId), c.id, 0, "");
      }

      // Configura os novos titulares
      for (const l of lineUps) {
        const existe = cartas.some(c => c.id === Number(l.cardId));
        if (existe) {
          await usuariosRepository.atualizarStatusTitularCarta(Number(userId), Number(l.cardId), 1, l.position);
        }
      }

      const cartasAtualizadas = await usuariosRepository.obterCartasUsuario(Number(userId));

      return res.json({
        sucesso: true,
        mensagem: "Equipe escalada com sucesso!",
        dados: {
          cards: cartasAtualizadas
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async listarQuizzes(req, res, next) {
    try {
      const lista = await usuariosRepository.obterQuizzes();
      return res.json({
        sucesso: true,
        mensagem: "Quizzes listados com sucesso.",
        dados: {
          quizzes: lista
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async submeterRespostaQuiz(req, res, next) {
    try {
      const { userId, quizId, option } = req.body;
      if (!userId || !quizId || !option) {
        return res.status(400).json({ sucesso: false, mensagem: "Dados invÃ¡lidos para submissÃ£o." });
      }

      const resultado = await quizService.submeterResposta(Number(userId), Number(quizId), option);
      const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));
      const cartasAtualizadas = await usuariosRepository.obterCartasUsuario(Number(userId));
      const trofeusAtualizados = await usuariosRepository.obterTrofeusUsuario(Number(userId));

      return res.json({
        sucesso: true,
        mensagem: resultado.mensagem,
        dados: {
          correct: resultado.correto,
          moedasGanhas: resultado.moedasGanhas,
          xpGanho: resultado.xpGanho,
          totalQuizzesRespondidos: resultado.totalQuizzesRespondidos,
          user: usuarioAtualizado,
          cards: cartasAtualizadas,
          trophies: trofeusAtualizados
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async comprarPacote(req, res, next) {
    try {
      const { userId, packageType } = req.body;
      if (!userId || !packageType) {
        return res.status(400).json({ sucesso: false, mensagem: "ParÃ¢metros de compra insuficientes." });
      }

      const resultado = await pacoteService.comprarPacote(Number(userId), packageType);
      if (!resultado.sucesso) {
        return res.status(400).json({ sucesso: false, mensagem: resultado.mensagem });
      }

      const cartasAtualizadas = await usuariosRepository.obterCartasUsuario(Number(userId));
      const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));

      return res.json({
        sucesso: true,
        mensagem: resultado.mensagem,
        dados: {
          card: resultado.carta,
          cardsDrawn: resultado.cartas,
          isDuplicate: resultado.ehDuplicado,
          user: usuarioAtualizado,
          cards: cartasAtualizadas
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async obterRanking(req, res, next) {
    try {
      const ranking = await usuariosRepository.obterTodosUsuarios();
      return res.json({
        sucesso: true,
        mensagem: "Ranking carregado com sucesso.",
        dados: {
          leaderboard: ranking
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async obterColaboradores(req, res, next) {
    try {
      const lista = await usuariosRepository.obterColaboradoresDisponiveis();
      return res.json({
        sucesso: true,
        mensagem: "Galeria de colaboradores obtida com sucesso.",
        dados: {
          colaboradores: lista
        }
      });
    } catch (err) {
      next(err);
    }
  },

  async treinarPosicao(req, res, next) {
    try {
      const { userId, userCardId, position } = req.body;
      if (!userId || !userCardId || !position) {
        return res.status(400).json({ sucesso: false, mensagem: "Dados insuficientes para treinar posiÃ§Ã£o." });
      }

      const POSICOES_VALIDAS = ["GOLEIRO", "DEFENSOR", "ALA_DIREITA", "ALA_ESQUERDA", "ATACANTE"];
      if (!POSICOES_VALIDAS.includes(position)) {
        return res.status(400).json({ sucesso: false, mensagem: "PosiÃ§Ã£o invÃ¡lida." });
      }

      const resultado = await usuariosRepository.treinarPosicaoCarta(Number(userId), Number(userCardId), position);
      if (!resultado.sucesso) {
        return res.status(400).json({ sucesso: false, mensagem: resultado.mensagem });
      }

      const cartasAtualizadas = await usuariosRepository.obterCartasUsuario(Number(userId));
      const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(Number(userId));
      const trofeusAtualizados = await usuariosRepository.obterTrofeusUsuario(Number(userId));

      return res.json({
        sucesso: true,
        mensagem: resultado.mensagem,
        dados: {
          cards: cartasAtualizadas,
          user: usuarioAtualizado,
          trophies: trofeusAtualizados
        }
      });
    } catch (err) {
      next(err);
    }
  },


  async obterRankingPvP(req, res, next) {
    try {
      const ranking = await usuariosRepository.obterRankingPvP(5);
      return res.json({
        sucesso: true,
        mensagem: "Ranking PvP carregado com sucesso.",
        dados: { ranking }
      });
    } catch (err) {
      next(err);
    }
  },

  async registrarDestaqueArena(req, res, next) {
    try {
      const { userId, destaque } = req.body;
      if (!userId || !destaque || typeof destaque !== "object") {
        return res.status(400).json({ sucesso: false, mensagem: "Dados inválidos para destaque." });
      }

      const usuario = await usuariosRepository.obterUsuarioPorId(Number(userId));
      if (!usuario) {
        return res.status(404).json({ sucesso: false, mensagem: "Usuário não encontrado." });
      }

      const destaqueChave = await usuariosRepository.salvarDestaqueUsuario(Number(userId), destaque);
      const destaquesAtualizados = await usuariosRepository.obterDestaquesUsuario(Number(userId), 12);

      return res.json({
        sucesso: true,
        mensagem: "Destaque registrado com sucesso.",
        dados: {
          destaqueChave,
          destaques: destaquesAtualizados
        }
      });
    } catch (err) {
      next(err);
    }
  },  async obterHistoricoLiga(req, res, next) {
    try {
      const usuarioId = Number(req.params.userId);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ sucesso: false, mensagem: "ID de usuÃ¡rio invÃ¡lido." });
      }
      const historico = await usuariosRepository.obterHistoricoPartidas(usuarioId, 4);
      return res.json({
        sucesso: true,
        dados: { historico }
      });
    } catch (err) {
      next(err);
    }
  },

  async listarOponentesLiga(req, res, next) {
    try {
      const usuarioId = Number(req.params.userId);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ sucesso: false, mensagem: "ID de usuÃ¡rio invÃ¡lido." });
      }

      const oponentes = await usuariosRepository.listarOponentesLiga(usuarioId);
      return res.json({
        sucesso: true,
        mensagem: "Oponentes da Liga carregados.",
        dados: { oponentes }
      });
    } catch (err) {
      next(err);
    }
  },

  async obterQuizzesRespondidos(req, res, next) {
    try {
      const usuarioId = Number(req.params.id);
      if (isNaN(usuarioId)) {
        return res.status(400).json({ sucesso: false, mensagem: "ID invÃ¡lido." });
      }

      const respondidos = await usuariosRepository.obterQuizzesRespondidosUsuario(usuarioId);
      return res.json({
        sucesso: true,
        dados: {
          answered: respondidos
        }
      });
    } catch (err) {
      next(err);
    }
  }
};

