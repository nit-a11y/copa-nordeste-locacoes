const VERSAO_CACHE = "copa-ndl-pwa-v1.0.0";
const CACHE_APP = `${VERSAO_CACHE}-app`;
const CACHE_DADOS = `${VERSAO_CACHE}-dados`;
const CACHE_ESTATICO = `${VERSAO_CACHE}-estatico`;

const ARQUIVOS_APP = [
  "/",
  "/index.html",
  "/offline.html",
  "/manifest.webmanifest",
  "/assets/css/reset.css",
  "/assets/css/variaveis.css",
  "/assets/css/global.css",
  "/assets/css/componentes.css",
  "/assets/js/api.js",
  "/assets/js/eventos.js",
  "/assets/js/ui.js",
  "/assets/js/validacoes.js",
  "/assets/js/pwa.js",
  "/assets/vendor/html2canvas.min.js",
  "/assets/images/icone.png",
  "/assets/images/LOGO%20COLORIDA.png",
  "/assets/images/nordeste-logo.svg",
  "/assets/icons/pwa-icon-192.png",
  "/assets/icons/pwa-icon-512.png"
];

self.addEventListener("install", (evento) => {
  evento.waitUntil(
    caches.open(CACHE_APP)
      .then((cache) => cache.addAll(ARQUIVOS_APP))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evento) => {
  evento.waitUntil(
    caches.keys()
      .then((nomesCache) => Promise.all(
        nomesCache
          .filter((nomeCache) => !nomeCache.startsWith(VERSAO_CACHE))
          .map((nomeCache) => caches.delete(nomeCache))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("message", (evento) => {
  if (evento.data?.tipo === "ATIVAR_SERVICE_WORKER_AGORA") {
    self.skipWaiting();
  }
});

self.addEventListener("fetch", (evento) => {
  const requisicao = evento.request;

  if (requisicao.method !== "GET") {
    return;
  }

  const url = new URL(requisicao.url);

  if (requisicao.mode === "navigate") {
    evento.respondWith(responderNavegacao(requisicao));
    return;
  }

  if (url.origin === self.location.origin && url.pathname.startsWith("/api/")) {
    evento.respondWith(responderApiComRedePrimeiro(requisicao));
    return;
  }

  if (url.origin === self.location.origin) {
    evento.respondWith(responderEstaticoComCachePrimeiro(requisicao));
    return;
  }

  evento.respondWith(responderExternoComCacheFlexivel(requisicao));
});

async function responderNavegacao(requisicao) {
  try {
    const respostaRede = await fetch(requisicao);
    const cache = await caches.open(CACHE_APP);
    cache.put("/", respostaRede.clone());
    return respostaRede;
  } catch (erro) {
    return (await caches.match("/")) || (await caches.match("/offline.html"));
  }
}

async function responderApiComRedePrimeiro(requisicao) {
  const cache = await caches.open(CACHE_DADOS);

  try {
    const respostaRede = await fetch(requisicao);
    if (respostaRede.ok) {
      cache.put(requisicao, respostaRede.clone());
    }
    return respostaRede;
  } catch (erro) {
    const respostaCache = await cache.match(requisicao);
    if (respostaCache) {
      return respostaCache;
    }

    return new Response(
      JSON.stringify({
        sucesso: false,
        mensagem: "Sem conexao. Dados nao disponiveis no cache."
      }),
      {
        status: 503,
        headers: { "Content-Type": "application/json; charset=utf-8" }
      }
    );
  }
}

async function responderEstaticoComCachePrimeiro(requisicao) {
  const respostaCache = await caches.match(requisicao);
  if (respostaCache) {
    atualizarCacheEstatico(requisicao);
    return respostaCache;
  }

  const respostaRede = await fetch(requisicao);
  if (respostaRede.ok) {
    const cache = await caches.open(CACHE_ESTATICO);
    cache.put(requisicao, respostaRede.clone());
  }
  return respostaRede;
}

async function responderExternoComCacheFlexivel(requisicao) {
  const cache = await caches.open(CACHE_ESTATICO);
  const respostaCache = await cache.match(requisicao);

  const buscaRede = fetch(requisicao)
    .then((respostaRede) => {
      if (respostaRede.ok || respostaRede.type === "opaque") {
        cache.put(requisicao, respostaRede.clone());
      }
      return respostaRede;
    })
    .catch(() => respostaCache);

  return respostaCache || buscaRede;
}

async function atualizarCacheEstatico(requisicao) {
  try {
    const respostaRede = await fetch(requisicao);
    if (respostaRede.ok) {
      const cache = await caches.open(CACHE_ESTATICO);
      await cache.put(requisicao, respostaRede);
    }
  } catch (erro) {
    // A conexao pode cair durante a atualizacao silenciosa do cache.
  }
}
