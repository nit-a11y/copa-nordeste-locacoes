import { dbRun, dbGet } from './connection.js';

const NOVOS_QUIZZES = [
  // ── EMPRESA ────────────────────────────────────────
  {
    categoria: "Empresa",
    pergunta: "Em que ano a Nordeste Locações foi fundada?",
    opcao_a: "2008", opcao_b: "2011", opcao_c: "2015", opcao_d: "2018",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Quantas unidades a Nordeste Locações possui atualmente?",
    opcao_a: "2 unidades", opcao_b: "3 unidades", opcao_c: "4 unidades", opcao_d: "5 unidades",
    resposta_correta: "C"
  },
  {
    categoria: "Empresa",
    pergunta: "Em quantos estados a Nordeste Locações está presente?",
    opcao_a: "1 estado", opcao_b: "2 estados (CE e MA)", opcao_c: "3 estados", opcao_d: "4 estados",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual é a missão da Nordeste Locações?",
    opcao_a: "Ser a maior locadora do Brasil",
    opcao_b: "Alugar máquinas com o menor preço",
    opcao_c: "Impactar positivamente o dia daqueles que se relacionam conosco",
    opcao_d: "Vender equipamentos para construção",
    resposta_correta: "C"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual é a visão da Nordeste Locações?",
    opcao_a: "Expandir para todo o Brasil em 5 anos",
    opcao_b: "Ser o principal parceiro em locação de equipamentos, transformando máquinas em produtividade",
    opcao_c: "Fabricar seus próprios equipamentos",
    opcao_d: "Atuar apenas no mercado imobiliário",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Quantos equipamentos a Nordeste Locações possui para locação?",
    opcao_a: "Mais de 1.000", opcao_b: "Mais de 3.000", opcao_c: "Mais de 4.000", opcao_d: "Mais de 6.000",
    resposta_correta: "D"
  },
  {
    categoria: "Empresa",
    pergunta: "Quantos profissionais atuam na Nordeste Locações?",
    opcao_a: "Mais de 50", opcao_b: "Mais de 100", opcao_c: "Mais de 200", opcao_d: "Mais de 500",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual destes NÃO é um valor da Nordeste Locações?",
    opcao_a: "Fazemos o que é certo",
    opcao_b: "Gente faz a diferença",
    opcao_c: "Não há hierarquia para boas ideias",
    opcao_d: "Lucro acima de tudo",
    resposta_correta: "D"
  },
  {
    categoria: "Empresa",
    pergunta: "O valor 'Gente faz a diferença' significa que:",
    opcao_a: "Equipamentos são mais importantes que pessoas",
    opcao_b: "Pessoas são o principal diferencial da empresa",
    opcao_c: "Apenas líderes importam",
    opcao_d: "Clientes não participam do processo",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual o significado de 'Ser protagonista para crescer'?",
    opcao_a: "Esperar decisões dos gestores",
    opcao_b: "Assumir responsabilidades e agir com iniciativa",
    opcao_c: "Trabalhar sozinho sem colaboração",
    opcao_d: "Evitar mudanças e riscos",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual destes é um diferencial da Nordeste Locações?",
    opcao_a: "Não realiza manutenção nos equipamentos",
    opcao_b: "Atendimento especializado e consultivo",
    opcao_c: "Equipamentos usados exclusivamente",
    opcao_d: "Atendimento apenas remoto",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Quantos clientes ativos a Nordeste Locações possui?",
    opcao_a: "Mais de 1.000", opcao_b: "Mais de 5.000", opcao_c: "Mais de 10.000", opcao_d: "Mais de 50.000",
    resposta_correta: "C"
  },
  {
    categoria: "Empresa",
    pergunta: "Em que ano a empresa completa 14 anos de mercado?",
    opcao_a: "2023", opcao_b: "2024", opcao_c: "2025", opcao_d: "2026",
    resposta_correta: "C"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual bairro da unidade de Fortaleza da Nordeste Locações?",
    opcao_a: "Aldeota", opcao_b: "Barroso", opcao_c: "Meireles", opcao_d: "Parangaba",
    resposta_correta: "B"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual o CEP da unidade do Eusébio?",
    opcao_a: "61769-220", opcao_b: "60862-730", opcao_c: "63040-035", opcao_d: "65010-120",
    resposta_correta: "A"
  },
  // ── SEGURANÇA ──────────────────────────────────────
  {
    categoria: "Segurança",
    pergunta: "O que significa a sigla EPI?",
    opcao_a: "Equipamento de Proteção Individual",
    opcao_b: "Equipamento de Produção Industrial",
    opcao_c: "Equipamento de Proteção Integrada",
    opcao_d: "Equipamento Padrão Industrial",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "Qual destes é considerado um EPI?",
    opcao_a: "Capacete de segurança", opcao_b: "Andaime", opcao_c: "Escada", opcao_d: "Gerador",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "Antes de utilizar um equipamento, o operador deve:",
    opcao_a: "Ligar imediatamente e acelerar",
    opcao_b: "Fazer inspeção visual e verificar condições de uso",
    opcao_c: "Pedir autorização verbal aos colegas",
    opcao_d: "Trocar o combustível primeiro",
    resposta_correta: "B"
  },
  {
    categoria: "Segurança",
    pergunta: "Ao identificar um defeito no equipamento, o colaborador deve:",
    opcao_a: "Continuar trabalhando normalmente",
    opcao_b: "Ignorar o problema",
    opcao_c: "Comunicar imediatamente ao responsável",
    opcao_d: "Tentar consertar sozinho",
    resposta_correta: "C"
  },
  {
    categoria: "Segurança",
    pergunta: "Qual a principal finalidade do capacete de segurança?",
    opcao_a: "Melhorar a aparência do colaborador",
    opcao_b: "Identificar o setor de trabalho",
    opcao_c: "Proteger contra impactos e quedas de objetos",
    opcao_d: "Evitar sujeira no cabelo",
    resposta_correta: "C"
  },
  {
    categoria: "Segurança",
    pergunta: "O EPI tem a função de proteger:",
    opcao_a: "A máquina", opcao_b: "A obra", opcao_c: "A pessoa", opcao_d: "A ferramenta",
    resposta_correta: "C"
  },
  {
    categoria: "Segurança",
    pergunta: "Um capacete sem jugular (cinta de queixo) deve ser usado?",
    opcao_a: "Sim, é opcional", opcao_b: "Não, pois pode cair durante o trabalho",
    opcao_c: "Apenas em escritório", opcao_d: "Apenas em trabalho em altura",
    resposta_correta: "B"
  },
  {
    categoria: "Segurança",
    pergunta: "Um equipamento apresentando vazamento deve:",
    opcao_a: "Continuar operando normalmente",
    opcao_b: "Ser lavado para limpar o vazamento",
    opcao_c: "Ser retirado de operação e avaliado pela manutenção",
    opcao_d: "Receber uma camada de tinta",
    resposta_correta: "C"
  },
  {
    categoria: "Segurança",
    pergunta: "A segurança no trabalho é responsabilidade de:",
    opcao_a: "Apenas do técnico de segurança",
    opcao_b: "Apenas do gestor da área",
    opcao_c: "Apenas do RH",
    opcao_d: "Todos os colaboradores",
    resposta_correta: "D"
  },
  {
    categoria: "Segurança",
    pergunta: "Qual NR regulamenta o trabalho em altura?",
    opcao_a: "NR-10", opcao_b: "NR-35", opcao_c: "NR-12", opcao_d: "NR-17",
    resposta_correta: "B"
  },
  {
    categoria: "Segurança",
    pergunta: "O cinto de segurança tipo paraquedista é obrigatório em:",
    opcao_a: "Trabalho administrativo",
    opcao_b: "Operação de plataforma aérea em altura",
    opcao_c: "Direção de veículos",
    opcao_d: "Operação de betoneira",
    resposta_correta: "B"
  },
  {
    categoria: "Segurança",
    pergunta: "O que deve ser verificado no checklist diário de uma plataforma elevatória?",
    opcao_a: "Apenas o nível de combustível",
    opcao_b: "Condições dos pneus, buzina, luzes, comandos e cabos",
    opcao_c: "Apenas a cor da máquina",
    opcao_d: "Nada, pode operar direto",
    resposta_correta: "B"
  },
  // ── OPERACIONAL ─────────────────────────────────────
  {
    categoria: "Operacional",
    pergunta: "O que é manutenção preventiva?",
    opcao_a: "Conserto após a quebra do equipamento",
    opcao_b: "Troca de equipamentos antigos por novos",
    opcao_c: "Ações planejadas antes da falha ocorrer",
    opcao_d: "Limpeza básica da obra",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual a principal vantagem da manutenção preventiva?",
    opcao_a: "Aumenta as paradas inesperadas",
    opcao_b: "Reduz a vida útil do equipamento",
    opcao_c: "Evita falhas e aumenta a produtividade",
    opcao_d: "Aumenta o consumo de combustível",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "O que caracteriza uma manutenção corretiva?",
    opcao_a: "Inspeção programada semanalmente",
    opcao_b: "Troca preventiva de peças por tempo de uso",
    opcao_c: "Reparação realizada após a ocorrência da falha",
    opcao_d: "Lubrificação periódica dos componentes",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "A falta de lubrificação adequada pode causar:",
    opcao_a: "Menor desgaste das peças",
    opcao_b: "Superaquecimento e danos mecânicos",
    opcao_c: "Economia de combustível",
    opcao_d: "Melhor desempenho do motor",
    resposta_correta: "B"
  },
  {
    categoria: "Operacional",
    pergunta: "Quem deve operar os equipamentos locados?",
    opcao_a: "Qualquer pessoa disponível na obra",
    opcao_b: "Apenas visitantes autorizados",
    opcao_c: "Pessoas treinadas, capacitadas e autorizadas",
    opcao_d: "Apenas gestores e supervisores",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "Para que serve um compactador de solo?",
    opcao_a: "Misturar concreto", opcao_b: "Cortar pisos cerâmicos",
    opcao_c: "Compactar terrenos e bases para construção", opcao_d: "Levantar cargas pesadas",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual equipamento é usado para concretagem em locais elevados?",
    opcao_a: "Betoneira", opcao_b: "Mangote vibrador",
    opcao_c: "Bomba de concreto", opcao_d: "Martelete perfurador",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "O martelete é utilizado principalmente para:",
    opcao_a: "Pintura de paredes", opcao_b: "Demolição e perfuração",
    opcao_c: "Compactação de solo", opcao_d: "Soldagem de estruturas",
    resposta_correta: "B"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual a função do vibrador de concreto?",
    opcao_a: "Secar o concreto mais rápido",
    opcao_b: "Misturar areia e brita",
    opcao_c: "Eliminar bolhas de ar e melhorar o adensamento",
    opcao_d: "Medir a resistência do concreto",
    resposta_correta: "C"
  },
  {
    categoria: "Operacional",
    pergunta: "A betoneira é utilizada para:",
    opcao_a: "Compactar solo", opcao_b: "Misturar concreto e argamassa",
    opcao_c: "Transportar areia", opcao_d: "Cortar pisos e azulejos",
    resposta_correta: "B"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual a função principal de uma plataforma elevatória articulada?",
    opcao_a: "Subir exclusivamente na vertical",
    opcao_b: "Alcançar pontos altos passando por cima de obstáculos",
    opcao_c: "Carregar paletes no chão",
    opcao_d: "Misturar materiais de construção",
    resposta_correta: "B"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual o terreno ideal para plataformas tipo Tesoura (Scissor) elétricas?",
    opcao_a: "Areia fofa de praia", opcao_b: "Pisos planos, firmes e nivelados",
    opcao_c: "Lamaçal inclinado", opcao_d: "Gramados acidentados",
    resposta_correta: "B"
  },
  {
    categoria: "Operacional",
    pergunta: "Para que serve o botão vermelho de emergência nas plataformas elevatórias?",
    opcao_a: "Aumentar a velocidade do equipamento",
    opcao_b: "Desligar imediatamente todas as funções em caso de perigo",
    opcao_c: "Ligar o rádio do operador",
    opcao_d: "Resetar o sistema hidráulico",
    resposta_correta: "B"
  },
  // ── SETORES ─────────────────────────────────────────
  {
    categoria: "Setores",
    pergunta: "Qual setor realiza a manutenção preventiva das máquinas locadas?",
    opcao_a: "Comercial", opcao_b: "Oficina e Manutenção",
    opcao_c: "RH", opcao_d: "Financeiro",
    resposta_correta: "B"
  },
  {
    categoria: "Setores",
    pergunta: "Qual canal usar para abrir chamados técnicos de TI?",
    opcao_a: "Sistema de chamados do NIT",
    opcao_b: "Mandar um bilhete escrito",
    opcao_c: "Ligar para a recepção",
    opcao_d: "Postar nas redes sociais",
    resposta_correta: "A"
  },
  {
    categoria: "Setores",
    pergunta: "Qual a responsabilidade principal do setor Comercial?",
    opcao_a: "Dimensionar a melhor máquina para a obra e estruturar a locação",
    opcao_b: "Efetuar a limpeza de motores",
    opcao_c: "Processar admissão de novos colaboradores",
    opcao_d: "Realizar transporte físico com pranchas",
    resposta_correta: "A"
  },
  {
    categoria: "Setores",
    pergunta: "Qual setor cuida do almoxarifado e peças de reposição?",
    opcao_a: "Comercial", opcao_b: "Almoxarifado", opcao_c: "NIT", opcao_d: "Marketing",
    resposta_correta: "B"
  },
  {
    categoria: "Setores",
    pergunta: "Qual setor é responsável pela gestão de pessoas e RH?",
    opcao_a: "Financeiro", opcao_b: "Gente e Gestão", opcao_c: "Logística", opcao_d: "Compras",
    resposta_correta: "B"
  },
  {
    categoria: "Setores",
    pergunta: "Qual setor cuida do faturamento e contas a pagar/receber?",
    opcao_a: "Financeiro", opcao_b: "Manutenção", opcao_c: "Marketing", opcao_d: "NIT",
    resposta_correta: "A"
  },
  {
    categoria: "Setores",
    pergunta: "Qual setor é responsável pela inteligência e tecnologia?",
    opcao_a: "RH", opcao_b: "NIT", opcao_c: "Comercial", opcao_d: "Logística",
    resposta_correta: "B"
  },
  {
    categoria: "Setores",
    pergunta: "Qual setor gerencia as compras de materiais e insumos?",
    opcao_a: "Compras", opcao_b: "Vendas", opcao_c: "Oficina", opcao_d: "Almoxarifado",
    resposta_correta: "A"
  },
  {
    categoria: "Setores",
    pergunta: "Qual unidade fica no estado do Maranhão?",
    opcao_a: "Fortaleza", opcao_b: "Eusébio", opcao_c: "São Luís", opcao_d: "Juazeiro do Norte",
    resposta_correta: "C"
  },
  {
    categoria: "Setores",
    pergunta: "Qual a unidade mais recente da Nordeste Locações?",
    opcao_a: "Fortaleza", opcao_b: "Eusébio", opcao_c: "São Luís", opcao_d: "Juazeiro do Norte",
    resposta_correta: "B"
  },
  {
    categoria: "Setores",
    pergunta: "Qual o ramo de atuação da Nordeste Locações?",
    opcao_a: "Venda de veículos", opcao_b: "Locação de máquinas e equipamentos para construção civil",
    opcao_c: "Consultoria financeira", opcao_d: "Desenvolvimento de software",
    resposta_correta: "B"
  },
  // ── NOVAS QUESTOES INSTITUCIONAIS ──────────────────
  {
    categoria: "Empresa",
    pergunta: "Qual frase representa melhor a atuação da Nordeste Locações?",
    opcao_a: "Transformar máquinas em produtividade", opcao_b: "Comprar terrenos urbanos", opcao_c: "Vender veículos pesados", opcao_d: "Fabricar cimento",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual característica faz parte do atendimento da Nordeste Locações?",
    opcao_a: "Atendimento regional consultivo e personalizado", opcao_b: "Atendimento apenas por aplicativo", opcao_c: "Atendimento somente para grandes empresas", opcao_d: "Atendimento sem orientação técnica",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual destes é um diferencial citado pela Nordeste Locações?",
    opcao_a: "Manutenção na obra", opcao_b: "Venda de apartamentos", opcao_c: "Produção de concreto", opcao_d: "Curso de engenharia",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual outro diferencial da Nordeste Locações está ligado à escolha correta do equipamento?",
    opcao_a: "Orientação técnica", opcao_b: "Sorte na operação", opcao_c: "Atendimento sem contrato", opcao_d: "Improviso na obra",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual benefício a locação de equipamentos pode trazer para a obra?",
    opcao_a: "Redução de custos com logística", opcao_b: "Aumento de máquinas paradas", opcao_c: "Menor controle da operação", opcao_d: "Mais desperdício de tempo",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "A Nordeste Locações trabalha com quais marcas?",
    opcao_a: "As melhores marcas do mercado", opcao_b: "Apenas marcas desconhecidas", opcao_c: "Apenas marcas próprias", opcao_d: "Apenas equipamentos usados",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "O que a empresa busca oferecer aos clientes?",
    opcao_a: "Qualidade e preço", opcao_b: "Apenas preço baixo", opcao_c: "Apenas equipamentos antigos", opcao_d: "Apenas atendimento remoto",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual fator contribui para o fortalecimento da marca Nordeste?",
    opcao_a: "Empenho da equipe em prol da marca", opcao_b: "Falta de manutenção", opcao_c: "Ausência de atendimento", opcao_d: "Equipamentos sem revisão",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual opção representa melhor a equipe técnica da Nordeste?",
    opcao_a: "Cuidadosa e dedicada", opcao_b: "Improvisada e desorganizada", opcao_c: "Sem treinamento", opcao_d: "Sem acompanhamento",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Segundo o texto institucional, a empresa está em constante processo de:",
    opcao_a: "Aperfeiçoamento", opcao_b: "Encerramento", opcao_c: "Terceirização total", opcao_d: "Redução de atendimento",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "A Nordeste alia inovação à:",
    opcao_a: "Experiência", opcao_b: "Improviso", opcao_c: "Desorganização", opcao_d: "Atendimento limitado",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual destes públicos faz parte dos clientes da Nordeste?",
    opcao_a: "Empresas pessoas físicas e incorporadores", opcao_b: "Apenas órgãos públicos", opcao_c: "Apenas estudantes", opcao_d: "Apenas supermercados",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual unidade está localizada no bairro Lagoa Seca?",
    opcao_a: "Juazeiro do Norte", opcao_b: "Fortaleza", opcao_c: "Eusébio", opcao_d: "São Luís",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual unidade está localizada no bairro Tirirical?",
    opcao_a: "São Luís", opcao_b: "Fortaleza", opcao_c: "Eusébio", opcao_d: "Juazeiro do Norte",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual unidade está localizada no bairro Amador?",
    opcao_a: "Eusébio", opcao_b: "Fortaleza", opcao_c: "São Luís", opcao_d: "Juazeiro do Norte",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual cidade possui a unidade da Rua Francisco Oliveira de Almeida?",
    opcao_a: "Eusébio", opcao_b: "Fortaleza", opcao_c: "São Luís", opcao_d: "Juazeiro do Norte",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual cidade possui a unidade da Rua Tabelião Luiz Teófilo Machado?",
    opcao_a: "Juazeiro do Norte", opcao_b: "Fortaleza", opcao_c: "Eusébio", opcao_d: "São Luís",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual cidade possui a unidade da Travessa São Luís?",
    opcao_a: "São Luís", opcao_b: "Fortaleza", opcao_c: "Eusébio", opcao_d: "Juazeiro do Norte",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual estado possui a unidade de Juazeiro do Norte?",
    opcao_a: "Ceará", opcao_b: "Maranhão", opcao_c: "Piauí", opcao_d: "Pernambuco",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual estado possui a unidade de São Luís?",
    opcao_a: "Maranhão", opcao_b: "Ceará", opcao_c: "Bahia", opcao_d: "Paraíba",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual das opções abaixo representa uma unidade da Nordeste?",
    opcao_a: "Fortaleza", opcao_b: "Recife", opcao_c: "Natal", opcao_d: "Teresina",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual das opções abaixo representa uma unidade da Nordeste?",
    opcao_a: "Eusébio", opcao_b: "Salvador", opcao_c: "João Pessoa", opcao_d: "Parnaíba",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual das opções abaixo representa uma unidade da Nordeste?",
    opcao_a: "Juazeiro do Norte", opcao_b: "Mossoró", opcao_c: "Aracaju", opcao_d: "Maceió",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual das opções abaixo representa uma unidade da Nordeste?",
    opcao_a: "São Luís", opcao_b: "Imperatriz", opcao_c: "Timon", opcao_d: "Caxias",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "O que a Nordeste busca impulsionar nas obras dos clientes?",
    opcao_a: "Produtividade", opcao_b: "Atrasos", opcao_c: "Paradas", opcao_d: "Falhas",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual frase combina com o valor 'Fazemos o que é certo'?",
    opcao_a: "Agir com ética e responsabilidade", opcao_b: "Esconder problemas", opcao_c: "Ignorar normas", opcao_d: "Atender de qualquer jeito",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual atitude combina com 'Nos divertimos enquanto trabalhamos'?",
    opcao_a: "Manter um ambiente leve e colaborativo", opcao_b: "Brincar ignorando segurança", opcao_c: "Evitar responsabilidades", opcao_d: "Parar a operação",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual atitude representa 'Não há hierarquia para boas ideias'?",
    opcao_a: "Qualquer colaborador pode sugerir melhorias", opcao_b: "Apenas diretores podem opinar", opcao_c: "Ideias devem ser evitadas", opcao_d: "Sugestões não são importantes",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "O que significa atendimento com vontade genuína de ajudar?",
    opcao_a: "Buscar entender e resolver a necessidade do cliente", opcao_b: "Atender com pressa", opcao_c: "Ignorar dúvidas", opcao_d: "Vender qualquer equipamento",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual atitude demonstra protagonismo na empresa?",
    opcao_a: "Identificar problemas e propor soluções", opcao_b: "Esperar sempre ordens", opcao_c: "Evitar responsabilidades", opcao_d: "Reclamar sem agir",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "O que a qualidade dos equipamentos ajuda a garantir?",
    opcao_a: "Mais segurança e produtividade na obra", opcao_b: "Mais falhas na operação", opcao_c: "Mais atrasos no cliente", opcao_d: "Menos confiança",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual opção melhor representa o serviço diferenciado da Nordeste?",
    opcao_a: "Acompanhamento da obra com manutenção preventiva e corretiva", opcao_b: "Apenas entrega do equipamento sem suporte", opcao_c: "Apenas venda de peças", opcao_d: "Apenas retirada sem orientação",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Por que a manutenção preventiva é importante para o cliente?",
    opcao_a: "Ajuda a evitar paradas inesperadas na obra", opcao_b: "Aumenta o risco de falha", opcao_c: "Reduz a vida útil do equipamento", opcao_d: "Impede o uso correto",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual é um resultado esperado de equipamentos modernos?",
    opcao_a: "Mais eficiência na execução da obra", opcao_b: "Mais retrabalho", opcao_c: "Mais improviso", opcao_d: "Mais acidentes",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual setor interno tem relação direta com tecnologia e melhoria de processos?",
    opcao_a: "NIT", opcao_b: "Oficina", opcao_c: "Logística", opcao_d: "Comercial",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual atitude ajuda no aperfeiçoamento constante da empresa?",
    opcao_a: "Sugerir melhorias e colaborar com processos", opcao_b: "Ignorar falhas", opcao_c: "Evitar comunicação", opcao_d: "Trabalhar sem padrão",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual é a melhor opção para clientes que buscam serviço diferenciado?",
    opcao_a: "Nordeste Locações", opcao_b: "Concorrência sem suporte", opcao_c: "Equipamento sem manutenção", opcao_d: "Locação sem orientação",
    resposta_correta: "A"
  },
  {
    categoria: "Empresa",
    pergunta: "Qual frase resume bem a marca Nordeste Locações?",
    opcao_a: "A qualidade que o mercado reconhece", opcao_b: "A loja que vende imóveis", opcao_c: "A fábrica de equipamentos", opcao_d: "A transportadora de cargas",
    resposta_correta: "A"
  },
  // ── MAIS QUESTOES POR SETOR ────────────────────────
  {
    categoria: "Segurança",
    pergunta: "Qual atitude deve ser tomada ao identificar risco de acidente na área de trabalho?",
    opcao_a: "Comunicar imediatamente e sinalizar o local", opcao_b: "Ignorar se ninguém reclamou", opcao_c: "Continuar trabalhando normalmente", opcao_d: "Esperar o fim do expediente",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "O uso correto dos EPIs é responsabilidade de quem?",
    opcao_a: "Todos os colaboradores", opcao_b: "Apenas do Técnico de Segurança", opcao_c: "Apenas do gestor", opcao_d: "Apenas do RH",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "Qual o principal objetivo de um DDS (Diálogo Diário de Segurança)?",
    opcao_a: "Reforçar práticas seguras antes das atividades", opcao_b: "Controlar ponto dos funcionários", opcao_c: "Definir salários", opcao_d: "Organizar férias",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "Ao perceber um colega trabalhando sem EPI o correto é?",
    opcao_a: "Orientar e comunicar o responsável", opcao_b: "Rir da situação", opcao_c: "Ignorar", opcao_d: "Fotografar e postar em grupos",
    resposta_correta: "A"
  },
  {
    categoria: "Segurança",
    pergunta: "Uma área isolada com fita de segurança significa?",
    opcao_a: "Acesso controlado devido a risco", opcao_b: "Acesso liberado", opcao_c: "Apenas área de descanso", opcao_d: "Local para armazenar EPIs",
    resposta_correta: "A"
  },
  {
    categoria: "Operacional",
    pergunta: "Antes de entregar um equipamento ao cliente deve ser realizado?",
    opcao_a: "Checklist de inspeção", opcao_b: "Somente lavagem", opcao_c: "Apenas abastecimento", opcao_d: "Apenas emissão da nota",
    resposta_correta: "A"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual a principal função do operador durante o uso do equipamento?",
    opcao_a: "Operar conforme treinamento e procedimentos", opcao_b: "Trabalhar em velocidade máxima", opcao_c: "Ignorar limites do equipamento", opcao_d: "Fazer adaptações não autorizadas",
    resposta_correta: "A"
  },
  {
    categoria: "Operacional",
    pergunta: "Em caso de comportamento anormal da máquina o operador deve?",
    opcao_a: "Parar a operação e comunicar a manutenção", opcao_b: "Continuar usando até quebrar", opcao_c: "Aumentar a velocidade", opcao_d: "Ignorar os sinais",
    resposta_correta: "A"
  },
  {
    categoria: "Operacional",
    pergunta: "O manual do equipamento deve ser utilizado para?",
    opcao_a: "Consultar orientações de operação e segurança", opcao_b: "Anotar recados", opcao_c: "Fazer orçamento", opcao_d: "Controlar estoque",
    resposta_correta: "A"
  },
  {
    categoria: "Operacional",
    pergunta: "Qual prática ajuda a aumentar a vida útil dos equipamentos?",
    opcao_a: "Operação correta e inspeções frequentes", opcao_b: "Trabalho acima da capacidade", opcao_c: "Falta de limpeza", opcao_d: "Ignorar manutenção",
    resposta_correta: "A"
  },
  {
    categoria: "Manutenção",
    pergunta: "Qual setor é responsável por diagnosticar falhas mecânicas?",
    opcao_a: "Oficina e Manutenção", opcao_b: "Financeiro", opcao_c: "RH", opcao_d: "Marketing",
    resposta_correta: "A"
  },
  {
    categoria: "Manutenção",
    pergunta: "O que deve ser feito após uma manutenção corretiva?",
    opcao_a: "Testar o equipamento antes de liberar", opcao_b: "Enviar direto ao cliente", opcao_c: "Guardar no estoque", opcao_d: "Desmontar novamente",
    resposta_correta: "A"
  },
  {
    categoria: "Manutenção",
    pergunta: "A inspeção periódica ajuda a?",
    opcao_a: "Identificar problemas antes que se agravem", opcao_b: "Aumentar falhas", opcao_c: "Reduzir segurança", opcao_d: "Aumentar custos operacionais",
    resposta_correta: "A"
  },
  {
    categoria: "Manutenção",
    pergunta: "Peças desgastadas devem ser?",
    opcao_a: "Substituídas conforme necessidade", opcao_b: "Ignoradas", opcao_c: "Reaproveitadas sempre", opcao_d: "Pintadas",
    resposta_correta: "A"
  },
  {
    categoria: "Manutenção",
    pergunta: "Qual prática reduz paradas inesperadas?",
    opcao_a: "Manutenção preventiva", opcao_b: "Improvisação", opcao_c: "Falta de inspeção", opcao_d: "Uso excessivo",
    resposta_correta: "A"
  },
  {
    categoria: "Logística",
    pergunta: "Qual o objetivo principal da logística?",
    opcao_a: "Garantir entrega e retirada eficiente dos equipamentos", opcao_b: "Contratar funcionários", opcao_c: "Fazer manutenção", opcao_d: "Emitir boletos",
    resposta_correta: "A"
  },
  {
    categoria: "Logística",
    pergunta: "Antes de transportar uma máquina deve-se verificar?",
    opcao_a: "Fixação e segurança da carga", opcao_b: "Apenas combustível", opcao_c: "Apenas pneus", opcao_d: "Apenas documentação",
    resposta_correta: "A"
  },
  {
    categoria: "Logística",
    pergunta: "Uma entrega realizada dentro do prazo contribui para?",
    opcao_a: "Satisfação do cliente", opcao_b: "Aumento de reclamações", opcao_c: "Perda de contratos", opcao_d: "Atrasos na obra",
    resposta_correta: "A"
  },
  {
    categoria: "Logística",
    pergunta: "O planejamento de rotas ajuda a?",
    opcao_a: "Reduzir tempo e custos de deslocamento", opcao_b: "Aumentar consumo de combustível", opcao_c: "Criar atrasos", opcao_d: "Reduzir produtividade",
    resposta_correta: "A"
  },
  {
    categoria: "Logística",
    pergunta: "Quem deve informar ocorrências durante o transporte?",
    opcao_a: "Motorista ou responsável pela entrega", opcao_b: "Apenas o cliente", opcao_c: "Ninguém", opcao_d: "Apenas o financeiro",
    resposta_correta: "A"
  },
  {
    categoria: "Comercial",
    pergunta: "Qual é o principal objetivo do setor Comercial?",
    opcao_a: "Atender clientes e gerar locações", opcao_b: "Consertar equipamentos", opcao_c: "Fazer admissões", opcao_d: "Controlar estoque",
    resposta_correta: "A"
  },
  {
    categoria: "Comercial",
    pergunta: "O atendimento consultivo busca?",
    opcao_a: "Entender a necessidade do cliente", opcao_b: "Vender o equipamento mais caro", opcao_c: "Fazer vendas rápidas", opcao_d: "Ignorar detalhes da obra",
    resposta_correta: "A"
  },
  {
    categoria: "Comercial",
    pergunta: "Antes de indicar um equipamento deve-se entender?",
    opcao_a: "A necessidade da obra", opcao_b: "O horário de almoço", opcao_c: "O clima da cidade", opcao_d: "A idade do cliente",
    resposta_correta: "A"
  },
  {
    categoria: "Comercial",
    pergunta: "Um bom atendimento aumenta?",
    opcao_a: "A fidelização dos clientes", opcao_b: "As reclamações", opcao_c: "Os atrasos", opcao_d: "A inadimplência",
    resposta_correta: "A"
  },
  {
    categoria: "Comercial",
    pergunta: "O relacionamento com clientes deve ser?",
    opcao_a: "Profissional e transparente", opcao_b: "Distante", opcao_c: "Impessoal", opcao_d: "Limitado",
    resposta_correta: "A"
  },
  {
    categoria: "Almoxarifado",
    pergunta: "Qual a função principal do almoxarifado?",
    opcao_a: "Controlar peças e materiais", opcao_b: "Atender clientes", opcao_c: "Fazer manutenção", opcao_d: "Emitir notas fiscais",
    resposta_correta: "A"
  },
  {
    categoria: "Almoxarifado",
    pergunta: "O controle de estoque ajuda a?",
    opcao_a: "Evitar falta de peças", opcao_b: "Aumentar desperdícios", opcao_c: "Gerar atrasos", opcao_d: "Reduzir organização",
    resposta_correta: "A"
  },
  {
    categoria: "Almoxarifado",
    pergunta: "Peças retiradas do estoque devem ser?",
    opcao_a: "Registradas corretamente", opcao_b: "Ignoradas", opcao_c: "Descartadas", opcao_d: "Anotadas apenas em papel",
    resposta_correta: "A"
  },
  {
    categoria: "Almoxarifado",
    pergunta: "Qual prática melhora a organização do estoque?",
    opcao_a: "Identificação adequada dos itens", opcao_b: "Guardar sem critério", opcao_c: "Misturar materiais", opcao_d: "Ignorar inventários",
    resposta_correta: "A"
  },
  {
    categoria: "Almoxarifado",
    pergunta: "O inventário serve para?",
    opcao_a: "Conferir quantidades e controlar materiais", opcao_b: "Aumentar compras sem necessidade", opcao_c: "Fazer manutenção", opcao_d: "Controlar ponto",
    resposta_correta: "A"
  },
  {
    categoria: "NIT",
    pergunta: "Qual o principal objetivo do NIT?",
    opcao_a: "Promover inovação e tecnologia nos processos", opcao_b: "Realizar manutenção mecânica", opcao_c: "Fazer transporte", opcao_d: "Controlar estoque",
    resposta_correta: "A"
  },
  {
    categoria: "NIT",
    pergunta: "Um sistema desenvolvido pelo NIT deve contribuir para?",
    opcao_a: "Maior eficiência operacional", opcao_b: "Aumento da burocracia", opcao_c: "Redução da produtividade", opcao_d: "Mais papeladas",
    resposta_correta: "A"
  },
  {
    categoria: "NIT",
    pergunta: "Ao identificar uma oportunidade de automação o colaborador deve?",
    opcao_a: "Compartilhar a ideia com o NIT", opcao_b: "Ignorar", opcao_c: "Esperar alguém pedir", opcao_d: "Guardar para si",
    resposta_correta: "A"
  },
  {
    categoria: "NIT",
    pergunta: "Qual benefício da digitalização de processos?",
    opcao_a: "Mais controle e agilidade", opcao_b: "Mais retrabalho", opcao_c: "Mais erros", opcao_d: "Menos informações",
    resposta_correta: "A"
  },
  {
    categoria: "NIT",
    pergunta: "Os chamados de TI devem ser registrados para?",
    opcao_a: "Garantir acompanhamento e solução adequada", opcao_b: "Gerar burocracia", opcao_c: "Evitar atendimento", opcao_d: "Aumentar filas",
    resposta_correta: "A"
  },
  {
    categoria: "Financeiro",
    pergunta: "Qual setor controla contas a pagar e receber?",
    opcao_a: "Financeiro", opcao_b: "Comercial", opcao_c: "NIT", opcao_d: "Oficina",
    resposta_correta: "A"
  },
  {
    categoria: "Financeiro",
    pergunta: "O controle financeiro adequado ajuda a?",
    opcao_a: "Garantir saúde financeira da empresa", opcao_b: "Aumentar despesas", opcao_c: "Reduzir organização", opcao_d: "Gerar prejuízos",
    resposta_correta: "A"
  },
  {
    categoria: "Financeiro",
    pergunta: "Uma nota fiscal deve ser emitida com?",
    opcao_a: "Precisão e conferência dos dados", opcao_b: "Pressa", opcao_c: "Informações incompletas", opcao_d: "Dados aleatórios",
    resposta_correta: "A"
  },
  {
    categoria: "Financeiro",
    pergunta: "A inadimplência impacta diretamente?",
    opcao_a: "O fluxo de caixa da empresa", opcao_b: "A manutenção", opcao_c: "O RH", opcao_d: "O estoque",
    resposta_correta: "A"
  },
  {
    categoria: "Financeiro",
    pergunta: "Qual documento é fundamental para registrar uma locação?",
    opcao_a: "Contrato", opcao_b: "Cartão de visita", opcao_c: "Crachá", opcao_d: "Checklist",
    resposta_correta: "A"
  },
  {
    categoria: "Gente e Gestão",
    pergunta: "Qual setor é responsável pelo desenvolvimento de colaboradores?",
    opcao_a: "Gente e Gestão", opcao_b: "Oficina", opcao_c: "Comercial", opcao_d: "Logística",
    resposta_correta: "A"
  },
  {
    categoria: "Gente e Gestão",
    pergunta: "O treinamento dos colaboradores contribui para?",
    opcao_a: "Melhor desempenho profissional", opcao_b: "Aumento de erros", opcao_c: "Redução da qualidade", opcao_d: "Mais acidentes",
    resposta_correta: "A"
  },
  {
    categoria: "Gente e Gestão",
    pergunta: "O processo de integração serve para?",
    opcao_a: "Apresentar a empresa e suas normas", opcao_b: "Aplicar advertências", opcao_c: "Fazer manutenção", opcao_d: "Controlar estoque",
    resposta_correta: "A"
  },
  {
    categoria: "Gente e Gestão",
    pergunta: "Um ambiente de trabalho saudável favorece?",
    opcao_a: "Engajamento e produtividade", opcao_b: "Conflitos frequentes", opcao_c: "Desmotivação", opcao_d: "Rotatividade alta",
    resposta_correta: "A"
  },
  {
    categoria: "Gente e Gestão",
    pergunta: "O feedback tem como objetivo?",
    opcao_a: "Promover melhoria e desenvolvimento", opcao_b: "Apenas apontar erros", opcao_c: "Criar conflitos", opcao_d: "Aplicar punições",
    resposta_correta: "A"
  }
];

export async function seedQuizzes() {
  let addCount = 0;
  for (const q of NOVOS_QUIZZES) {
    const existente = await dbGet("SELECT id FROM quizzes WHERE pergunta = ?", [q.pergunta]);
    if (!existente) {
      await dbRun(`
        INSERT INTO quizzes (categoria, pergunta, opcao_a, opcao_b, opcao_c, opcao_d, resposta_correta)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `, [q.categoria, q.pergunta, q.opcao_a, q.opcao_b, q.opcao_c, q.opcao_d, q.resposta_correta]);
      addCount++;
    }
  }
  console.log(`✅ ${addCount} novos quizzes adicionados. Total: ${await dbGet("SELECT COUNT(*) as t FROM quizzes").then(r => r.t)}`);
}

seedQuizzes().catch(e => { console.error(e); process.exit(1); }).then(() => process.exit(0));
