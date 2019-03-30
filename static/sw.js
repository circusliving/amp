importScripts('/_nuxt/workbox.42554690.js')

workbox.precaching.precacheAndRoute([
  {
    "url": "/_nuxt/4f738f8da90466230c7d.js",
    "revision": "27aeb2770a2875bdc611535e94738226"
  },
  {
    "url": "/_nuxt/57e3fd83cc7634144fe3.js",
    "revision": "78c8e7755fc2d1a2bb9cc09477412c84"
  },
  {
    "url": "/_nuxt/7d5f0d0e58fc1d2071aa.js",
    "revision": "ee763ae6540c8740903dd5d6a29a389d"
  },
  {
    "url": "/_nuxt/96f02318fb81ab1754b7.js",
    "revision": "25c6d310e8021ce7482269705b613fb9"
  },
  {
    "url": "/_nuxt/9819e908b138f7446958.js",
    "revision": "d8bbf3d6a54d0784713c01e44e755e7b"
  },
  {
    "url": "/_nuxt/a5eaa6f451b7e815cb01.js",
    "revision": "b4c9572f328aa87de065ca00386828f8"
  },
  {
    "url": "/_nuxt/c3ebe9dbc458119c673e.js",
    "revision": "8a168dd30731a8d68e49e7964b5f3035"
  },
  {
    "url": "/_nuxt/fdc0e93962e8786fdeb7.js",
    "revision": "f6e1f4627e9d315539bd2cd535b21199"
  },
  {
    "url": "/_nuxt/ff16adccd50e89558297.js",
    "revision": "24d26586e2c483e0035148c53b568991"
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





