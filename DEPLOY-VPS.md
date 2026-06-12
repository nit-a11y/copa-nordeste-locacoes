# Deploy VPS - Copa Nordeste Locacoes

Dominio de producao:

```txt
https://copa.nordesteloc.com.br
```

## 1. Estrutura esperada na VPS

```txt
/var/www/sistemas/copa-nordeste-locacoes
/var/data/databases
/var/log/pm2
```

## 2. Enviar arquivos

Enviar apenas o codigo-fonte preparado, sem:

- `node_modules`
- `.env`
- `nordeste_copa.db`
- `backend/logs`
- `test-results`
- `temp_*.js`

## 3. Instalar dependencias

```bash
cd /var/www/sistemas/copa-nordeste-locacoes
npm ci --omit=dev
```

## 4. Variaveis de ambiente

O `ecosystem.config.cjs` ja define:

```txt
NODE_ENV=production
PORT=3011
DB_PATH=/var/data/databases/copa-nordeste-locacoes.db
TRUST_PROXY=loopback, linklocal, uniquelocal
ENABLE_ORIGIN_ISOLATION=false
```

## 5. Preparar pastas

```bash
sudo mkdir -p /var/www/sistemas/copa-nordeste-locacoes
sudo mkdir -p /var/data/databases
sudo mkdir -p /var/log/pm2
sudo chown -R $USER:$USER /var/www/sistemas/copa-nordeste-locacoes /var/data/databases /var/log/pm2
```

## 6. Subir com PM2

```bash
pm2 start ecosystem.config.cjs
pm2 save
pm2 status
```

## 7. NGINX

Usar o arquivo de exemplo:

```txt
deploy/nginx-copa-nordeste.conf
```

Depois:

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 8. HTTPS

O PWA so instala corretamente no celular com HTTPS.

```bash
sudo certbot --nginx -d copa.nordesteloc.com.br
```

## 9. Validacao

```bash
curl -I https://copa.nordesteloc.com.br/
curl -I https://copa.nordesteloc.com.br/manifest.webmanifest
curl -I https://copa.nordesteloc.com.br/service-worker.js
pm2 logs copa-nordeste-locacoes --lines 100
```

O `service-worker.js` deve responder com:

```txt
Service-Worker-Allowed: /
Cache-Control: no-cache, no-store, must-revalidate
```
