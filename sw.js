const CACHE_NAME = 'tachyon-v30';
const ASSETS = [
  './',
  './index.html',
  './assets/css/ios14.css?v=30',
  './assets/css/modern.css?v=28',
  './assets/js/modern-app.js?v=30',
  './assets/js/rsvp.js',
  './assets/js/audio.js',
  './assets/js/data.js',
  './assets/js/storage.js',
  './manifest.json',
  './assets/icons/icon.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network-first strategy for freshness, falling back to cache if offline
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // If successful network response, clone and update cache
        if (response && response.status === 200 && response.type === 'basic') {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
