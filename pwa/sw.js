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

// Register the service worker
if ('serviceWorker' in navigator) {
  // Wait for the 'load' event to not block other work
  window.addEventListener('load', async () => {
    // Try to register the service worker.
    try {
      // Capture the registration for later use, if needed
      let reg;

      // Use ES Module version of our Service Worker in development
      if (import.meta.env?.DEV) {
        reg = await navigator.serviceWorker.register('/service-worker.js', {
          type: 'module',
        });
      } else {
        // In production, use the normal service worker registration
        reg = await navigator.serviceWorker.register('/service-worker.js');
      }

      console.log('Service worker registered! 😎', reg);
    } catch (err) {
      console.log('😥 Service worker registration failed: ', err);
    }
  });
}
self.addEventListener('install', (event) => {
  console.log('Service worker install event!');
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_STATIC_RESOURCES)));
});

/*
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
*/
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


self.addEventListener('fetch', (event) => {
  
  console.log('Fetch intercepted for:', event.request.url);
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(event.request);
    }),
  );
});

/*
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
*/