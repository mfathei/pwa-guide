// importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");
importScripts("workbox-sw.js");
importScripts('/src/js/idb.js');
importScripts('/src/js/utility.js');

workbox.precaching.suppressWarnings();

workbox.routing.registerRoute(/.*(?:googleapis|gstatic)\.com.*$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts',
        plugins: [
            new workbox.expiration.Plugin({
                // Only cache requests for a week
                maxAgeSeconds: 7 * 24 * 60 * 60,
                // Only cache 3 requests.
                maxEntries: 3,
            }),
        ]
    })
);

workbox.routing.registerRoute('https://cdnjs.cloudflare.com/ajax/libs/material-design-lite/1.3.0/material.indigo-pink.min.css',
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'material-css'
    })
);

workbox.routing.registerRoute(new RegExp('/photos/'),
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'post-images'
    })
);

workbox.routing.registerRoute('http://localhost:3000/api/posts', function(args) {
    return fetch(args.event.request)
        .then(function(res) {
            var clonedRes = res.clone();
            clearAllData('posts')
                .then(function() {
                    return clonedRes.json();
                })
                .then(function(data) {
                    for (var key in data) {
                        writeData('posts', data[key]);
                    }
                });

            return res;
        });
});

workbox.routing.registerRoute(function(routeData) {
    return (routeData.event.request.headers.get('accept').includes('text/html'));
}, function(args) {
    return caches.match(args.event.request)
        .then(function(response) {
            if (response) {
                return response;
            }

            return fetch(args.event.request)
                .then(function(res) {
                    return caches.open('dynamic')
                        .then(function(cache) {
                            // trimCache(CACHE_DYNAMIC_NAME, 3);
                            cache.put(args.event.request.url, res.clone());
                            return res;
                        })
                })
                .catch(function(err) {
                    return caches.match('/offline.html')
                        .then(function(cache) {
                            return cache
                        });
                });
        });
});

workbox.precaching.precacheAndRoute([
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "index.html",
    "revision": "d11fe1ffe8e1c6ad38c34c19dc0107ad"
  },
  {
    "url": "manifest.json",
    "revision": "f077c5770946dd0d15624b74864066a2"
  },
  {
    "url": "offline.html",
    "revision": "31aebb8c2e687a9607af7842ebf8c2c4"
  },
  {
    "url": "src/css/app.css",
    "revision": "f27b4d5a6a99f7b6ed6d06f6583b73fa"
  },
  {
    "url": "src/css/feed.css",
    "revision": "cc25c646c8a7dba4a5325060559139c5"
  },
  {
    "url": "src/css/help.css",
    "revision": "1c6d81b27c9d423bece9869b07a7bd73"
  },
  {
    "url": "src/images/main-image-lg.jpg",
    "revision": "31b19bffae4ea13ca0f2178ddb639403"
  },
  {
    "url": "src/images/main-image-sm.jpg",
    "revision": "c6bb733c2f39c60e3c139f814d2d14bb"
  },
  {
    "url": "src/images/main-image.jpg",
    "revision": "5c66d091b0dc200e8e89e56c589821fb"
  },
  {
    "url": "src/images/sf-boat.jpg",
    "revision": "0f282d64b0fb306daf12050e812d6a19"
  },
  {
    "url": "src/js/app.min.js",
    "revision": "f9541a75e0d51bc880c42d7541872f27"
  },
  {
    "url": "src/js/feed.min.js",
    "revision": "6b9d2dce861c3f158a4b1f239f3db18c"
  },
  {
    "url": "src/js/fetch.min.js",
    "revision": "1774c2ffd0251d8d2f5adcd8560f29d1"
  },
  {
    "url": "src/js/idb.min.js",
    "revision": "924766e264b1da064bc537de17d68394"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.min.js",
    "revision": "e510f164f52c6e2cee972a2318040f60"
  },
  {
    "url": "src/js/utility.min.js",
    "revision": "0bc9f6fb8915e3d185553c884dcb545f"
  }
], {});

self.addEventListener('sync', function(event) {
    console.log('[Service Worker] Background syncing', event);
    if (event.tag === 'sync-new-posts') {
        console.log('[Service Worker] Syncing new Posts');
        event.waitUntil(
            readAllData('sync-posts')
            .then(function(data) {
                console.log('sync-posts');
                for (var dt of data) {
                    var postData = new FormData();
                    postData.append('id', dt.id);
                    postData.append('title', dt.title);
                    postData.append('location', dt.location);
                    postData.append('rawLocationLat', dt.rawLocation.lat);
                    postData.append('rawLocationLng', dt.rawLocation.lng);
                    postData.append('file', dt.picture, dt.id + '.png');

                    fetch('http://localhost:3000/api/posts', {
                            method: 'POST',
                            body: postData
                        })
                        .then(function(res) {
                            console.log('Sent data', res);
                            if (res.ok) {
                                res.json()
                                    .then(function(resData) {
                                        deleteDataItem('sync-posts', resData.id);
                                    });
                            }
                        })
                        .catch(function(err) {
                            console.log('Error while sending data', err);
                        });
                }

            })
        );
    }
});

self.addEventListener('notificationclick', function(event) {
    var notification = event.notification;
    var action = event.action;

    if (action === 'confirm') {
        console.log('Confirm clicked');
        notification.close();
    } else {
        console.log(action);
        event.waitUntil(
            clients.matchAll()
            .then(function(clis) {
                var client = clis.find(function(c) {
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

self.addEventListener('notificationclose', function(event) {
    console.log('Notification closed', event);
});

self.addEventListener('push', function(event) {
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