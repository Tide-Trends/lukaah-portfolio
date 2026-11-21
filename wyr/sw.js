/* Line Brain offline cache: stale-while-revalidate. Bump VERSION when shipping. */
const VERSION = "lb-v2";
const PRECACHE = [
  "/wyr/",
  "/wyr/core.js",
  "/wyr/games/emoji.js",
  "/wyr/games/fingerpick.js",
  "/wyr/games/fiveseconds.js",
  "/wyr/games/forbidden.js",
  "/wyr/games/forehead.js",
  "/wyr/games/guesstimate.js",
  "/wyr/games/hotpotato.js",
  "/wyr/games/imposter.js",
  "/wyr/games/prompts.js",
  "/wyr/games/quickdraw.js",
  "/wyr/games/sketch.js",
  "/wyr/games/trivia.js",
  "/wyr/games/wyr.js",
  "/wyr/manifest.webmanifest",
  "/wyr/icon-192.png",
  "/wyr/icon-512.png",
  "/wyr/icon-180.png",
];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
// Same-origin: network first (fresh after deploys), cache if offline or slow (> 2.5 s).
// Fonts: cache first.
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  const same = url.origin === self.location.origin && url.pathname.startsWith("/wyr");
  const font = url.hostname === "fonts.googleapis.com" || url.hostname === "fonts.gstatic.com";
  if (!same && !font) return;
  e.respondWith((async () => {
    const cache = await caches.open(VERSION);
    const key = same ? url.origin + url.pathname : req;
    const cached = () => cache.match(key, { ignoreSearch: same }).then((r) => r || (req.mode === "navigate" ? cache.match("/wyr/") : undefined));
    const net = fetch(req).then((res) => { if (res && (res.ok || res.type === "opaque")) cache.put(key, res.clone()); return res; });
    if (font) { const hit = await cached(); if (hit) return hit; return net; }
    e.waitUntil(net.catch(() => {}));
    const slow = new Promise((r) => setTimeout(r, 2500)).then(cached);
    try {
      const res = await Promise.race([net, slow.then((r) => r || net)]);
      return res || (await net);
    } catch {
      const hit = await cached();
      if (hit) return hit;
      throw new Error("offline");
    }
  })());
});
