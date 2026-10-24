// Service Worker for PWA
const CACHE_NAME = 'ahmedemam-portfolio-v7';
const urlsToCache = [
  '/',
  '/assets/css/style.css',
  '/assets/js/globe.js',
  '/assets/js/resume.js',
  '/assets/data/land.json'
];

// Install event - cache resources
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', function(event) {
  // Pages: network first so deploys show up, cache only as an offline fallback
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(function() { return caches.match(event.request).then(function(r) { return r || caches.match('/'); }); })
    );
    return;
  }
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

