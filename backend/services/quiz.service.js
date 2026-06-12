import { usuariosRepository } from '../repositories/usuarios.repository.js';
import { dbRun } from '../database/connection.js';

export const quizService = {
  async submeterResposta(usuarioId, quizId, resposta) {
    const quizzes = await usuariosRepository.obterQuizzes();
    const quiz = quizzes.find(q => q.id === quizId);

    if (!quiz) {
      throw new Error("Quiz não encontrado.");
    }

    const ehCorreto = quiz.resposta_correta.toUpperCase() === resposta.toUpperCase();
    await usuariosRepository.salvarRespostaQuiz(usuarioId, quizId, ehCorreto);

    let moedasGanhas = 0;
    let xpGanho = 0;

    if (ehCorreto) {
      moedasGanhas = 80;
      xpGanho = 50;
      await usuariosRepository.adicionarMoedas(usuarioId, moedasGanhas);
    } else {
      moedasGanhas = 15;
      await usuariosRepository.adicionarMoedas(usuarioId, moedasGanhas);
    }

    // Atribuir XP a um card aleatório do usuário se a resposta for correta
    const cartas = await usuariosRepository.obterCartasUsuario(usuarioId);
    if (cartas.length > 0 && ehCorreto) {
      const cartaRolada = cartas[Math.floor(Math.random() * cartas.length)];
      await dbRun("UPDATE cartas_usuario SET xp = xp + ? WHERE id = ?", [xpGanho, cartaRolada.id]);
    }

    // Conquista: "Conhecedor da Empresa" caso responda pelo menos 6 corretamente
    const idsConcluidos = await usuariosRepository.obterIdsQuizzesConcluidosUsuario(usuarioId);
    if (idsConcluidos.length >= 6) {
      await usuariosRepository.desbloquearTrofeu(usuarioId, "Conhecedor da Empresa");
    }

    return {
      correto: ehCorreto,
      mensagem: ehCorreto 
        ? `Excelente, acertou! Resposta correta: Opção [${quiz.resposta_correta}]. Você ganhou +${moedasGanhas} Moedas NDL e seus colaboradores receberam +${xpGanho} de XP de evolução!`
        : `Ah, resposta incorreta! A opção certa era a [${quiz.resposta_correta}]. Ganho de consolação: +15 Moedas NDL pelo empenho operacional!`,
      moedasGanhas,
      xpGanho: ehCorreto ? xpGanho : 0,
      totalQuizzesRespondidos: idsConcluidos.length
    };
  }
};
