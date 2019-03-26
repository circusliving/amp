importScripts('/_nuxt/workbox.42554690.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/13e37fc6b175614dc9f7.js",
    "revision": "9f65092e0340d7fe66b556c898c70d46"
  },
  {
    "url": "/_nuxt/2e44e65eabb6faa77eae.js",
    "revision": "0c269bff6ceaef76cdb021a1fb5bd8d2"
  },
  {
    "url": "/_nuxt/41120509aac77bb01bcf.js",
    "revision": "84fe9413042c15e8cea6672540d41113"
  },
  {
    "url": "/_nuxt/48b3288e8362bb10a496.js",
    "revision": "759c949ef2172925a624a20d47cf39b0"
  },
  {
    "url": "/_nuxt/6b10c8ad8c800d25a3f5.js",
    "revision": "4d84373b2bb11b4d27b7a7b07656eedf"
  },
  {
    "url": "/_nuxt/bbcfe17e19f39508c2ae.js",
    "revision": "d95366c629e8aca92b8c9cfbc2e624e5"
  },
  {
    "url": "/_nuxt/cf31bc3f3362c4f6039e.js",
    "revision": "5f7a0130b0da09b6901433b8bb935cdd"
  }
], {
  "cacheId": "website",
  "directoryIndex": "/",
  "cleanUrls": false
})



workbox.clientsClaim()
workbox.skipWaiting()


workbox.routing.registerRoute(new RegExp('/_nuxt/.*'), workbox.strategies.cacheFirst({}), 'GET')

workbox.routing.registerRoute(new RegExp('/.*'), workbox.strategies.networkFirst({}), 'GET')





