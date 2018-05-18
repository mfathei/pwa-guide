/**
 * Welcome to your Workbox-powered service worker!
 *
 * You'll need to register this file in your web app and you should
 * disable HTTP caching for this file too.
 * See https://goo.gl/nhQhGp
 *
 * The rest of the code is auto-generated. Please don't update this file
 * directly; instead, make changes to your Workbox build configuration
 * and re-run your build process.
 * See https://goo.gl/2aRDsh
 */

importScripts("https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js");

/**
 * The workboxSW.precacheAndRoute() method efficiently caches and responds to
 * requests for URLs in the manifest.
 * See https://goo.gl/S9QRab
 */
self.__precacheManifest = [
  {
    "url": "404.html",
    "revision": "0a27a4163254fc8fce870c8cc3a3f94f"
  },
  {
    "url": "favicon.ico",
    "revision": "2cab47d9e04d664d93c8d91aec59e812"
  },
  {
    "url": "help/index.html",
    "revision": "dc560e20c2548e6abbbd7df55d90d9bb"
  },
  {
    "url": "index.html",
    "revision": "15c86ddff6c6fcc73be814e8ea6c650c"
  },
  {
    "url": "manifest.json",
    "revision": "f077c5770946dd0d15624b74864066a2"
  },
  {
    "url": "offline.html",
    "revision": "4f61a78003a2fa64325ac214716d7f8f"
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
    "url": "src/images/icons/app-icon-144x144.png",
    "revision": "83011e228238e66949f0aa0f28f128ef"
  },
  {
    "url": "src/images/icons/app-icon-192x192.png",
    "revision": "f927cb7f94b4104142dd6e65dcb600c1"
  },
  {
    "url": "src/images/icons/app-icon-256x256.png",
    "revision": "86c18ed2761e15cd082afb9a86f9093d"
  },
  {
    "url": "src/images/icons/app-icon-384x384.png",
    "revision": "fbb29bd136322381cc69165fd094ac41"
  },
  {
    "url": "src/images/icons/app-icon-48x48.png",
    "revision": "45eb5bd6e938c31cb371481b4719eb14"
  },
  {
    "url": "src/images/icons/app-icon-512x512.png",
    "revision": "d42d62ccce4170072b28e4ae03a8d8d6"
  },
  {
    "url": "src/images/icons/app-icon-96x96.png",
    "revision": "56420472b13ab9ea107f3b6046b0a824"
  },
  {
    "url": "src/images/icons/apple-icon-114x114.png",
    "revision": "74061872747d33e4e9f202bdefef8f03"
  },
  {
    "url": "src/images/icons/apple-icon-120x120.png",
    "revision": "abd1cfb1a51ebe8cddbb9ada65cde578"
  },
  {
    "url": "src/images/icons/apple-icon-144x144.png",
    "revision": "b4b4f7ced5a981dcd18cb2dc9c2b215a"
  },
  {
    "url": "src/images/icons/apple-icon-152x152.png",
    "revision": "841f96b69f9f74931d925afb3f64a9c2"
  },
  {
    "url": "src/images/icons/apple-icon-180x180.png",
    "revision": "2e5e6e6f2685236ab6b0c59b0faebab5"
  },
  {
    "url": "src/images/icons/apple-icon-57x57.png",
    "revision": "cc93af251fd66d09b099e90bfc0427a8"
  },
  {
    "url": "src/images/icons/apple-icon-60x60.png",
    "revision": "18b745d372987b94d72febb4d7b3fd70"
  },
  {
    "url": "src/images/icons/apple-icon-72x72.png",
    "revision": "b650bbe358908a2b217a0087011266b5"
  },
  {
    "url": "src/images/icons/apple-icon-76x76.png",
    "revision": "bf10706510089815f7bacee1f438291c"
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
    "url": "src/js/app.js",
    "revision": "5f5775477fc892777756bd943c4ec787"
  },
  {
    "url": "src/js/feed.js",
    "revision": "e82f0119accffb0563b2dc7d27b210c4"
  },
  {
    "url": "src/js/fetch.js",
    "revision": "6b82fbb55ae19be4935964ae8c338e92"
  },
  {
    "url": "src/js/idb.js",
    "revision": "017ced36d82bea1e08b08393361e354d"
  },
  {
    "url": "src/js/material.min.js",
    "revision": "713af0c6ce93dbbce2f00bf0a98d0541"
  },
  {
    "url": "src/js/promise.js",
    "revision": "10c2238dcd105eb23f703ee53067417f"
  },
  {
    "url": "src/js/utility.js",
    "revision": "bce7d2f6a9a051879427e0f7f6803f57"
  },
  {
    "url": "sw.js",
    "revision": "1d54b13b6d64f8314bb5a5fb1f5d916d"
  },
  {
    "url": "upload/photos/2018-05-16T05:23:37.112Z.png",
    "revision": "eb5e7ef76cce35412b66ca369b4bacb0"
  },
  {
    "url": "upload/photos/2018-05-17T18:05:01.744Z.png",
    "revision": "085526d33266e8d815bca8c76a8d19d1"
  },
  {
    "url": "upload/photos/2018-05-17T18:07:54.759Z.png",
    "revision": "970ef53506064a0a2faa6c02e913aa9a"
  },
  {
    "url": "upload/photos/2018-05-17T18:10:45.647Z.png",
    "revision": "fe2dd84b9f7e2ad8633420244ed2d401"
  },
  {
    "url": "upload/photos/2018-05-17T20:38:33.874Z.png",
    "revision": "e3522736ca7fa936f72afae4d0d3cfb5"
  },
  {
    "url": "upload/photos/2018-05-17T20:42:33.846Z.png",
    "revision": "f7ef53344d5afdae34c3dc5c9721cd20"
  },
  {
    "url": "upload/photos/2018-05-17T21:36:49.449Z.png",
    "revision": "d8e846227c5c7cb273c3f03921fae799"
  },
  {
    "url": "upload/photos/2018-05-17T21:41:03.969Z.png",
    "revision": "73ab25c5367e3a07d26a8a8f37620ba9"
  },
  {
    "url": "upload/photos/2018-05-17T21:45:34.798Z.png",
    "revision": "1c13ebddf59129de73832de3800013c8"
  },
  {
    "url": "upload/photos/2018-05-17T22:11:43.429Z.png",
    "revision": "e2e98a58d965dcc349ce4016d97498f9"
  },
  {
    "url": "upload/photos/2018-05-17T22:13:07.860Z.png",
    "revision": "d05647548686d2a76f9c911254d8d86a"
  },
  {
    "url": "upload/photos/2018-05-18T09:02:00.988Z.png",
    "revision": "8c1874bdc63e4b2c0f5d844791631319"
  },
  {
    "url": "upload/photos/2018-05-18T09:11:33.548Z.png",
    "revision": "a840304837c0558647a0f2cc6bb2981c"
  },
  {
    "url": "upload/photos/2018-05-18T09:13:05.430Z.png",
    "revision": "c8fc0d0764b66dd84364f9e1e1ac5cca"
  },
  {
    "url": "upload/photos/2018-05-18T09:14:12.536Z.png",
    "revision": "1abd1e9315fb19837f09367b3576e369"
  }
].concat(self.__precacheManifest || []);
workbox.precaching.suppressWarnings();
workbox.precaching.precacheAndRoute(self.__precacheManifest, {});
