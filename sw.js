// Service Worker für gartenpflege-service-buzhala.de
//
// v4 — Fix: In-Flight-Dedup gegen Doppel-Origin-Fetches + Cache-Key-
// Normalisierung (Range/Accept-Header werden ignoriert, damit <picture>-
// WebP-Requests und JPEG-Fallback denselben Cache-Eintrag teilen).
//
// Strategie:
//   - HTML-Navigation: Network-First (frisch), Cache-Fallback (offline)
//   - Statics (CSS/JS/Bilder/Videos): Cache-First mit In-Flight-Dedup,
//     Network-Fallback nur bei Cache-Miss
//
// Edge-Cases:
//   - Range-Requests: Antwort kommt aus dem Cache (full body), Browser
//     bekommt das ganze Bild — kein 206, aber kleinere Bilder (< 1 MB)
//     sind sowieso nicht range-anforderungs-relevant.
//   - Zwei parallele Requests für dieselbe URL (z.B. <picture> WebP +
//     <img> JPEG): nur EIN Origin-Fetch, beide Requests bekommen
//     dieselbe Response.

const CACHE_VERSION = 'buzhala-v4';

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
  // WebP-Varianten der Galerie (werden bei install gecacht, damit
  // nach erstem Besuch offline-fähig):
  '/images/vorher-nachher/p01-vorher.webp',
  '/images/vorher-nachher/p01-nachher.webp',
  '/images/vorher-nachher/p02-vorher.webp',
  '/images/vorher-nachher/p02-nachher.webp',
  '/images/vorher-nachher/p03-vorher.webp',
  '/images/vorher-nachher/p03-nachher.webp',
  '/images/vorher-nachher/p04-vorher.webp',
  '/images/vorher-nachher/p04-nachher.webp',
  '/images/vorher-nachher/p05-vorher.webp',
  '/images/vorher-nachher/p05-nachher.webp',
  '/images/vorher-nachher/p06-vorher.webp',
  '/images/vorher-nachher/p06-nachher.webp',
  '/images/vorher-nachher/p07-vorher.webp',
  '/images/vorher-nachher/p07-nachher.webp',
  '/images/vorher-nachher/p08-vorher.webp',
  '/images/vorher-nachher/p08-nachher.webp',
  '/images/vorher-nachher/p09-vorher.webp',
  '/images/vorher-nachher/p09-nachher.webp',
  '/images/vorher-nachher/p10-vorher.webp',
  '/images/vorher-nachher/p10-nachher.webp',
];

// In-Flight-Dedup: parallel eintreffende Requests für dieselbe URL
// teilen sich ein einziges fetch()-Promise. Verhindert, dass Browser
// Pre-Probing + sichtbare <picture>-Sources jeweils einen eigenen
// Origin-Fetch auslösen.
const inflight = new Map();

function cacheKeyFor(request) {
  // URL ohne Query-String, ohne Range-Header. So teilen sich z.B.
  // /foo.webp und /foo.jpg den Cache-Key nicht (verschiedene URLs),
  // aber Range-Requests für dieselbe Datei landen im selben Cache-Slot.
  const url = new URL(request.url);
  return url.origin + url.pathname;
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(CACHE_VERSION)
      .then((cache) => cache.addAll(PRECACHE_URLS).catch(() => null))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Externe Ressourcen (CDN, Worker, Fonts bei Drittanbietern):
  // Network-First, Cache-Fallback.
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(request).catch(() => caches.match(request))
    );
    return;
  }

  // HTML-Navigation: Network-First mit Cache-Fallback.
  if (
    request.mode === 'navigate' ||
    (request.headers.get('accept') || '').includes('text/html')
  ) {
    event.respondWith(
      fetch(request)
        .then((res) => {
          if (res.ok) {
            const clone = res.clone();
            caches.open(CACHE_VERSION).then((c) => c.put(request, clone));
          }
          return res;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match('/index.html'))
        )
    );
    return;
  }

  // Statics (CSS, JS, Bilder, Videos, Fonts): Cache-First + Dedup.
  event.respondWith(handleStatic(request));
});

async function handleStatic(request) {
  const key = cacheKeyFor(request);

  // 1) Cache-Lookup (URL als Key, Query + Range-Header ignoriert)
  const cached = await caches.match(key);
  if (cached) return cached;

  // 2) In-Flight-Dedup: laeuft schon ein Fetch fuer diese URL?
  if (inflight.has(key)) {
    return inflight.get(key);
  }

  // 3) Origin-Fetch mit Cache-Update
  const promise = (async () => {
    try {
      const res = await fetch(request);
      if (res && res.ok) {
        const clone = res.clone();
        caches.open(CACHE_VERSION).then((c) => c.put(key, clone));
      }
      return res;
    } catch (err) {
      // Offline-Fallback fuer Bilder
      if (request.destination === 'image') {
        const fallback = await caches.match('/logo.svg');
        if (fallback) return fallback;
      }
      throw err;
    } finally {
      inflight.delete(key);
    }
  })();

  inflight.set(key, promise);
  return promise;
}