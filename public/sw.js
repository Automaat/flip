const CACHE = "flip-v3";
const PRECACHE = ["/", "/manifest.webmanifest"];

// Only build-immutable assets are safe to serve from cache without a network
// check. Everything else (documents, RSC payloads) must reflect the server.
const STATIC_PREFIXES = ["/_next/static/", "/audio/", "/icons/"];
const STATIC_FILES = new Set([
  "/manifest.webmanifest",
  "/icon.svg",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-192.png",
  "/icon-maskable-512.png",
  "/apple-touch-icon.png",
]);

function isStaticAsset(url) {
  return (
    STATIC_PREFIXES.some((p) => url.pathname.startsWith(p)) ||
    STATIC_FILES.has(url.pathname)
  );
}

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

function cacheFirst(req) {
  return caches.match(req).then(
    (cached) =>
      cached ??
      fetch(req).then((res) => {
        if (res.ok && res.type === "basic") {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      }),
  );
}

function networkFirst(req) {
  return fetch(req)
    .then((res) => {
      if (res.ok && res.type === "basic" && req.mode === "navigate") {
        const clone = res.clone();
        caches.open(CACHE).then((c) => c.put(req, clone));
      }
      return res;
    })
    .catch(() => caches.match(req).then((r) => r ?? caches.match("/")));
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.startsWith("/api/") || url.pathname.startsWith("/_next/data")) {
    event.respondWith(
      fetch(req).catch(() => caches.match(req).then((r) => r ?? new Response("", { status: 503 }))),
    );
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req));
    return;
  }

  // Documents and RSC payloads (router.refresh sends Accept: text/x-component
  // with a ?_rsc= query). A cached RSC payload replays the same review card
  // forever, so these never come from cache while the network is up.
  event.respondWith(networkFirst(req));
});
