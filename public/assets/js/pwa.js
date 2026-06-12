const seletorBotaoInstalar = "pwa-install-button";
let eventoInstalacaoPendente = null;

registrarServiceWorker();
prepararInstalacaoPwa();
monitorarConexaoPwa();

async function registrarServiceWorker() {
  if (!("serviceWorker" in navigator)) {
    return;
  }

  try {
    const registro = await navigator.serviceWorker.register("/service-worker.js", {
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
  });

  window.addEventListener("appinstalled", () => {
    eventoInstalacaoPendente = null;
    removerBotaoInstalarPwa();
  });
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
  botao.addEventListener("click", instalarPwa);
  document.body.appendChild(botao);
}

function removerBotaoInstalarPwa() {
  document.getElementById(seletorBotaoInstalar)?.remove();
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
