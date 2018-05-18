importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");
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