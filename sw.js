/* Master Trainer offline worker.
   - On install it saves every page, image and the 3D + Python engines, so the app opens with no internet.
   - Online: this app's own pages and scripts always come fresh from the server (network first),
     so updates show up the first time you open the app. Offline: the saved copy is used.
   - Bump VERSION whenever the files change. */
const VERSION = 'mt-2026-11-27c';
const LOCAL = [
  './', 'index.html', 'hub.html', 'classic.html', 'nav.js', 'mt-world.js', 'theme.css', 'manifest.webmanifest', 'mt-progress.js', 'cc-skin.css', 'cc-skin.js', 'mt-voice.js', 'mt-board.js',
  'fde-lab.html', 'python-output.html', 'math-placement.html', 'ai-business.html', 'ethics-octagon.html', 'english-writing.html',
  'miami-backdrop.svg', 'bg-home.jpg', 'bg-fde.jpg', 'bg-python.jpg', 'bg-math.jpg', 'bg-business.jpg', 'bg-ethics.jpg',
  'card-fde.jpg', 'card-python.jpg', 'card-math.jpg', 'card-business.jpg', 'card-ethics.jpg',
  'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png', 'favicon-48.png'
];
const THREE = 'https://cdn.jsdelivr.net/npm/three@0.170.0/';
const REMOTE = [
  THREE + 'build/three.module.min.js',
  ...['postprocessing/EffectComposer.js', 'postprocessing/MaskPass.js', 'postprocessing/OutputPass.js', 'postprocessing/Pass.js',
    'postprocessing/RenderPass.js', 'postprocessing/ShaderPass.js', 'postprocessing/UnrealBloomPass.js', 'objects/Reflector.js',
    'environments/RoomEnvironment.js', 'controls/OrbitControls.js', 'shaders/CopyShader.js', 'shaders/LuminosityHighPassShader.js', 'shaders/OutputShader.js']
    .map(f => THREE + 'examples/jsm/' + f),
  'https://cdn.jsdelivr.net/npm/brython@3.14.3/brython.min.js',
  'https://cdn.jsdelivr.net/npm/brython@3.14.3/brython_stdlib.js'
];
const SAVE_FROM = ['cdn.jsdelivr.net', 'fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(VERSION);
    await c.addAll(LOCAL.map(u => new Request(u, { cache: 'reload' })));  // skip the browser's HTTP cache
    // outside files: save each one on its own so one hiccup doesn't block the install
    await Promise.all(REMOTE.map(u => fetch(u, { mode: 'cors' }).then(r => r.ok && c.put(u, r)).catch(() => {})));
    self.skipWaiting();
  })());
});

self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== VERSION) await caches.delete(k);
    await self.clients.claim();
  })());
});

// the page can hand over the outside files it loaded (fonts) so they work offline too
self.addEventListener('message', e => {
  const list = e.data && e.data.save;
  if (!Array.isArray(list)) return;
  e.waitUntil(caches.open(VERSION).then(c => Promise.all(list
    .filter(u => SAVE_FROM.some(h => u.includes(h)))
    .map(u => c.match(u).then(hit => hit || fetch(u, { mode: 'cors' }).then(r => r.ok && c.put(u, r))).catch(() => {})))));
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  const local = url.origin === self.location.origin;
  if (!local && !SAVE_FROM.includes(url.hostname)) return;
  e.respondWith((async () => {
    const c = await caches.open(VERSION);
    const key = local ? url.pathname.endsWith('/') ? url.pathname + 'index.html' : req.url.split('#')[0].split('?')[0] : req.url;
    const hit = await c.match(key) || await c.match(req, { ignoreSearch: local });
    const fresh = fetch(local ? new Request(req.url, { cache: 'no-cache', credentials: 'same-origin' }) : req)
      .then(r => { if (r && (r.ok || r.type === 'opaque')) c.put(key, r.clone()); return r; }).catch(() => null);
    if (hit && !local) { e.waitUntil(fresh); return hit; }            // fonts and engines: saved copy first
    if (hit) {                                                        // app files: fresh copy first, saved copy if slow or offline
      const r = await Promise.race([fresh, new Promise(ok => setTimeout(() => ok(null), 4000))]);
      if (r && r.ok) return r;
      e.waitUntil(fresh); return hit;
    }
    const r = await fresh;
    if (r) return r;
    if (req.mode === 'navigate') return (await c.match(new URL('index.html', self.registration.scope).href)) || Response.error();
    return Response.error();
  })());
});
