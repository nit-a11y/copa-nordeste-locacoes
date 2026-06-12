const seletorBotaoInstalar = "pwa-install-button";
let eventoInstalacaoPendente = null;
const configuracaoPublica = window.NDL_CONFIG || {};

if (deveAtivarPwa()) {
  registrarServiceWorker();
  prepararInstalacaoPwa();
} else {
  limparPwaDesenvolvimento();
}
monitorarConexaoPwa();

function deveAtivarPwa() {
  return configuracaoPublica.pwaAtivo === true && window.location.protocol === "https:";
}

async function limparPwaDesenvolvimento() {
  if ("serviceWorker" in navigator) {
    const registros = await navigator.serviceWorker.getRegistrations();
    await Promise.all(registros.map((registro) => registro.unregister()));
  }

  if ("caches" in window) {
    const nomesCache = await caches.keys();
    await Promise.all(
      nomesCache
        .filter((nomeCache) => nomeCache.startsWith("copa-ndl-pwa"))
        .map((nomeCache) => caches.delete(nomeCache))
    );
  }
}

async function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registro = await navigator.serviceWorker.register("/service-worker.js?pwa=1", {
      scope: "/"
    });

    registro.addEventListener("updatefound", () => {
      const novoWorker = registro.installing;
      if (!novoWorker) return;

      novoWorker.addEventListener("statechange", () => {
        if (novoWorker.state === "installed" && navigator.serviceWorker.controller) {
          novoWorker.postMessage({ tipo: "ATIVAR_SERVICE_WORKER_AGORA" });
        }
      });
    });
  } catch (erro) {
    console.warn("Nao foi possivel registrar o PWA:", erro);
  }
}

function prepararInstalacaoPwa() {
  window.addEventListener("beforeinstallprompt", (evento) => {
    evento.preventDefault();
    eventoInstalacaoPendente = evento;
    exibirBotaoInstalarPwa();
    ocultarDicaInstalacaoIos();
  });

  window.addEventListener("appinstalled", () => {
    eventoInstalacaoPendente = null;
    removerBotaoInstalarPwa();
    ocultarDicaInstalacaoIos();
  });

  if (deveMostrarDicaIos()) {
    exibirDicaInstalacaoIos();
  }
}

function deveMostrarDicaIos() {
  return isIos() && !estaRodandoComoPwa();
}

function isIos() {
  const userAgent = window.navigator.userAgent.toLowerCase();
  return /iphone|ipad|ipod/.test(userAgent) || (navigator.platform === 'macintel' && navigator.maxTouchPoints > 1);
}

function exibirDicaInstalacaoIos() {
  const dica = document.getElementById("pwa-ios-install-hint");
  if (!dica) {
    return;
  }

  dica.classList.add("visible");
  dica.setAttribute("aria-hidden", "false");

  const botaoFechar = dica.querySelector(".pwa-ios-hint-close");
  if (botaoFechar) {
    botaoFechar.addEventListener("click", () => {
      dica.classList.remove("visible");
      dica.setAttribute("aria-hidden", "true");
    });
  }
}

function ocultarDicaInstalacaoIos() {
  const dica = document.getElementById("pwa-ios-install-hint");
  if (!dica) {
    return;
  }

  dica.classList.remove("visible");
  dica.setAttribute("aria-hidden", "true");
}

function exibirBotaoInstalarPwa() {
  if (document.getElementById(seletorBotaoInstalar) || estaRodandoComoPwa()) {
    return;
  }

  const botao = document.createElement("button");
  botao.id = seletorBotaoInstalar;
  botao.className = "pwa-install-button";
  botao.type = "button";
  botao.textContent = "Instalar app";
  botao.setAttribute("aria-label", "Instalar aplicativo Copa NDL");
  botao.addEventListener("click", instalarPwa);

  const areaMarcaCabecalho = document.querySelector("header .max-w-7xl > div:first-child");
  if (areaMarcaCabecalho) {
    areaMarcaCabecalho.appendChild(botao);
    return;
  }

  document.body.appendChild(botao);
}

function removerBotaoInstalarPwa() {
  document.getElementById(seletorBotaoInstalar)?.remove();
  ocultarDicaInstalacaoIos();
}

async function instalarPwa() {
  if (!eventoInstalacaoPendente) {
    return;
  }

  eventoInstalacaoPendente.prompt();
  await eventoInstalacaoPendente.userChoice;
  eventoInstalacaoPendente = null;
  removerBotaoInstalarPwa();
}

function estaRodandoComoPwa() {
  return window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;
}

function monitorarConexaoPwa() {
  window.addEventListener("online", () => {
    document.body.classList.remove("pwa-offline");
  });

  window.addEventListener("offline", () => {
    document.body.classList.add("pwa-offline");
  });

  if (!navigator.onLine) {
    document.body.classList.add("pwa-offline");
  }
}
