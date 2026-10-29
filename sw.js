const C = "rk-v2";
const FILES = ["./", "./index.html", "https://cdn.jsdelivr.net/npm/jsqr@1.4.0/dist/jsQR.js"];

self.addEventListener("install", e => {
  e.waitUntil(
    caches.open(C)
      .then(c => Promise.all(FILES.map(f => c.add(f).catch(() => {}))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", e => e.waitUntil(self.clients.claim()));

self.addEventListener("fetch", e => {
  e.respondWith(
    caches.match(e.request).then(hit =>
      hit || fetch(e.request).then(res => {
        const copy = res.clone();
        caches.open(C).then(c => c.put(e.request, copy));
        return res;
      }).catch(() => caches.match("./index.html"))
    )
  );
});
