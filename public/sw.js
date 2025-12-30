/*
 * Simple service worker to enable offline caching and app-shell behaviour.
 * It caches the application shell and static assets on install and
 * responds to fetch events with a network‑first strategy, falling back
 * to the cached resources when offline. This file is loaded from
 * `/` and registered in the client side. No external libraries are used.
 */

// Updated cache name to bust old versions when assets change. When you
// modify the list below ensure you also bump this version to avoid
// serving stale resources.
const CACHE_NAME = 'premium-restaurant-cache-v3';

// Application shell resources. These are files that are required for the
// app to run offline. The list includes the manifest, logo, PWA icons
// and all static images (hero, owner, story and gallery) from the assets
// folder. Menu data is also cached to support offline browsing of the
// menu. Do not remove any entry without updating the corresponding
// assets in /public.
const APP_SHELL = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/menu.json',
  '/icons/icon-512.png',
  '/icons/icon-192.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  // hero and supporting artwork
  '/assets/hero/hero-poster.webp',
  '/assets/hero/hero-poster-tablet.webp',
  '/assets/hero/hero-poster-mobile.webp',
  // founder and story images
  '/assets/owner/owner.webp',
  '/assets/story/story.webp',
  // gallery images
  '/assets/gallery/Avocado.webp',
  '/assets/gallery/Cheese.webp',
  '/assets/gallery/Chicken.webp',
  '/assets/gallery/Lemon Mint.webp',
  '/assets/gallery/Margherita.webp',
  '/assets/gallery/Meat.webp',
  '/assets/gallery/Mixed.webp',
  '/assets/gallery/Orange.webp',
  '/assets/gallery/Pineapple.webp',
  '/assets/gallery/Pomegranate.webp',
  '/assets/gallery/Watermelon.webp',
  '/assets/gallery/Zaatar.webp',
  '/assets/gallery/arabic_chicken.webp',
  '/assets/gallery/arabic_meat.webp',
  '/assets/gallery/arays.webp',
  '/assets/gallery/baba.webp',
  '/assets/gallery/biryani.webp',
  '/assets/gallery/bread.webp',
  '/assets/gallery/chicken_machine.webp',
  '/assets/gallery/chops.webp',
  '/assets/gallery/coffee.webp',
  '/assets/gallery/drinks.webp',
  '/assets/gallery/eggs.webp',
  '/assets/gallery/fattoush.webp',
  '/assets/gallery/foul.webp',
  '/assets/gallery/grills_kilo.webp',
  '/assets/gallery/halloumi.webp',
  '/assets/gallery/hummus.webp',
  '/assets/gallery/juice.webp',
  '/assets/gallery/kabab.webp',
  '/assets/gallery/kabab_chicken.webp',
  '/assets/gallery/kibbeh.webp',
  '/assets/gallery/manakish.webp',
  '/assets/gallery/masgouf.webp',
  '/assets/gallery/mixed_grills.webp',
  '/assets/gallery/pizza.webp',
  '/assets/gallery/placeholder.webp',
  '/assets/gallery/qass_chicken.webp',
  '/assets/gallery/qass_meat.webp',
  '/assets/gallery/qozi.webp',
  '/assets/gallery/salad.webp',
  '/assets/gallery/sarookh_chicken.webp',
  '/assets/gallery/sarookh_meat.webp',
  '/assets/gallery/shish_tawook.webp',
  '/assets/gallery/tabouleh.webp',
  '/assets/gallery/tea.webp',
  '/assets/gallery/tikka.webp'
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
  // Do not handle Next.js internal assets or build files
  const url = new URL(request.url);
  if (url.pathname.startsWith('/_next/')) {
    // Always prefer network for Next assets and do not cache them here
    event.respondWith(fetch(request));
    return;
  }

  // For navigation requests, do not intercept; let the browser handle them
  if (request.mode === 'navigate') {
    event.respondWith(fetch(request));
    return;
  }

  // For other requests use network-first but avoid caching HTML/navigation and _next
  event.respondWith(
    fetch(request)
      .then(response => {
        try {
          // Only cache successful, non-opaque responses for same-origin (images, JSON, etc.)
          const contentType = response && response.headers ? response.headers.get('content-type') : '';
          if (response && response.ok && !contentType?.includes('text/html')) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(cache => cache.put(request, clone));
          }
        } catch (e) {
          // ignore caching errors
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});