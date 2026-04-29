const CACHE_NAME = ‘evryone-v1’;
const ASSETS = [
‘/’,
‘/tracker.html’,
‘https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap’
];

self.addEventListener(‘install’, function(e) {
e.waitUntil(
caches.open(CACHE_NAME).then(function(cache) {
return cache.addAll(ASSETS.filter(a => !a.startsWith(‘http’) || a.includes(‘fonts’)));
})
);
self.skipWaiting();
});

self.addEventListener(‘activate’, function(e) {
e.waitUntil(
caches.keys().then(function(keys) {
return Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)));
})
);
self.clients.claim();
});

self.addEventListener(‘fetch’, function(e) {
// Stratégie: network first, fallback cache
e.respondWith(
fetch(e.request).then(function(res) {
var clone = res.clone();
caches.open(CACHE_NAME).then(function(cache) {
if (e.request.method === ‘GET’) cache.put(e.request, clone);
});
return res;
}).catch(function() {
return caches.match(e.request);
})
);
});
