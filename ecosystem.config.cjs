// Configuração PM2 para produção na VPS - Copa Nordeste Locações
module.exports = {
  apps: [{
    name: 'copa-nordeste-locacoes',
    cwd: '/var/www/sistemas/copa-nordeste-locacoes',
    script: 'npm',
    args: 'start',
    env: {
      NODE_ENV: 'production',
      PORT: 3011, // Porta específica para evitar colisões na VPS
      APP_URL: 'https://copa.nordesteloc.com.br',
      DB_PATH: '/var/data/databases/copa-nordeste-locacoes.db',
      TRUST_PROXY: 'loopback, linklocal, uniquelocal',
      PWA_ENABLED: 'true',
      ENABLE_ORIGIN_ISOLATION: 'false'
    },
    log_file: '/var/log/pm2/copa-nordeste-locacoes.log',
    out_file: '/var/log/pm2/copa-nordeste-locacoes-out.log',
    error_file: '/var/log/pm2/copa-nordeste-locacoes-error.log',
    merge_logs: true,
    time: true,
    autorestart: true,
    max_restarts: 10,
    min_uptime: '10s'
  }]
};
