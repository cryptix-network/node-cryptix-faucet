const CACHE_NAME = `cryptix-cache-v3-${new Date().toISOString()}`;
const URLs_TO_CACHE = [
  '/', 
  '/index.html', 
  '/service-worker.js', 
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker installed');
  
  // Skip waiting to activate immediately
  self.skipWaiting();
  
  // Cache essential files during installation
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching essential files');
        return cache.addAll(URLs_TO_CACHE);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker activated');
  
  // Claim clients to take control of open tabs
  self.clients.claim();
  
  // Delete old cache versions
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Redirect
  event.respondWith(
    fetch(event.request).catch((error) => {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: 'Network request failed' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    })
  );
});
