import { dbExec, dbGet, dbRun } from './connection.js';

export async function initDatabase() {
  console.log("Inicializando o esquema do banco de dados...");

  // 1. Criação das tabelas em português com as colunas obrigatórias
  await dbExec(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome_usuario TEXT UNIQUE NOT NULL,
      senha TEXT,
      moedas INTEGER DEFAULT 1500,
      caixa_inicial_resgatada INTEGER DEFAULT 0,
      vitorias INTEGER DEFAULT 0,
      derrotas INTEGER DEFAULT 0,
      gols_marcados INTEGER DEFAULT 0,
      quizzes_respondidos INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS colaboradores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nome TEXT UNIQUE NOT NULL,
      setor TEXT NOT NULL,
      velocidade INTEGER NOT NULL,
      chute INTEGER NOT NULL,
      defesa INTEGER NOT NULL,
      energia INTEGER NOT NULL,
      raridade TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS cartas_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      colaborador_id INTEGER NOT NULL,
      xp INTEGER DEFAULT 0,
      level INTEGER DEFAULT 1,
      velocidade_bonus INTEGER DEFAULT 0,
      chute_bonus INTEGER DEFAULT 0,
      defesa_bonus INTEGER DEFAULT 0,
      energia_bonus INTEGER DEFAULT 0,
      eh_titular INTEGER DEFAULT 0,
      posicao TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY(colaborador_id) REFERENCES colaboradores(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS quizzes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      categoria TEXT NOT NULL,
      pergunta TEXT NOT NULL,
      opcao_a TEXT NOT NULL,
      opcao_b TEXT NOT NULL,
      opcao_c TEXT NOT NULL,
      opcao_d TEXT NOT NULL,
      resposta_correta TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME
    );

    CREATE TABLE IF NOT EXISTS quizzes_usuario (
      usuario_id INTEGER NOT NULL,
      quiz_id INTEGER NOT NULL,
      respondido_corretamente INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      PRIMARY KEY(usuario_id, quiz_id),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE,
      FOREIGN KEY(quiz_id) REFERENCES quizzes(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS trofeus_usuario (
      usuario_id INTEGER NOT NULL,
      trofeu_chave TEXT NOT NULL,
      desbloqueado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(usuario_id, trofeu_chave),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS campanhas_usuario (
      usuario_id INTEGER NOT NULL,
      fase_chave TEXT NOT NULL,
      venceu INTEGER NOT NULL,
      jogado_em DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY(usuario_id, fase_chave),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS destaques_usuario (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      destaque_chave TEXT NOT NULL,
      tipo TEXT NOT NULL,
      etiqueta TEXT NOT NULL,
      titulo TEXT NOT NULL,
      subtitulo TEXT DEFAULT '',
      descricao TEXT DEFAULT '',
      moedas INTEGER DEFAULT 0,
      xp INTEGER DEFAULT 0,
      meta TEXT DEFAULT '',
      meta_rodape TEXT DEFAULT '',
      icone TEXT DEFAULT '🏆',
      acento_secundario TEXT DEFAULT '',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME,
      UNIQUE(usuario_id, destaque_chave),
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS historico_partidas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      usuario_id INTEGER NOT NULL,
      oponente_nome TEXT NOT NULL,
      gols_usuario INTEGER DEFAULT 0,
      gols_oponente INTEGER DEFAULT 0,
      venceu INTEGER DEFAULT 0,
      tipo TEXT DEFAULT 'campanha',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE
    );
  `);

  console.log("Esquema do banco criado com sucesso.");

  // 1.5 Migração: adicionar coluna posicoes_aprendidas se não existir
  try {
    await dbRun(`ALTER TABLE cartas_usuario ADD COLUMN posicoes_aprendidas TEXT DEFAULT '[]'`);
    console.log("Coluna posicoes_aprendidas adicionada com sucesso.");
  } catch (e) {
    // Coluna já existe, ignorar
  }

  // 1.6 Migração: adicionar coluna cargo se não existir
  try {
    await dbRun(`ALTER TABLE colaboradores ADD COLUMN cargo TEXT DEFAULT ''`);
    console.log("Coluna cargo adicionada com sucesso.");
  } catch (e) {
    // Coluna já existe, ignorar
  }

  // 1.7 Migração: adicionar controle de caixa inicial se não existir
  try {
    await dbRun(`ALTER TABLE usuarios ADD COLUMN caixa_inicial_resgatada INTEGER DEFAULT 0`);
    console.log("Coluna caixa_inicial_resgatada adicionada com sucesso.");
  } catch (e) {
    // Coluna já existe, ignorar
  }

  await dbRun(`
    UPDATE usuarios
    SET caixa_inicial_resgatada = 1
    WHERE id IN (
      SELECT DISTINCT usuario_id
      FROM cartas_usuario
    )
  `);

  // 2. Popular colaboradores (se estiver vazio)
  const countColabs = await dbGet("SELECT COUNT(*) as total FROM colaboradores");
  if (countColabs.total === 0) {
    console.log("Populando tabela de colaboradores inicial...");
    const colaboradores = [
      { nome: "Rafael Morais", setor: "Diretoria", velocidade: 75, chute: 92, defesa: 80, energia: 95, raridade: "Lendário" },
      { nome: "Sergio", setor: "Diretoria", velocidade: 70, chute: 88, defesa: 85, energia: 90, raridade: "Lendário" },
      { nome: "Nathanael", setor: "BI", velocidade: 88, chute: 78, defesa: 65, energia: 85, raridade: "Épico" },
      { nome: "Roberto", setor: "BI", velocidade: 80, chute: 74, defesa: 70, energia: 88, raridade: "Raro" },
      { nome: "Caique Custodio", setor: "NIT", velocidade: 92, chute: 85, defesa: 82, energia: 99, raridade: "Mítico" },
      { nome: "Erika", setor: "Administrativo", velocidade: 68, chute: 72, defesa: 84, energia: 86, raridade: "Raro" },
      { nome: "Aline", setor: "Administrativo", velocidade: 65, chute: 60, defesa: 78, energia: 80, raridade: "Comum" },
      { nome: "João", setor: "Oficina", velocidade: 62, chute: 82, defesa: 88, energia: 90, raridade: "Comum" },
      { nome: "Cleiton", setor: "Oficina", velocidade: 60, chute: 70, defesa: 82, energia: 92, raridade: "Comum" },
      { nome: "Marcos", setor: "Oficina", velocidade: 65, chute: 65, defesa: 80, energia: 85, raridade: "Comum" },
      { nome: "Maria", setor: "Comercial", velocidade: 82, chute: 86, defesa: 60, energia: 88, raridade: "Raro" },
      { nome: "Fernanda", setor: "Comercial", velocidade: 85, chute: 80, defesa: 62, energia: 85, raridade: "Épico" },
      { nome: "Francisco", setor: "Logística", velocidade: 78, chute: 70, defesa: 74, energia: 88, raridade: "Raro" },
      { nome: "Mateus", setor: "Logística", velocidade: 74, chute: 68, defesa: 75, energia: 84, raridade: "Raro" },
      { nome: "Carlos", setor: "RH", velocidade: 70, chute: 71, defesa: 73, energia: 82, raridade: "Raro" }
    ];

    for (const c of colaboradores) {
      await dbRun(`
        INSERT INTO colaboradores (nome, setor, velocidade, chute, defesa, energia, raridade)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [c.nome, c.setor, c.velocidade, c.chute, c.defesa, c.energia, c.raridade]);
    }
  }

  // 3. Popular quizzes (se estiver vazio)
  const countQuizzes = await dbGet("SELECT COUNT(*) as total FROM quizzes");
  if (countQuizzes.total === 0) {
    console.log("Populando tabela de quizzes inicial...");
    const initialQuizzes = [
      {
        categoria: "Empresa",
        pergunta: "Em que ano a Nordeste Locações foi fundada?",
        opcao_a: "1998",
        opcao_b: "2002",
        opcao_c: "2008",
        opcao_d: "2010",
        resposta_correta: "C"
      },
      {
        categoria: "Empresa",
        pergunta: "Qual o foco principal de atuação da Nordeste Locações?",
        opcao_a: "Aluguel de carros de passeio",
        opcao_b: "Locação de equipamentos para trabalho em altura e movimentação de cargas",
        opcao_c: "Venda de imóveis corporativos",
        opcao_d: "Desenvolvimento de jogos de tabuleiro",
        resposta_correta: "B"
      },
      {
        categoria: "Empresa",
        pergunta: "Quantas filiais a Nordeste Locações possui estrategicamente no Nordeste?",
        opcao_a: "Apenas a Matriz em Fortaleza",
        opcao_b: "Atendimento regional com filiais em estados chave como Ceará, Pernambuco, etc.",
        opcao_c: "Nenhuma, opera de forma 100% remota",
        opcao_d: "Parceria internacional fora do Brasil",
        resposta_correta: "B"
      },
      {
        categoria: "Segurança",
        pergunta: "Qual EPI é obrigatório para operador de plataforma aérea de trabalho em altura?",
        opcao_a: "Cinto de segurança tipo paraquedista ancorado no ponto oficial da cesta",
        opcao_b: "Apenas sapatos sem isolamento ou EPI básico",
        opcao_c: "Nenhum, pois a cesta já oferece proteção total",
        opcao_d: "Uso opcional apenas de fones de ouvido",
        resposta_correta: "A"
      },
      {
        categoria: "Segurança",
        pergunta: "O que deve ser feito antes de operar qualquer plataforma elevatória de trabalho?",
        opcao_a: "Ligar direto e acelerar no máximo",
        opcao_b: "Fazer a inspeção diária (Checklist de Pré-uso) visual e funcional",
        opcao_c: "Ignorar os manuais e operar de chinelo de dedo",
        opcao_d: "Apenas torcer para dar tudo certo",
        resposta_correta: "B"
      },
      {
        categoria: "Segurança",
        pergunta: "Qual norma regulamentadora (NR) nacional rege o trabalho em altura?",
        opcao_a: "NR-10 (Eletricidade)",
        opcao_b: "NR-35 (Trabalho em Altura)",
        opcao_c: "NR-12 (Máquinas e Equipamentos)",
        opcao_d: "NR-17 (Ergonomia)",
        resposta_correta: "B"
      },
      {
        categoria: "Operacional",
        pergunta: "Qual a função principal de uma plataforma elevatória do tipo Articulada?",
        opcao_a: "Subir exclusivamente de forma vertical sem ângulo",
        opcao_b: "Alcançar pontos altos passando por cima de obstáculos (curvas e relevos)",
        opcao_c: "Apenas carregar paletes pesados no chão",
        opcao_d: "Realizar misturas de cimento na obra",
        resposta_correta: "B"
      },
      {
        categoria: "Operacional",
        pergunta: "Qual o tipo de terreno ideal para o uso de plataformas tipo Tesoura (Scy) Elétricas?",
        opcao_a: "Pisos planos, firmes e nivelados, preferencialmente internos",
        opcao_b: "Areia fofa da praia",
        opcao_c: "Lamaçal inclinado",
        opcao_d: "Gramados acidentados em florestas",
        resposta_correta: "A"
      },
      {
        categoria: "Operacional",
        pergunta: "Para o que serve o botão vermelho de emergência presente nas plataformas elevatórias?",
        opcao_a: "Aumentar a velocidade do equipamento",
        opcao_b: "Desligar imediatamente todas as funções do equipamento em caso de perigo",
        opcao_c: "Ligar o rádio do operador",
        opcao_d: "Resetar o placar da Copa Nordeste",
        resposta_correta: "B"
      },
      {
        categoria: "Setores",
        pergunta: "Qual setor realiza a manutenção preventiva rigorosa das máquinas locadas?",
        opcao_a: "Comercial",
        opcao_b: "Oficina e Manutenção",
        opcao_c: "RH",
        opcao_d: "Faturamento",
        resposta_correta: "B"
      },
      {
        categoria: "Setores",
        pergunta: "Qual é o canal ideal para o colaborador abrir chamados técnicos de TI com o NIT?",
        opcao_a: "Sistema de chamados específico desenvolvido pelo NIT",
        opcao_b: "Mandar um bilhete escrito",
        opcao_c: "Ligar para a recepção e pedir para anotarem",
        opcao_d: "Postar nas redes sociais pessoais",
        resposta_correta: "A"
      },
      {
        categoria: "Setores",
        pergunta: "Qual a responsabilidade principal do setor Comercial na Nordeste Locações?",
        opcao_a: "Dimensionar a melhor máquina para a obra do cliente e estruturar a locação",
        opcao_b: "Efetuar a limpeza de motores pesados",
        opcao_c: "Processar admissão de novos colaboradores",
        opcao_d: "Realizar o transporte físico com pranchas de transporte",
        resposta_correta: "A"
      }
    ];

    for (const q of initialQuizzes) {
      await dbRun(`
        INSERT INTO quizzes (categoria, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [q.categoria, q.pergunta, q.opcao_a, q.opcao_b, q.opcao_c, q.opcao_d, q.resposta_correta]);
    }
  }

  console.log("Banco de dados populado com sucesso.");
}
