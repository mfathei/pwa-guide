importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

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

workbox.precaching.precacheAndRoute([], {});
