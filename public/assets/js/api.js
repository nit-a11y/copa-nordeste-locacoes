// API REST — Chamadas HTTP assíncronas para o Backend (Stack NIT)

export async function apiAutenticar(nomeUsuario) {
  const resposta = await fetch('/api/auth', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: nomeUsuario })
  });
  return await resposta.json();
}

export async function apiObterDadosUsuario(usuarioId) {
  const resposta = await fetch(`/api/user/${usuarioId}`);
  return await resposta.json();
}

export async function apiMelhorarCarta(usuarioId, cartaUsuarioId, atributo) {
  const resposta = await fetch('/api/card/upgrade', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, userCardId: cartaUsuarioId, attribute: atributo })
  });
  return await resposta.json();
}

export async function apiSalvarEscalacao(usuarioId, lineUps) {
  const resposta = await fetch('/api/card/set-starters', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, lineUps })
  });
  return await resposta.json();
}

export async function apiListarQuizzes() {
  const resposta = await fetch('/api/quizzes');
  return await resposta.json();
}

export async function apiSubmeterRespostaQuiz(usuarioId, quizId, opcao) {
  const resposta = await fetch('/api/quizzes/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, quizId, option: opcao })
  });
  return await resposta.json();
}

export async function apiComprarPacote(usuarioId, tipoPacote) {
  const resposta = await fetch('/api/package/buy', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, packageType: tipoPacote })
  });
  return await resposta.json();
}

export async function apiObterRanking() {
  const resposta = await fetch('/api/leaderboard');
  return await resposta.json();
}

export async function apiObterColaboradores() {
  const resposta = await fetch('/api/colaboradores');
  return await resposta.json();
}

export async function apiTreinarPosicao(usuarioId, cartaUsuarioId, position) {
  const resposta = await fetch('/api/card/train-position', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, userCardId: cartaUsuarioId, position })
  });
  return await resposta.json();
}

export async function apiObterQuizzesRespondidos(usuarioId) {
  const resposta = await fetch(`/api/quizzes/answered/${usuarioId}`);
  return await resposta.json();
}

export async function apiListarOponentesLiga(usuarioId) {
  const resposta = await fetch(`/api/liga/oponentes/${usuarioId}`);
  return await resposta.json();
}

export async function apiObterHistoricoLiga(usuarioId) {
  const resposta = await fetch(`/api/liga/historico/${usuarioId}`);
  return await resposta.json();
}

export async function apiObterRankingPvP() {
  const resposta = await fetch('/api/liga/ranking-pvp');
  return await resposta.json();
}

export async function apiRegistrarDestaqueArena(usuarioId, destaque) {
  const resposta = await fetch('/api/glorias/destaques', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId: usuarioId, destaque })
  });
  return await resposta.json();
}
