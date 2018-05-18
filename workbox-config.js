module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{html,ico,json,css,js}",
    "src/images/*.{jpg,png}"
  ],
  "swSrc": "public/base-sw.js",
  "swDest": "public/workbox-sw.js",
  "globIgnores": [
    "../workbox-config.js",
    "help/**"
  ]
};