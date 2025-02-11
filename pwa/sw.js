const VERSION = "4";
const CACHE_NAME = `CACHE_${VERSION}`;
const APP_STATIC_RESOURCES = [
  "../icons/putxera.jpg",
  "../icons/putxera.png",
  "../css/style.css",
  "../404.html",
  "../html/admin.html",
  "../html/berria.html",
  "../html/faseakView.html",
  "../html/index.html",
  "../html/kalkuluak.html",
  "../html/taldeaEzabatu.html",
  "../html/taldeBerria.html",
  "../html/txapelketaBerria.html",
  "../html/txapelketaEzabatu.html",
  "../html/txapelketakView.html",
  "../pwa/manifest.json",
  "../pwa/sw.js",
  "../js/admin.js",
  "../js/app.js",
  "../js/ebaluazioa.js",
  "../js/epaimahaikidea.js",
  "../js/ezaugarria.js",
  "../js/fasea.js",
  "../js/konstanteak.js",
  "../js/taldea.js",
  "../js/txapelketa.js",
  "../js/user.js",
  "../pics/atzera.svg",
  "../pics/berria.svg",
  "../pics/birkargatu.svg",
  "../pics/chef.svg",
  "../pics/epaBerria.svg",
  "../pics/epaEzabatu.svg",
  "../pics/epaitu.svg",
  "../pics/ezarpenak.svg",
  "../pics/historia.svg",
  "../pics/mahaia.svg",
  "../pics/menu.svg",
  "../pics/podium.svg",
  "../pics/pot.svg",
  "../pics/profila.svg",
  "../pics/taldeaEzabatu.svg",
  "../pics/taldeBerria.svg",
  "../pics/txapBerria.svg",
  "../pics/txapEzabatu.svg",
];

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register(`${window.location.origin}/pwa/sw.js`).then(
    (registration) => {
      console.log("Service worker registration successful:", registration);
    },
    (error) => {
      console.log(`Service worker registration failed: ${error}`);
    }
  );
} else {
  console.log("Service workers are not supported.");
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return Promise.all(
        APP_STATIC_RESOURCES.map((resource) =>
          cache.add(resource).catch((error) => console.error(`❌ Error cacheando ${resource}:`, error))
        )
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) => {
      return Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  console.log("Interceptando petición:", event.request.url);
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Sirviendo desde caché:", event.request.url);
        return cachedResponse;
      }
      console.log("No está en caché, intentamos obtener de la red:", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          if (!networkResponse || networkResponse.status !== 200 || event.request.method !== "GET") {
            return networkResponse;
          }
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          console.error("⚠️ Sin conexión y recurso no cacheado:", event.request.url);
          if (event.request.mode === "navigate") {
            return caches.match("../html/index.html");
          }
          return caches.match(event.request).then((fallbackResponse) => {
            if (fallbackResponse) {
              return fallbackResponse;
            }
            return new Response("⚠️ Offline: El recurso no está en caché.", { status: 404 });
          });
        });
    })
  );
});