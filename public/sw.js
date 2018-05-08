
self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...');
	return self.clients.claim();
});

self.addEventListener('fetch', function(event){
	event.respondWith(fetch(event.request));
});
