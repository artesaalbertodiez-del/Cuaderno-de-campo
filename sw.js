// ── Service Worker — Cuaderno de Campo ENGIE ──
// La versión se actualiza automáticamente con cada despliegue en GitHub Pages
// NO hay que cambiar nada manualmente en este archivo

const CACHE = 'engie-campo-1';

// Instalación
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(cache => cache.addAll(['./', './index.html']))
  );
  self.skipWaiting();
});

// Activación — borrar cachés antiguas
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — red primero, caché como fallback
// Con "network first" siempre se sirve la versión más reciente si hay conexión
self.addEventListener('fetch', e => {
  if (!e.request.url.startsWith(self.location.origin)) return;

  e.respondWith(
    fetch(e.request, { cache: 'no-store' })
      .then(res => {
        const copia = res.clone();
        caches.open(CACHE).then(cache => cache.put(e.request, copia));
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});
