
self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
	event.waitUntil(caches.open('static').then(function(cache){
			console.log('[Service Worker] Precaching the App Shell...');
			cache.add('/src/js/app.js');
		})
	);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...');
	return self.clients.claim();
});

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)
		 .then(function(response){
		 	if(response){
		 		return response;
		 	}

		 	return fetch(event.request);
		 })
	);
});
