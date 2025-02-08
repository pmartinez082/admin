const VERSION = "4";
const CACHE_NAME = `admin-bertsio-${VERSION}`;
const APP_STATIC_RESOURCES = [
  "/",
  "/icons/putxera.jpg",
  "/icons/putxera.png",
  "/css/style.css",
  "404.html",
  "/html/admin.html",
  "/html/berria.html",
  "/html/faseakView.html",
  "/html/index.html",
  "/html/kalkuluak.html",
  "/html/taldeaEzabatu.html",
  "/html/taldeBerria.html",
  "/html/txapelketaBerria.html",
  "/html/txapelketaEzabatu.html",
  "/html/txapelketakView.html",
  "/pwa/manifest.json",
  "/pwa/sw.js",
  "/js/admin.js",
  "/js/app.js",
  "/js/ebaluazioa.js",
  "/js/epaimahaikidea.js",
  "/js/ezaugarria.js",
  "/js/fasea.js",
  "/js/konstanteak.js",
  "/js/taldea.js",
  "/js/txapelketa.js",
  "/js/user.js",
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
      try {
        await cache.addAll(APP_STATIC_RESOURCES);
        console.log("Cache added successfully");
      } catch (error) {
        console.error("Failed to cache resources", error);
      }
    })()
  );
  self.skipWaiting(); // Tomar control inmediato
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
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        return cachedResponse;
      }
      try {
        const networkResponse = await fetch(event.request);
        cache.put(event.request, networkResponse.clone());
        return networkResponse;
      } catch (error) {
        console.error("Fetch failed; returning offline page instead.", error);
        return new Response("Offline: Resource not found", { status: 404 });
      }
    })()
  );
});
