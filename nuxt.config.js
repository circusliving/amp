const consola   = require('consola')
const dotenv    = require('dotenv')
const nodePath  = require('path')
const isProd    = ![ 'dev', 'stg' ].includes(process.env.NODE_ENV)
const ENV       = process.env.NODE_ENV
const dotFile   = (!isProd)? `.${ENV}.env` : '.env'
const path      = nodePath.resolve(process.cwd(), dotFile)

dotenv.config({ path }) // read .env

consola.info(`      Building for NODE_ENV: ${process.env.NODE_ENV}`)
consola.info(`        Reading dotenv file: ${dotFile}`)
consola.info(`                   BASE_URL: ${process.env.BASE_URL}`)
consola.info(`                  BASE_PATH: ${process.env.BASE_PATH}`)

const apolloConfig = require('./modules/configs/apollo.js')
const SiteMap      = require('./modules/SiteMap')

module.exports = {
  generate: { routes: SiteMap.all, interval: 2000 },
  env     : {
    BASE_URL          : process.env.BASE_URL,
    NODE_ENV          : process.env.NODE_ENV,
    BASE_PATH         : process.env.BASE_PATH,
    DATO_READ_ONLY    : process.env.DATO_READ_ONLY,
    CACONICAL_BASE_URL: process.env.CACONICAL_BASE_URL,
    GA_TAG_ID         : process.env.GA_TAG_ID
  },
  css: [
    { src: '@/assets/main.scss', lang: 'scss' },
    { src: '@/assets/main.css',  lang: 'css' }
  ],
  build: { cache: true, parallel: true },
  head : {
    meta: [
      { name: 'theme-color', content: '#000000' },
      { name: 'msapplication-TileColor', content: '#da532c' },
      { name: 'nativeUI', content: true },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: '#000000' }
    ],
    link: [
      { rel: 'mask-icon', href: '/safari-pinned-tab.svg', color: '#5bbad5' },
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: '/favicon-16x16.png' },
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: '/favicon-32x32.png' },
      { rel: 'apple-touch-icon', sizes: '180x180', href: '/apple-touch-icon.png' }
    ]
  },
  manifest: {
    name            : 'Circus Living',
    short_name      : 'Circus',
    description     : 'We are a family of five composed of three morbid young children.  Art, travel, and technology form significant aspects of our daily lives.',
    theme_color     : '#000000',
    display         : 'standalone',
    background_color: '#000000',
    lang            : 'en'
  },
  loading: { color: '#3B8070' },
  modules: [
    [ '@nuxtjs/pwa' ],
    [ 'nuxt-purgecss' ],
    [ '@nuxtjs/apollo' ],
    [ '@nuxtjs/axios' ],
    [ 'amp-module' ]
  ],
  apollo: apolloConfig,
  render: { resourceHints: true },
  toAmp : {
    version         : 'v0',
    componentVersion: '0.1',
    components      : [ 'amp-carousel', 'amp-sidebar', 'amp-accordion', 'amp-instagram', 'amp-youtube', 'amp-social-share', 'amp-fx-collection', 'amp-install-serviceworker', 'amp-analytics' ],
    pathFilter      : false,
    hostFilter      : false,
    minify          : true
  },
  axios: {
    retry: { retries: 0 }
  },
  purgeCSS: {
    mode   : 'postcss',
    enabled: true
  },
  workbox: { dev: false }
  // watch  : [ 'amp-module', 'to-amp' ]
}
