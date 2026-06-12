import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pastaLogs = path.join(__dirname, '../logs');

// Garante que o diretório de logs exista
if (!fs.existsSync(pastaLogs)) {
  fs.mkdirSync(pastaLogs, { recursive: true });
}

export function registrarLog(mensagem, tipoLog = 'info') {
  const dataHoje = new Date().toISOString().split('T')[0];
  const arquivoLog = path.join(pastaLogs, `${dataHoje}-${tipoLog}.log`);
  const timestamp = new Date().toISOString();
  const linhaLog = `[${timestamp}] ${mensagem}\n`;

  fs.appendFile(arquivoLog, linhaLog, (err) => {
    if (err) {
      console.error("Falha ao gravar arquivo de log:", err);
    }
  });
}

// Middleware de log de requisições
export function logRequest(req, res, next) {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
}

// Middleware global de tratamento de erros
export function erroMiddleware(err, req, res, next) {
  const mensagemErro = err.stack || err.message || err;
  registrarLog(`Erro na rota ${req.method} ${req.url}: ${mensagemErro}`, 'error');

  console.error("Erro capturado:", err);

  return res.status(500).json({
    sucesso: false,
    mensagem: "Ocorreu um erro interno de processamento no servidor."
  });
}
