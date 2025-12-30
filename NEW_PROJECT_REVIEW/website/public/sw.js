/*
 * Simple service worker to enable offline caching and app-shell behaviour.
 * It caches the application shell and static assets on install and
 * responds to fetch events with a network‑first strategy, falling back
 * to the cached resources when offline. This file is loaded from
 * `/` and registered in the client side. No external libraries are used.
 */

const CACHE_NAME = 'premium-restaurant-cache-v2';
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/hero.webp',
  '/story.webp',
  '/founder.webp',
  '/menu.json',
  '/icons/icon-512.png',
  '/icons/icon-256x256.png',
  '/icons/icon-192.png',
  '/icons/icon-128x128.png',
  '/icons/icon-64x64.png',
  '/icons/icon-32x32.png',
  '/icons/icon-16x16.png'
];

self.addEventListener('install', event => {
  // Precache the application shell
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  // Clean up old caches if necessary
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Network‑first fetch handler with cache fallback
self.addEventListener('fetch', event => {
  const { request } = event;
  // Only handle GET requests
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then(response => {
        // Successful response, update the cache
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
        return response;
      })
      .catch(() => {
        // On failure, try to match in cache
        return caches.match(request).then(cached => {
          if (cached) return cached;
          // If not found and it's a navigation request, serve the app shell
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          return undefined;
        });
      })
  );
});