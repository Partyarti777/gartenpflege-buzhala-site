// Service Worker für gartenpflege-service-buzhala.de
// Cache-First-Strategie für Statics, Network-First für HTML
const CACHE_VERSION = 'buzhala-v1';
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/brand.css',
  '/impressum.html',
  '/datenschutz.html',
  '/cookies.html',
  '/sitemap.xml',
  '/robots.txt',
  '/llms.txt',
  '/favicon.svg',
  '/logo.svg',
  '/og-image.svg',
  '/videos/hero-bg.mp4',
  '/videos/hero-poster.jpg',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      cache.addAll(PRECACHE_URLS).catch(() => {
        // Einzelne Dateien können fehlen — wir wollen den Install nicht blockieren
        return Promise.all(
          PRECACHE_URLS.map((url) => cache.add(url).catch(() => null)),
        );
      }),
    ).then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Externe Ressourcen (CDN, Fonts, etc.) — Network-First
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request)),
    );
    return;
  }

  // HTML-Navigation — Network-First mit Cache-Fallback
  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(request, clone));
          return res;
        })
        .catch(() => caches.match(request).then((cached) => cached || caches.match('/index.html'))),
    );
    return;
  }

  // Statics (CSS, JS, Bilder, Videos) — Cache-First
  event.respondWith(
    caches.match(request).then((cached) => {
      if (cached) return cached;
      return fetch(request).then((res) => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_VERSION).then((c) => c.put(request, clone));
        }
        return res;
      }).catch(() => {
        // Offline-Fallback für Bilder
        if (request.destination === 'image') return caches.match('/logo.svg');
      });
    }),
  );
});
