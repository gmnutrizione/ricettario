const CACHE_NAME = "ricettario-v7";
const APP_SHELL = [
  "./",
  "./index.html",
  "./style.css",
  "./theme.css",
  "./content.json",
  "./app.js",
  "./manifest.json",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/pasti/colazione.png",
  "./icons/pasti/pranzo.png",
  "./icons/pasti/cena.png",
  "./icons/pasti/spuntino-mattina.png",
  "./icons/pasti/spuntino-pomeriggio.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((names) =>
      Promise.all(names.filter((n) => n !== CACHE_NAME).map((n) => caches.delete(n)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const url = new URL(event.request.url);

  // Solo per i file dell'app (stessa origine): prova sempre prima la rete,
  // così ogni modifica (colori, testi, ricette) si vede subito appena pubblicata.
  // Se manca la connessione, usa l'ultima copia salvata, per far funzionare
  // l'app anche offline.
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});
