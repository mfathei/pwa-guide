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

workbox.precaching.precacheAndRoute([], {});

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