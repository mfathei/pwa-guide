importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

workbox.precaching.suppressWarnings();

workbox.routing.registerRoute(/.*(?:googleapis|gstatis)*.$/,
    workbox.strategies.staleWhileRevalidate({
        cacheName: 'google-fonts'
    })
);

workbox.precaching.precacheAndRoute([], {});
