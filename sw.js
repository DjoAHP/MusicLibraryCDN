// ============================================
// SERVICE WORKER — MusicLibrary PWA
// ============================================

// Nom du cache — change ce nom si tu modifies des fichiers
// (ça force le téléphone à télécharger la nouvelle version)
const CACHE_NAME = "musiclibrary-v1.0.2";

// ============================================
// FICHIERS A METTRE EN CACHE
// ============================================
// ⚠️ Mettre a jour si je créer un nouvelle artiste
const FILES_TO_CACHE = [
  "./",
  "./index.html",
  "./app.js",
  "./music-data.js",
  "./global-player.js",
  "./styles.css",
  "./global-player.css",
  "./search-style.css",
  "./favicon.svg",
  "./artists/bach.js",
  "./artists/beastie-boys.js",
  "./artists/beethoven.js",
  "./artists/bill-withers.js",
  "./artists/black-sabbath.js",
  "./artists/bob-marley.js",
  "./artists/buena-vista-social-club.js",
  "./artists/claude-debussy.js",
  "./artists/daft-punk.js",
  "./artists/donovan.js",
  "./artists/funkadelic.js",
  "./artists/genesis.js",
  "./artists/gentle-giant.js",
  "./artists/george-benson.js",
  "./artists/grand-funk-railroad.js",
  "./artists/james-brown.js",
  "./artists/jamiroquai.js",
  "./artists/jean-luc-ponty.js",
  "./artists/jimi-hendrix.js",
  "./artists/led-zeppelin.js",
  "./artists/machine-tools.js",
  "./artists/mad-season.js",
  "./artists/mason-williams.js",
  "./artists/michael-jackson.js",
  "./artists/mozart.js",
  "./artists/neil-young.js",
  "./artists/pink-floyd.js",
  "./artists/ray-manzarek.js",
  "./artists/santana.js",
  "./artists/supertramp.js",
  "./artists/sweet-smoke.js",
  "./artists/the-beatles.js",
  "./artists/the-claypool-lennon-delirium.js",
  "./artists/the-doors.js",
  "./artists/the-jacksons.js",
  "./artists/the-meters.js",
  "./artists/tower-of-power.js",
  "./artists/yes.js",
];

// ============================================
// INSTALLATION — mise en cache des fichiers
// ============================================
self.addEventListener("install", (event) => {
  console.log("[SW] Installation...");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Mise en cache des fichiers");
      return cache.addAll(FILES_TO_CACHE);
    }),
  );
  // Force le nouveau SW à prendre la main immédiatement
  self.skipWaiting();
});

// ============================================
// ACTIVATION — nettoyage des vieux caches
// ============================================
self.addEventListener("activate", (event) => {
  console.log("[SW] Activation...");
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          // Supprime tous les caches qui ne correspondent plus au nom actuel
          if (key !== CACHE_NAME) {
            console.log("[SW] Suppression ancien cache :", key);
            return caches.delete(key);
          }
        }),
      );
    }),
  );
  self.clients.claim();
});

// ============================================
// FETCH — stratégie "Cache d'abord, réseau ensuite"
// ============================================
self.addEventListener("fetch", (event) => {
  // On ne met PAS en cache les fichiers audio (trop lourds)
  // Ils sont streamés directement depuis le CDN
  if (event.request.url.includes(".mp3")) {
    return; // Laisse passer sans intercepter
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Si le fichier est dans le cache → on le retourne directement
      if (cachedResponse) {
        return cachedResponse;
      }
      // Sinon → on va chercher sur le réseau
      return fetch(event.request);
    }),
  );
});
