import { Router } from 'express';
import { usuariosController } from '../controllers/usuarios.controller.js';
import { limitadorAutenticacao, sanitizarEntradas } from '../middlewares/seguranca.middleware.js';

const router = Router();

// Autenticação (Login e registro rápido)
router.post('/auth', limitadorAutenticacao, sanitizarEntradas, usuariosController.autenticarUsuario);

// Dados do Usuário
router.get('/user/:id', sanitizarEntradas, usuariosController.obterDadosUsuario);

// Melhorias e escalação de cartas
router.post('/card/upgrade', usuariosController.melhorarAtributoCarta);
router.post('/card/set-starters', usuariosController.escalarTime);
router.post('/card/train-position', usuariosController.treinarPosicao);

// Quizzes
router.get('/quizzes', usuariosController.listarQuizzes);
router.post('/quizzes/submit', usuariosController.submeterRespostaQuiz);
router.get('/quizzes/answered/:id', usuariosController.obterQuizzesRespondidos);

// Compra de pacotes
router.post('/package/buy', usuariosController.comprarPacote);

// Ranking e Galeria geral de colaboradores
router.get('/leaderboard', usuariosController.obterRanking);
router.get('/colaboradores', usuariosController.obterColaboradores);

// Liga PvP
router.get('/liga/oponentes/:userId', usuariosController.listarOponentesLiga);
router.get('/liga/historico/:userId', usuariosController.obterHistoricoLiga);
router.get('/liga/ranking-pvp', usuariosController.obterRankingPvP);

// Destaques da Arena
router.post('/glorias/destaques', usuariosController.registrarDestaqueArena);

export default router;
