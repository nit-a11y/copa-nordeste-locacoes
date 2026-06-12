import rateLimit from 'express-rate-limit';

export const limitadorAutenticacao = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Limite de 100 requisições
  message: {
    sucesso: false,
    mensagem: "Muitas tentativas de login/registro a partir deste IP. Tente novamente em 15 minutos."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export function sanitizarEntradas(req, res, next) {
  const sanitizarString = (str) => {
    if (typeof str !== 'string') return str;
    return str
      .replace(/<script[^>]*>([\s\S]*?)<\/script>/gi, '') // Remove scripts maliciosos
      .replace(/<\/?[^>]+(>|$)/g, "") // Remove tags HTML comuns
      .replace(/['"\\;]/g, '') // Filtra caracteres de injeção direta de query
      .trim();
  };

  if (req.body) {
    for (const key in req.body) {
      if (typeof req.body[key] === 'string') {
        req.body[key] = sanitizarString(req.body[key]);
      }
    }
  }

  if (req.params) {
    for (const key in req.params) {
      if (typeof req.params[key] === 'string') {
        req.params[key] = sanitizarString(req.params[key]);
      }
    }
  }

  next();
}
