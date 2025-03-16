const CACHE_NAME = "image-cache-v1";
const IMAGES_TO_CACHE = [ // the webp files were there, why weren't we using them?
  "imgs/wallpapers/dark.webp",
  "imgs/wallpapers/white.webp",
  "imgs/wallpapers/red.webp",
  "imgs/wallpapers/orange.webp",
  "imgs/wallpapers/yellow.webp",
  "imgs/wallpapers/green.webp",
  "imgs/wallpapers/blue.webp",
  "imgs/wallpapers/purple.webp",
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