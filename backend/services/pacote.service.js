import { dbRun } from '../database/connection.js';
import { usuariosRepository } from '../repositories/usuarios.repository.js';

const CONFIGURACOES_PACOTE = {
  inicial: {
    custo: 0,
    quantidadeCartas: 5,
    distribuicao: {
      Comum: 82,
      Raro: 15,
      'Épico': 2,
      'Lendário': 0.5,
      'Mítico': 0.05
    }
  },
  bronze: {
    custo: 150,
    quantidadeCartas: 1,
    distribuicao: {
      Comum: 80,
      Raro: 18,
      'Épico': 2
    }
  },
  prata: {
    custo: 300,
    quantidadeCartas: 1,
    distribuicao: {
      Comum: 35,
      Raro: 50,
      'Épico': 13,
      'Lendário': 2
    }
  },
  ouro: {
    custo: 600,
    quantidadeCartas: 1,
    distribuicao: {
      Comum: 10,
      Raro: 35,
      'Épico': 43,
      'Lendário': 10,
      'Mítico': 2
    }
  },
  lendario: {
    custo: 1200,
    quantidadeCartas: 1,
    distribuicao: {
      Raro: 15,
      'Épico': 45,
      'Lendário': 33,
      'Mítico': 7
    }
  }
};

function sortearRaridade(distribuicao) {
  const entradas = Object.entries(distribuicao).filter(([, peso]) => Number(peso) > 0);
  const pesoTotal = entradas.reduce((acumulador, [, peso]) => acumulador + Number(peso), 0);

  if (pesoTotal <= 0) {
    return 'Comum';
  }

  const rolagem = Math.random() * pesoTotal;
  let acumulado = 0;

  for (const [raridade, peso] of entradas) {
    acumulado += Number(peso);
    if (rolagem <= acumulado) {
      return raridade;
    }
  }

  return entradas[entradas.length - 1][0];
}

function sortearColaboradorPorRaridade(colaboradores, raridadeSelecionada, idsIgnorados = new Set()) {
  const colaboradoresDisponiveis = colaboradores.filter((colaborador) => !idsIgnorados.has(colaborador.id));
  const pool = colaboradoresDisponiveis.filter((colaborador) => colaborador.raridade === raridadeSelecionada);
  const listaSorteio = pool.length > 0 ? pool : colaboradoresDisponiveis;
  return listaSorteio[Math.floor(Math.random() * listaSorteio.length)];
}

export const pacoteService = {
  async comprarPacote(usuarioId, tipoPacote) {
    const usuario = await usuariosRepository.obterUsuarioPorId(usuarioId);
    if (!usuario) {
      return { sucesso: false, mensagem: "Usuario nao encontrado." };
    }

    const configuracaoPacote = CONFIGURACOES_PACOTE[tipoPacote];
    if (!configuracaoPacote) {
      return { sucesso: false, mensagem: "Tipo de pacote invalido." };
    }

    if (tipoPacote === 'inicial' && usuario.caixa_inicial_resgatada === 1) {
      return { sucesso: false, mensagem: "A caixa inicial ja foi resgatada para este usuario." };
    }

    if (usuario.moedas < configuracaoPacote.custo) {
      return {
        sucesso: false,
        mensagem: `Moedas insuficientes. Custo: ${configuracaoPacote.custo} Moedas NDL. Voce tem: ${usuario.moedas} Moedas NDL.`
      };
    }

    const colaboradores = await usuariosRepository.obterColaboradoresDisponiveis();
    const cartasRecebidas = [];
    let quantidadeDuplicadas = 0;
    const idsSorteadosNoPacote = new Set();

    if (configuracaoPacote.custo > 0) {
      await dbRun(
        "UPDATE usuarios SET moedas = moedas - ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
        [configuracaoPacote.custo, usuarioId]
      );
    }

    for (let indice = 0; indice < configuracaoPacote.quantidadeCartas; indice += 1) {
      const raridadeSelecionada = sortearRaridade(configuracaoPacote.distribuicao);
      const colaboradorSorteado = tipoPacote === 'inicial'
        ? sortearColaboradorPorRaridade(colaboradores, raridadeSelecionada, idsSorteadosNoPacote)
        : sortearColaboradorPorRaridade(colaboradores, raridadeSelecionada);
      const resultadoAdicao = await usuariosRepository.adicionarCartaAoUsuario(usuarioId, colaboradorSorteado.id);

      if (tipoPacote === 'inicial') {
        idsSorteadosNoPacote.add(colaboradorSorteado.id);
      }

      if (resultadoAdicao.ehDuplicado) {
        quantidadeDuplicadas += 1;
      }

      cartasRecebidas.push({
        ...colaboradorSorteado,
        ehDuplicado: resultadoAdicao.ehDuplicado
      });
    }

    if (tipoPacote === 'inicial') {
      await usuariosRepository.marcarCaixaInicialComoResgatada(usuarioId);
    }

    const usuarioAtualizado = await usuariosRepository.obterUsuarioPorId(usuarioId);
    const mensagem = tipoPacote === 'inicial'
      ? `Caixa inicial resgatada com sucesso! Voce recebeu ${cartasRecebidas.length} cartas para montar seu elenco.`
      : quantidadeDuplicadas > 0
        ? `Pacote aberto com sucesso! ${quantidadeDuplicadas} carta(s) duplicada(s) foram convertidas em XP.`
        : `Pacote aberto com sucesso! ${cartasRecebidas[0].nome} entrou para o seu elenco.`;

    return {
      sucesso: true,
      mensagem,
      carta: cartasRecebidas[0] || null,
      cartas: cartasRecebidas,
      ehDuplicado: cartasRecebidas.length === 1 ? Boolean(cartasRecebidas[0]?.ehDuplicado) : quantidadeDuplicadas > 0,
      moedasRestantes: usuarioAtualizado.moedas
    };
  }
};
