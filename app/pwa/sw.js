const VERSION = "2";
const CACHE_NAME = `admin-bertsio-${VERSION}`;
const APP_STATIC_RESOURCES = [
  "/",
  "/icons/putxera.jpg",
  "/icons/putxera.png",
  "/css/style.css",
  "/admin",
  "/faseak",
  "/txapelketak",
  "/berria",
  "/ezabatu/txapelketa",
  "/ezabatu/taldea",
  "/podium",
  "/berria/txapelketa",
  "/berria/taldea",
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
    navigator.serviceWorker.register("sw.js").then(
      (registration) => {
        console.log("Service worker registration successful:", registration);
      },
      (error) => {
        console.log(`Service worker registration failed: ${error}`);
      },
    );
  } else {
    console.log("Service workers are not supported.");
  }

  // On install, cache the static resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })()
  );
});

// delete old caches on activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
      await clients.claim();
    })()
  );
});

// On fetch, intercept server requests
// and respond with cached responses instead of going to network
self.addEventListener("fetch", (event) => {
  // As a single page app, direct app to always go to cached home page.
  if (event.request.mode === "navigate") {
    event.respondWith(caches.match("/"));
    return;
  }

  // For all other requests, go to the cache first, and then the network.
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // If resource isn't in the cache, return a 404.
      return new Response(null, { status: 404 });
    })()
  );
});
  
  