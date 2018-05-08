
self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...');
	return self.clients.claim();
});

self.addEventListener('fetch', function(event){
	console.log('[Service Worker] Fetching something...');
	event.respondWith(fetch(event.request));
});

self.addEventListener('beforeinstallprompt', function(event){
	console.log('beforeinstallprompt fired');
	event.preventDefault();
	defferedPrompt = event;
	return false;
});