const CACHE_NAME = "image-cache-v1";
const IMAGES_TO_CACHE = [
  "imgs/wallpapers/dark.jpg",
  "imgs/wallpapers/white.jpg",
  "imgs/wallpapers/red.jpg",
  "imgs/wallpapers/orange.jpg",
  "imgs/wallpapers/yellow.jpg",
  "imgs/wallpapers/green.jpg",
  "imgs/wallpapers/blue.jpg",
  "imgs/wallpapers/purple.jpg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache");
      return cache.addAll(IMAGES_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});