import { dbRun, dbGet, dbAll } from './connection.js';

const SETOR_MAP = {
  "COMERCIAL": { velocidade_base: [65, 88], chute_base: [60, 90], defesa_base: [50, 75], energia_base: [70, 90] },
  "MANUTENCAO": { velocidade_base: [55, 80], chute_base: [60, 85], defesa_base: [70, 92], energia_base: [75, 95] },
  "LOGISTICA": { velocidade_base: [60, 85], chute_base: [55, 75], defesa_base: [60, 80], energia_base: [70, 88] },
  "GENTE E GESTAO": { velocidade_base: [50, 75], chute_base: [50, 70], defesa_base: [55, 75], energia_base: [65, 85] },
  "FINANCEIRO": { velocidade_base: [50, 70], chute_base: [55, 75], defesa_base: [55, 75], energia_base: [65, 85] },
  "NIT": { velocidade_base: [60, 85], chute_base: [65, 88], defesa_base: [55, 78], energia_base: [70, 90] },
  "COMPRAS": { velocidade_base: [55, 75], chute_base: [55, 78], defesa_base: [55, 75], energia_base: [65, 85] },
  "MARKETING": { velocidade_base: [65, 88], chute_base: [60, 85], defesa_base: [50, 70], energia_base: [70, 88] },
  "ALMOXARIFADO": { velocidade_base: [50, 70], chute_base: [50, 65], defesa_base: [60, 80], energia_base: [65, 85] },
  "SERVICOS DIVERSOS": { velocidade_base: [55, 75], chute_base: [50, 65], defesa_base: [55, 75], energia_base: [65, 85] },
  "SERVICOS GERAIS": { velocidade_base: [50, 70], chute_base: [45, 60], defesa_base: [55, 75], energia_base: [60, 80] },
  "CONTABIL": { velocidade_base: [50, 70], chute_base: [55, 75], defesa_base: [55, 75], energia_base: [65, 85] }
};

const RARIDADE_CARGO = {
  "JUNIOR": "Comum",
  "JUNIOR I": "Comum",
  "JUNIOR II": "Comum",
  "I": "Comum",
  "II": "Raro",
  "III": "Raro",
  "PLENO": "Raro",
  "PLENO I": "Raro",
  "PLENO II": "Raro",
  "SENIOR": "Épico",
  "SENIOR I": "Épico",
  "SENIOR II": "Épico",
  "ESPECIALISTA": "Épico",
  "COORDENADOR": "Épico",
  "SUPERVISOR": "Épico",
  "GERENTE": "Lendário",
  "LIDER": "Épico",
  "ESTAGIARIO": "Comum",
  "ANALISTA": "Raro",
  "ASSISTENTE": "Comum",
  "AUXILIAR": "Comum",
  "AUX": "Comum",
  "MOTORISTA": "Comum",
  "MOTOCICLISTA": "Comum",
  "MECANICO": "Raro",
  "DESIGNER": "Raro",
  "COMPRADOR": "Raro",
  "CONSULTOR": "Raro"
};

function extrairNivel(cargo) {
  const cargoUpper = cargo.toUpperCase();
  if (cargoUpper.includes("SENIOR")) return "SENIOR";
  if (cargoUpper.includes("PLENO")) return "PLENO";
  if (cargoUpper.includes("JUNIOR")) return "JUNIOR";
  if (cargoUpper.includes("ESTAGIARIO")) return "ESTAGIARIO";
  if (cargoUpper.includes("GERENTE")) return "GERENTE";
  if (cargoUpper.includes("COORDENADOR")) return "COORDENADOR";
  if (cargoUpper.includes("SUPERVISOR")) return "SUPERVISOR";
  if (cargoUpper.includes("ESPECIALISTA")) return "ESPECIALISTA";
  if (cargoUpper.includes("LIDER")) return "LIDER";
  if (cargoUpper.includes("AUXILIAR") || cargoUpper.includes("AUX DE")) return "AUXILIAR";
  if (cargoUpper.includes("ASSISTENTE")) return "ASSISTENTE";
  if (cargoUpper.includes("ANALISTA")) return "ANALISTA";
  if (cargoUpper.includes("MECANICO")) return "MECANICO";
  if (cargoUpper.includes("MOTORISTA") || cargoUpper.includes("MOTOCICLISTA")) return "MOTORISTA";
  if (cargoUpper.includes("COMPRADOR")) return "COMPRADOR";
  if (cargoUpper.includes("CONSULTOR")) return "CONSULTOR";
  if (cargoUpper.includes("DESIGNER")) return "DESIGNER";
  if (cargoUpper.includes("OFICIAL")) return "ASSISTENTE";
  return "ASSISTENTE";
}

function gerarStats(setor, cargo) {
  const cfg = SETOR_MAP[setor] || SETOR_MAP["SERVICOS DIVERSOS"];
  const nivel = extrairNivel(cargo);

  const multipliers = {
    "ESTAGIARIO": 0.5, "AUXILIAR": 0.6, "AUX": 0.6, "ASSISTENTE": 0.7,
    "ANALISTA": 0.85, "JUNIOR": 0.7, "MOTORISTA": 0.7, "MOTOCICLISTA": 0.7,
    "MECANICO": 0.85, "COMPRADOR": 0.8, "CONSULTOR": 0.85, "DESIGNER": 0.8,
    "PLENO": 1.0, "SENIOR": 1.15, "ESPECIALISTA": 1.15, "COORDENADOR": 1.1,
    "SUPERVISOR": 1.1, "LIDER": 1.05, "GERENTE": 1.25, "OFICIAL": 0.7
  };

  if (cargo.toUpperCase().includes(" JUNIOR") && !cargo.toUpperCase().includes("PLENO") && !cargo.toUpperCase().includes("SENIOR")) {}
  const mult = multipliers[nivel] || 0.7;

  const range = (min, max) => Math.round((min + Math.random() * (max - min)) * mult);
  const clamp = (v) => Math.max(30, Math.min(99, v));

  return {
    velocidade: clamp(range(cfg.velocidade_base[0], cfg.velocidade_base[1])),
    chute: clamp(range(cfg.chute_base[0], cfg.chute_base[1])),
    defesa: clamp(range(cfg.defesa_base[0], cfg.defesa_base[1])),
    energia: clamp(range(cfg.energia_base[0], cfg.energia_base[1]))
  };
}

function determinarRaridade(cargo) {
  const cargoUpper = cargo.toUpperCase();

  if (cargoUpper.includes("GERENTE")) return "Lendário";
  if (cargoUpper.includes("COORDENADOR")) return "Épico";
  if (cargoUpper.includes("SUPERVISOR")) return "Épico";
  if (cargoUpper.includes("ESPECIALISTA")) return "Épico";
  if (cargoUpper.includes("SENIOR")) return "Épico";
  if (cargoUpper.includes("PLENO")) return "Raro";
  if (cargoUpper.includes("LIDER")) return "Raro";
  if (cargoUpper.includes("ANALISTA")) return "Raro";
  if (cargoUpper.includes("MECANICO") && (cargoUpper.includes("SENIOR") || cargoUpper.includes("ESPECIALISTA"))) return "Épico";

  if (cargoUpper.includes("ESTAGIARIO") || cargoUpper.includes("AUXILIAR") || cargoUpper.includes("AUX DE")
    || cargoUpper.includes("MOTORISTA") || cargoUpper.includes("MOTOCICLISTA")
    || cargoUpper.includes("SERVICOS GERAIS") || cargoUpper.includes("SERVICOS DIVERSOS")
    || cargoUpper.includes("JUNIOR")) return "Comum";

  if (cargoUpper.includes("ASSISTENTE")) {
    if (cargoUpper.includes("III") || cargoUpper.includes("SENIOR")) return "Raro";
    return "Comum";
  }

  if (cargoUpper.includes("CONSULTOR") && (cargoUpper.includes("SENIOR") || cargoUpper.includes("PLENO"))) return "Raro";
  if (cargoUpper.includes("CONSULTOR")) return "Comum";
  if (cargoUpper.includes("COMPRADOR") && cargoUpper.includes("PLENO")) return "Raro";
  if (cargoUpper.includes("COMPRADOR")) return "Comum";

  return "Comum";
}

const colaboradoresNovos = [
  { nome: "SUZANA BEZERRA DOS SANTOS", setor: "COMERCIAL", cargo: "ANALISTA DE CONTROLE COMERCIAL PLENO" },
  { nome: "TAIS CORDEIRO NOBRE", setor: "GENTE E GESTAO", cargo: "ASSISTENTE DE RH II" },
  { nome: "RICARDO ALEXANDRE DA SILVA PEREIRA FILHO", setor: "LOGISTICA", cargo: "MOTOCICLISTA" },
  { nome: "MATHEUS MARCELO DA SILVA", setor: "FINANCEIRO", cargo: "ASSISTENTE FINANCEIRO II" },
  { nome: "MAYKSON DE MELO ALEXANDRE", setor: "COMPRAS", cargo: "COMPRADOR PLENO" },
  { nome: "MIKAEL LIMA RIBEIRO", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "MILLENA VASCONCELOS LOUREIRO", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL PLENO" },
  { nome: "NATHANAEL OLIVEIRA SOEIRO", setor: "NIT", cargo: "ANALISTA DE BI JUNIOR" },
  { nome: "LEANDRO BATISTA DOS ANJOS FILHO", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "LORENA LIMA MACHADO", setor: "COMERCIAL", cargo: "CONSULTORA COMERCIAL PLENO" },
  { nome: "LUCAS CAVALCANTE DE ARAUJO", setor: "MANUTENCAO", cargo: "ASSISTENTE DE PCM II" },
  { nome: "LUCAS LIMA DE OLIVEIRA", setor: "LOGISTICA", cargo: "SUPERVISOR DE LOGISTICA" },
  { nome: "MAGNA WELLY VIEIRA SILVA", setor: "MANUTENCAO", cargo: "ANALISTA DE OPERACOES PLENO" },
  { nome: "JOSUE MIRANDA FARIAS", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "KALENNA NUNES MARTINS", setor: "MANUTENCAO", cargo: "ASSISTENTE DE PCM I" },
  { nome: "KATIANA CAVALCANTE LIMA", setor: "GENTE E GESTAO", cargo: "ANALISTA DE GENTE E GESTAO SENIOR" },
  { nome: "KEYCIARA MILENA CARDOSO FONSECA", setor: "COMERCIAL", cargo: "CONSULTORA COMERCIAL SENIOR" },
  { nome: "JANAINA OLIVEIRA MARTINS", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL EXTERNO JUNIOR" },
  { nome: "FRANCISCO DE SOUSA FREITAS", setor: "MANUTENCAO", cargo: "MECANICO PLENO II" },
  { nome: "FRANCISCO FERNANDO TEIXEIRA RODRIGUES", setor: "MANUTENCAO", cargo: "MECANICO ESPECIALISTA" },
  { nome: "GILVANNI MESQUITA DE PAULA", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "HELISSON SALES DE MARIA", setor: "ALMOXARIFADO", cargo: "AUXILIAR DE ALMOXARIFADO" },
  { nome: "CRISTIAN DA SILVA BARROS", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "EMANUEL RODRIGUES COSTA", setor: "MANUTENCAO", cargo: "ANALISTA DE MANUTENCAO JUNIOR" },
  { nome: "FELIPE REIS VERISSIMO", setor: "MARKETING", cargo: "SUPERVISOR DE MARKETING" },
  { nome: "ANTONIA MARLENE DA SILVA CONRADO", setor: "SERVICOS GERAIS", cargo: "SERVICOS GERAIS" },
  { nome: "AILTON VENANCIO DA FONSECA", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "ALEXANDRE DA SILVA TEIXEIRA", setor: "MANUTENCAO", cargo: "SUPERVISOR DE MANUTENCAO" },
  { nome: "LUCAS DA SILVA BARRETO", setor: "COMPRAS", cargo: "ASSISTENTE DE COMPRAS I" },
  { nome: "LUCIANO NUNES BRITO", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "MARCIO HENRIQUE RIBEIRO BARBOSA FILHO", setor: "MANUTENCAO", cargo: "ANALISTA DE MANUTENCAO JUNIOR" },
  { nome: "MARIA YASMIN ARAUJO FREIRE", setor: "FINANCEIRO", cargo: "ASSISTENTE FINANCEIRO II" },
  { nome: "MATHEUS ANGELO SILVA", setor: "MANUTENCAO", cargo: "ASSISTENTE DE PCM I" },
  { nome: "MIZAEL RIBEIRO DE SOUSA", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "NATHACHA LICYA GOMES DA SILVA", setor: "COMERCIAL", cargo: "SUPERVISORA DE VENDAS" },
  { nome: "NICASSIO BERNARDO SILVA", setor: "MANUTENCAO", cargo: "SUPERVISOR DE OPERACOES" },
  { nome: "PAULO EDUARDO MARTINS COSTA", setor: "LOGISTICA", cargo: "MOTOCICLISTA" },
  { nome: "PAULO RICARDO DE NAZARETH CRUZ", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "PEDRO ALAN DE LIMA PEREIRA", setor: "COMPRAS", cargo: "COMPRADOR JUNIOR" },
  { nome: "RAFAEL DINIZ CALVACANTE", setor: "MANUTENCAO", cargo: "ANALISTA DE MANUTENCAO PLENO" },
  { nome: "RAIMUNDO NONATO SOUSA MOREIRA FILHO", setor: "MANUTENCAO", cargo: "MECANICO PLENO II" },
  { nome: "RAULL FERNANDO DE ABREU ARAUJO", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "RIAN LUCAS VIEIRA DOS SANTOS", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR II" },
  { nome: "RICKELME ANGELL SOUZA ALMEIDA", setor: "MANUTENCAO", cargo: "MECANICO PLENO I" },
  { nome: "RINALDI OLIVEIRA MARTINS", setor: "MANUTENCAO", cargo: "GERENTE DE UNIDADE" },
  { nome: "RUAN MATHEUS MENDES DA SILVA", setor: "LOGISTICA", cargo: "AUX DE CARGA E DESCARGA" },
  { nome: "SARA EMILY TEIXEIRA DE SOUSA", setor: "MARKETING", cargo: "ASSISTENTE DE MARKETING" },
  { nome: "TAMIRES ROSENDO FREITAS", setor: "ADMINISTRATIVO", cargo: "ASSISTENTE ADMINISTRATIVO" },
  { nome: "THIAGO GUIMARÃES LISBOA RIBEIRO", setor: "COMERCIAL", cargo: "GERENTE COMERCIAL" },
  { nome: "VANESSA DOS SANTOS XAVIER", setor: "COMERCIAL", cargo: "CONSULTORA COMERCIAL JUNIOR" },
  { nome: "VITOR FERNANDES MENDES MARTINS", setor: "MANUTENCAO", cargo: "COORDENADOR DE MANUTENCAO" },
  { nome: "WILLAME DAS NEVES CABRAL", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "YAISNAYA HENRIQUE FACANHA MELO", setor: "COMPRAS", cargo: "COMPRADOR JUNIOR" },
  { nome: "ZAQUEL FERNANDES DA SILVA", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "ADRIELY DOS SANTOS EVANGELISTA", setor: "COMERCIAL", cargo: "ASSISTENTE COMERCIAL I" },
  { nome: "ALEXANDRE FELICIO CANDIDO", setor: "ALMOXARIFADO", cargo: "AUXILIAR DE ALMOXARIFADO" },
  { nome: "ALEXIS WINNICIUS GAMA SALAZAR", setor: "MANUTENCAO", cargo: "MECANICO PLENO I" },
  { nome: "ANA CAROLINY SANTOS DA SILVA", setor: "COMERCIAL", cargo: "ASSISTENTE COMERCIAL I" },
  { nome: "ANA FABRICIA PEREIRA DA SILVA", setor: "GENTE E GESTAO", cargo: "ASSISTENTE ADMINISTRATIVO II" },
  { nome: "ANDERSON MESQUITA DE ARAUJO", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "ANDRE LUCAS DE SOUSA VITORIANO", setor: "MANUTENCAO", cargo: "MECANICO PLENO I" },
  { nome: "ANDRESSA DOS SANTOS XAVIER", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL SENIOR II" },
  { nome: "ANTONIA RAYSSA LIMA BEZERRA", setor: "COMERCIAL", cargo: "AUXILIAR COMERCIAL" },
  { nome: "ANTONIO GABRIEL ALVES PAULINO", setor: "LOGISTICA", cargo: "ASSISTENTE DE LOGISTICA I" },
  { nome: "ANTONIO THIAGO FREITAS LEITE", setor: "MANUTENCAO", cargo: "LIDER DE MANUTENCAO" },
  { nome: "ANTONIO ULISSES DOS SANTOS NETO", setor: "MANUTENCAO", cargo: "MECANICO PLENO I" },
  { nome: "ARIANE SOUSA DE OLIVEIRA", setor: "FINANCEIRO", cargo: "ASSISTENTE FINANCEIRO III" },
  { nome: "BARBARA LIMA DE OLIVEIRA", setor: "FINANCEIRO", cargo: "ASSISTENTE FINANCEIRO II" },
  { nome: "BRENDA RABELO E SILVA", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL PLENO" },
  { nome: "BRUNO BRENO SERRA SILVA", setor: "LOGISTICA", cargo: "AUXILIAR DE CARGA E DESCARGA" },
  { nome: "BRUNO SOUSA BRAGA", setor: "SERVICOS DIVERSOS", cargo: "OFICIAL DE SERVICOS DIVERSOS" },
  { nome: "CAIQUE CUSTODIO BARROSO VASCONCELOS", setor: "NIT", cargo: "ASSISTENTE DE INTELIGENCIA E TECNOLOGIA" },
  { nome: "CAMILA GOMES DA SILVA BARBOSA", setor: "COMERCIAL", cargo: "AUXILIAR COMERCIAL" },
  { nome: "CEZAR CALANDRINI DE AZEVEDO NETO JUNIOR", setor: "CONTABIL", cargo: "ESPECIALISTA CONTABIL / FISCAL" },
  { nome: "CONRADO RIBEIRO DE MENEZES", setor: "MANUTENCAO", cargo: "MECANICO PLENO II" },
  { nome: "DANIELE SERVALHO MARTINS", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL PLENO" },
  { nome: "DAVI INACIO DA SILVA", setor: "MARKETING", cargo: "DESIGNER GRAFICO" },
  { nome: "DAVI MACIEL RABELO", setor: "MANUTENCAO", cargo: "ESTAGIARIO DE PCM" },
  { nome: "EDILBERTO DAVYD SILVA DO NASCIMENTO", setor: "SERVICOS DIVERSOS", cargo: "AUXILIAR DE SERVICOS DIVERSOS" },
  { nome: "EDSLLEY PEDRO ALBUQUERQUE DA SILVA", setor: "ADMINISTRATIVO", cargo: "AUXILIAR ADMINISTRATIVO" },
  { nome: "ERIKA BETHANIA RIZZA MACHADO", setor: "GENTE E GESTAO", cargo: "GESTORA ADMINISTRATIVA & RH" },
  { nome: "FAGNER ROCHA BEZERRA", setor: "MANUTENCAO", cargo: "MECANICO SENIOR I" },
  { nome: "FRANCISCA JAMAICA BRANDAO SOBRINHO", setor: "COMERCIAL", cargo: "ASSISTENTE COMERCIAL II" },
  { nome: "FRANCISCO WESLEY DA GAMA SOARES", setor: "MANUTENCAO", cargo: "MECANICO SOLDADOR PLENO" },
  { nome: "GABRIEL DE JESUS LOPES ROSA", setor: "LOGISTICA", cargo: "ASSISTENTE DE LOGISTICA I" },
  { nome: "GABRIEL SALES OLIVEIRA", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR II" },
  { nome: "GEOVANNA MARIA RODRIGUES FEITOSA", setor: "COMERCIAL", cargo: "ASSISTENTE COMERCIAL I" },
  { nome: "GILSON CARLOS CANTANHEDE POUSO", setor: "MANUTENCAO", cargo: "MECANICO SENIOR DE GERADORES" },
  { nome: "HULDSON EFREM FERREIRA DE GOUVEIA", setor: "MANUTENCAO", cargo: "ASSISTENTE DE PCM I" },
  { nome: "HUMBERTO ARAGAO BARIVIERA MOREIRA", setor: "COMERCIAL", cargo: "CONSULTOR COMERCIAL SENIOR" },
  { nome: "IARLEY EMERSON SILVA SOARES", setor: "LOGISTICA", cargo: "AUXILIAR DE CARGA E DESCARGA" },
  { nome: "IGOR SILVA SOUZA", setor: "MANUTENCAO", cargo: "AUX DE MECANICO SOLDADOR" },
  { nome: "IRYS EMANUELLLA DE OLIVEIRA FERREIRA", setor: "COMERCIAL", cargo: "ASSISTENTE COMERCIAL I" },
  { nome: "ISAQUIEL FERREIRA ALVES", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "ITHALO BRUNO RICARTE DE AQUINO", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "ITHALO RAFAEL REGIS QUEIROZ CORDEIRO", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR II" },
  { nome: "JANDERSON OLIVEIRA DA SILVA", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "JEFFERSON THIAGO MOREIRA DE OLIVEIRA", setor: "LOGISTICA", cargo: "ASSISTENTE DE LOGISTICA II" },
  { nome: "JOANA DARC DOS SANTOS BEZERRA", setor: "FINANCEIRO", cargo: "ASSISTENTE FINANCEIRO II" },
  { nome: "JOAO VICTOR SOARES ZARANZA", setor: "FINANCEIRO", cargo: "LIDER FINANCEIRO" },
  { nome: "JORGE PAULO LOPES", setor: "MANUTENCAO", cargo: "MECANICO ESPECIALISTA" },
  { nome: "JOSE AISLEY DA SILVA COSTA", setor: "MANUTENCAO", cargo: "MECANICO SENIOR II" },
  { nome: "JOSE EMERSON MOREIRA NERI", setor: "MANUTENCAO", cargo: "SUPERVISOR DE UNIDADE" },
  { nome: "JOSE GUSTAVO FERREIRA GAMA", setor: "LOGISTICA", cargo: "MOTORISTA" },
  { nome: "JOSE GUSTAVO RIBEIRO FERNANDES", setor: "MANUTENCAO", cargo: "MECANICO JUNIOR I" },
  { nome: "JOSE RIBAMAR ALVES DOS SANTOS", setor: "MANUTENCAO", cargo: "MECANICO SOLDADOR JUNIOR" }
];

async function seedColaboradores() {
  console.log("Iniciando carga de colaboradores...");

  for (const c of colaboradoresNovos) {
    const existente = await dbGet("SELECT id FROM colaboradores WHERE nome = ?", [c.nome]);
    if (existente) {
      console.log(`  ${c.nome} já existe. Pulando.`);
      continue;
    }

    const stats = gerarStats(c.setor, c.cargo);
    const raridade = determinarRaridade(c.cargo);

    await dbRun(`
      INSERT INTO colaboradores (nome, setor, velocidade, chute, defesa, energia, raridade)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [c.nome, c.setor, stats.velocidade, stats.chute, stats.defesa, stats.energia, raridade]);

    console.log(`  + ${c.nome} (${c.setor}/${c.cargo}) [${raridade}] V:${stats.velocidade} C:${stats.chute} D:${stats.defesa} E:${stats.energia}`);
  }

  console.log("\nCarga concluída!");
  process.exit(0);
}

seedColaboradores().catch(err => {
  console.error("Erro:", err);
  process.exit(1);
});
