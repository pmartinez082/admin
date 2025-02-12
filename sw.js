const VERSION = "4";
const CACHE_NAME = `CACHE_${VERSION}`;
const APP_STATIC_RESOURCES = [
  "/admin",
  "/admin/icons/putxera.jpg",
  "/admin/icons/putxera.png",
  "/admin/css/style.css",
  "/admin/html/admin.html",
  "/admin/html/berria.html",
  "/admin/html/faseakView.html",
  "/admin/index.html",
  "/admin/html/kalkuluak.html",
  "/admin/html/taldeaEzabatu.html",
  "/admin/html/taldeBerria.html",
  "/admin/html/txapelketaBerria.html",
  "/admin/html/txapelketaEzabatu.html",
  "/admin/html/txapelketakView.html",
  "/admin/pwa/manifest.json",
  "/admin/sw.js",
  "/admin/js/admin.js",
  "/admin/js/app.js",
  "/admin/js/ebaluazioa.js",
  "/admin/js/epaimahaikidea.js",
  "/admin/js/ezaugarria.js",
  "/admin/js/fasea.js",
  "/admin/js/konstanteak.js",
  "/admin/js/taldea.js",
  "/admin/js/txapelketa.js",
  "/admin/js/user.js",
  "/admin/pics/atzera.svg",
  "/admin/pics/berria.svg",
  "/admin/pics/birkargatu.svg",
  "/admin/pics/chef.svg",
  "/admin/pics/epaBerria.svg",
  "/admin/pics/epaEzabatu.svg",
  "/admin/pics/epaitu.svg",
  "/admin/pics/ezarpenak.svg",
  "/admin/pics/historia.svg",
  "/admin/pics/mahaia.svg",
  "/admin/pics/menu.svg",
  "/admin/pics/podium.svg",
  "/admin/pics/pot.svg",
  "/admin/pics/profila.svg",
  "/admin/pics/taldeaEzabatu.svg",
  "/admin/pics/taldeBerria.svg",
  "/admin/pics/txapBerria.svg",
  "/admin/pics/txapEzabatu.svg",
];


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
            return caches.match("/index.html");
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