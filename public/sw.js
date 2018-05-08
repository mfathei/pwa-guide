
self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
	event.waitUntil(caches.open('static-v3').then(function(cache){
			console.log('[Service Worker] Precaching the App Shell...');
			cache.addAll([
				'/',
				'/index.html',
				'/src/js/feed.js',
				'/src/js/promise.js',
				'/src/js/fetch.js',
				'/src/js/app.js',
				'/src/js/material.min.js',
				'/src/css/feed.css',
				'/src/css/app.css',
				'/src/images/main-image.jpg',
				"https://fonts.googleapis.com/css?family=Roboto:400,700",
				"https://fonts.googleapis.com/icon?family=Material+Icons",
				"https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css"
			]);
		})
	);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...');
	event.waitUntil(
		caches.keys()
		.then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if(key !== 'static-v3' && key !== 'dynamic'){
					console.log('[Service Worker] Deleting old cache ', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

self.addEventListener('fetch', function(event){
	event.respondWith(
		caches.match(event.request)
		 .then(function(response){
		 	if(response){
		 		return response;
		 	}

		 	return fetch(event.request)
	 		.then(function(res){
	 			return caches.open('dynamic')
 				.then(function(cache){
 					cache.put(event.request.url, res.clone());
 					return res;
 				})
		 	})
		 	.catch(function(err){

		 	});
		 })
	);
});
