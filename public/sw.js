importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');
var CACHE_STATIC_NAME = 'static-v1';
var CACHE_DYNAMIC_NAME = 'dynamic-v1';
var STATIC_FILES = [
    '/',
    '/index.html',
    '/offline.html',
    '/src/js/app.js',
    '/src/js/feed.js',
    '/src/js/idb.js',
    '/src/js/promise.js',
    '/src/js/fetch.js',
    '/src/js/utility.js',
    '/src/js/material.min.js',
    '/src/css/app.css',
    '/src/css/feed.css',
    '/src/images/main-image.jpg',
    'https://fonts.googleapis.com/css?family=Roboto:400,700',
    'https://fonts.googleapis.com/icon?family=Material+Icons',
    'https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css'
];


function isInArray(string, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (string === arr[i]) {
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

self.addEventListener('install', function (event) {
    console.log('[Service Worker] Installing service worker...', event);
    event.waitUntil(
        caches.open(CACHE_STATIC_NAME)
            .then(function (cache) {
                console.log('[Service Worker] Precaching the App Shell...');
                cache.addAll(STATIC_FILES);
            })
    );
});

self.addEventListener('activate', function (event) {
    console.log('[Service Worker] Activating service worker...');
    event.waitUntil(
        caches.keys()
            .then(function (keyList) {
                return Promise.all(keyList.map(function (key) {
                    if (key !== CACHE_STATIC_NAME && key !== CACHE_DYNAMIC_NAME) {
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

self.addEventListener('fetch', function (event) {
    // var url = 'https://pwa-guide.firebaseio.com/posts.json'; // get request
    var url = 'http://localhost:3000/api/posts'; // get request
    if (event.request.url.indexOf(url) > -1) {
        event.respondWith(
            fetch(event.request)
                .then(function (res) {
                    var clonedRes = res.clone();
                    clearAllData('posts')
                        .then(function () {
                            return clonedRes.json();
                        })
                        .then(function (data) {
                            for (var key in data) {
                                writeData('posts', data[key]);
                            }
                        });

                    return res;
                })
        );
    } else if (isInArray(event.request.url, STATIC_FILES)) {
        console.log(event.request.url);
        event.respondWith(
            caches.match(event.request)
        );
    } else {
        event.respondWith(
            caches.match(event.request)
                .then(function (response) {
                    if (response) {
                        return response;
                    }

                    return fetch(event.request)
                        .then(function (res) {
                            return caches.open(CACHE_DYNAMIC_NAME)
                                .then(function (cache) {
                                    // trimCache(CACHE_DYNAMIC_NAME, 3);
                                    cache.put(event.request.url, res.clone());
                                    return res;
                                })
                        })
                        .catch(function (err) {
                            return caches.open(CACHE_STATIC_NAME)
                                .then(function (cache) {
                                    if (event.request.headers.get('accept').includes('text/html')) {
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


self.addEventListener('sync', function (event) {
    console.log('[Service Worker] Background syncing', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[Service Worker] Syncing new Posts');
        event.waitUntil(
            readAllData('sync-posts')
                .then(function (data) {
                    for (var dt of data) {
                        var postData = new FormData();
                        postData.append('id', dt.id);
                        postData.append('title', dt.title);
                        postData.append('location', dt.location);
                        postData.append('file', dt.picture, dt.id + '.png');

                        fetch('http://localhost:3000/api/posts', {
                            method: 'POST',
                            body: postData
                        })
                            .then(function (res) {
                                console.log('Sent data', res);
                                if (res.ok) {
                                    res.json()
                                        .then(function (resData) {
                                            daleteDataItem('sync-posts', resData.id);
                                        });
                                }
                            })
                            .catch(function (err) {
                                console.log('Error while sending data', err);
                            });
                    }

                })
        );
    }
});

self.addEventListener('notificationclick', function (event) {
    var notification = event.notification;
    var action = event.action;

    if (action === 'confirm') {
        console.log('Confirm clicked');
        notification.close();
    } else {
        console.log(action);
        event.waitUntil(
            clients.matchAll()
                .then(function (clis) {
                    var client = clis.find(function (c) {
                        return c.visibilityState === 'visible';
                    });

                    if (client) {
                        client.navigate(notification.data.url);
                        client.focus();
                    } else {
                        clients.openWindow(notification.data.url);
                    }
                    notification.close();
                })
        );
    }
});

self.addEventListener('notificationclose', function (event) {
    console.log('Notification closed', event);
});

self.addEventListener('push', function (event) {
    console.log('Push notification received', event);

    var data = {
        title: "New!",
        content: "New content",
        openUrl: "/"
    };

    if (event.data) {
        data = JSON.parse(event.data.text());
    }

    var options = {
        body: data.content,
        icon: '/src/images/icons/app-icon-96x96.png',
        badge: '/src/images/icons/app-icon-96x96.png',
        data: {
            url: data.openUrl
        }
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});