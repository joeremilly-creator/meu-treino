// Cache para funcionar offline na academia. Páginas: rede primeiro; demais arquivos: cache primeiro.
const CACHE = 'meutreino-v4';
const ASSETS = ['./', 'index.html', 'style.css', 'app.js', 'exercises.js', 'exercises-extra.js', 'data.js', 'manifest.webmanifest', 'icon.svg',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/4.4.1/chart.umd.min.js'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const local = new URL(e.request.url).origin === location.origin;
  if (local) {
    // rede primeiro para receber atualizações; cai no cache se estiver offline
    e.respondWith(fetch(e.request).then(r => {
      const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })));
  } else {
    e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
  }
});
