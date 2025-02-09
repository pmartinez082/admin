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
  "./sw.js",
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
  navigator.serviceWorker.register("/pwa/sw.js").then(
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

// On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      for (const resource of APP_STATIC_RESOURCES) {
        try {
          console.log(`Intentando cachear: ${resource}`);
          await cache.add(resource);
          console.log(`Cacheado con éxito: ${resource}`);
        } catch (error) {
          console.error(`❌ Error cacheando ${resource}:`, error);
        }
      }
    })()
  );
  self.skipWaiting(); // Forzar activación inmediata
});


// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            console.log(`Deleting old cache: ${name}`);
            return caches.delete(name);
          }
        })
      );
      await clients.claim(); // Reclamar clientes activos
    })()
  );
});

// On fetch, intercept server requests
self.addEventListener("fetch", (event) => {
  console.log("Interceptando petición:", event.request.url);

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        console.log("Sirviendo desde caché:", event.request.url);
        return cachedResponse;
      }

      console.log("No está en caché, intentamos obtener de la red:", event.request.url);
      return fetch(event.request)
        .then((networkResponse) => {
          // Guardamos en caché la nueva respuesta para futuras peticiones
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        })
        .catch(() => {
          console.error("⚠️ Sin conexión y recurso no cacheado:", event.request.url);
          // Si la petición es de navegación (HTML), devolver la página principal cacheada
          if (event.request.mode === "navigate") {
            return caches.match("/html/index.html");
          }

          // Para otros archivos, devolver un mensaje de error en lugar de fallo total
          return new Response("⚠️ Offline: El recurso no está en caché.", { status: 404 });
        });
    })
  );
});


