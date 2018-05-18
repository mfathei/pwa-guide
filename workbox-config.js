module.exports = {
  "globDirectory": "public/",
  "globPatterns": [
    "**/*.{html,ico,json,css,js}",
    "src/images/*.{jpg,png}"
  ],
  "swDest": "public/workbox-sw.js",
  "globIgnores": [
    "../workbox-config.js",
    "help/**"
  ]
};