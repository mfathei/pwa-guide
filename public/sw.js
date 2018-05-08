importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');
var CACHE_STATIC_NAME = 'static-v4';
var CACHE_DYNAMIC_NAME = 'dynamic-v2';
var STATIC_FILES = [
				'/',
				'/index.html',
				'/offline.html',
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
			];


function isInArray(string, arr){
	for(var i = 0; i < arr.length; i++){
		if(string === arr[i]){
			return true;
		}
	}

	return false;
}

// function trimCache(cacheName, maxItems){
// 	caches.open(cacheName)
// 	.then(function(cache){
// 		return cache.keys()
// 		.then(function(keys){
// 			if(keys.length > maxItems){
// 				cache.delete(keys[0])
// 				.then(trimCache(cacheName, maxItems));
// 			}
// 		});
// 	});
// }

self.addEventListener('install', function(event){
	console.log('[Service Worker] Installing service worker...', event);
	event.waitUntil(caches.open(CACHE_STATIC_NAME).then(function(cache){
			console.log('[Service Worker] Precaching the App Shell...');
			cache.addAll(STATIC_FILES);
		})
	);
});

self.addEventListener('activate', function(event){
	console.log('[Service Worker] Activating service worker...');
	event.waitUntil(
		caches.keys()
		.then(function(keyList){
			return Promise.all(keyList.map(function(key){
				if(key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME){
					console.log('[Service Worker] Deleting old cache ', key);
					return caches.delete(key);
				}
			}));
		})
	);
	return self.clients.claim();
});

// cache - network
// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		caches.match(event.request)
// 		 .then(function(response){
// 		 	if(response){
// 		 		return response;
// 		 	}

// 		 	return fetch(event.request)
// 	 		.then(function(res){
// 	 			return caches.open(CACHE_DYNAMIC_NAME)
//  				.then(function(cache){
//  					cache.put(event.request.url, res.clone());
//  					return res;
//  				})
// 		 	})
// 		 	.catch(function(err){
// 		 		return caches.open(CACHE_STATIC_NAME)
// 		 		.then(function(cache){
// 		 			return cache.match('/offline.html');
// 		 		});
// 		 	});
// 		 })
// 	);
// });

self.addEventListener('fetch', function(event){
	var url = 'https://pwa-guide.firebaseio.com/posts.json';
	if(event.request.url.indexOf(url) > -1){
		event.respondWith(
			fetch(event.request)
			.then(function(res){
				var clonedRes = res.clone();
				clonedRes.json()
				.then(function(data){
					for(var key in data){
						writeData('posts', data[key]);
					}
				});

				return res;
			})
		);
	} else if (isInArray(event.request.url, STATIC_FILES)){
		console.log(event.request.url);
		event.respondWith(
			caches.match(event.request)
		);
	} else {
		event.respondWith(
			caches.match(event.request)
			 .then(function(response){
			 	if(response){
			 		return response;
			 	}

			 	return fetch(event.request)
		 		.then(function(res){
		 			return caches.open(CACHE_DYNAMIC_NAME)
	 				.then(function(cache){
	 					// trimCache(CACHE_DYNAMIC_NAME, 3);
	 					cache.put(event.request.url, res.clone());
	 					return res;
	 				})
			 	})
			 	.catch(function(err){
			 		return caches.open(CACHE_STATIC_NAME)
			 		.then(function(cache){
			 			if(event.request.headers.get('accept').includes('text/html')){
			 				return cache.match('/offline.html');
			 			}
			 		});
			 	});
			 })
		);
	}
});

// netwok -cache
// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		fetch(event.request)
// 		.then(function(res){
// 			return caches.open(CACHE_DYNAMIC_NAME)
// 				.then(function(cache){
// 					cache.put(event.request.url, res.clone());
// 					return res;
// 				});
// 		})
// 		.catch(function(err){
// 			return caches.match(event.request)
// 		})
// 	)
// });

// Cache-only
// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		caches.match(event.request)
// 	);
// });

// Network-only
// self.addEventListener('fetch', function(event){
// 	event.respondWith(
// 		fetch(event.request)
// 	);
// });