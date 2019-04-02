import apolloConfig from './modules/configs/apollo.js'


module.exports = {
  css: [
    { src: '@/assets/main.scss', lang: 'scss' },
    { src: '@/assets/main.css', lang: 'css' }
  ],
  router: {
    base: '/amp/'
  },
  /*
  ** Build configuration
  */
  build: {
    // cache: true
    parallel: true
    // routes: [
    //   '/'
    // ]
  },
  /*
  ** Headers
  ** Common headers are already provided by @nuxtjs/pwa preset
  */
  head: {
    meta: [
      { charset: 'utf-8' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#3B8070' },
  /*
  ** Customize app manifest
  */
  manifest: {
    theme_color: '#3B8070'
  },
  /*
  ** Modules
  */
  modules: [
    // ['@nuxtjs/proxy'],
    ['nuxt-webfontloader'],
    ['nuxt-purgecss'],
    ['@nuxtjs/apollo'],
    ['@nuxtjs/axios'],
    ['amp-module']
  ],
  apollo: apolloConfig,
  render: {
    resourceHints: false
  },
  toAmp: {
    version: 'v0',
    componentVersion: '0.1', 
    components: ['amp-carousel', 'amp-sidebar', 'amp-accordion', 'amp-instagram', 'amp-social-share', 'amp-fx-collection'],
    pathFilter: false,
    hostFilter: false,
    minify: true
  },
  axios: {
    retry: { retries: 0 }
  },
  purgeCSS: {
    mode: 'postcss',
    enabled: true
  },
  webfontloader: {
    google: {
      families: ['Roboto+Slab:300','Roboto+Condensed:700'] //Loads Lato font with weights 400 and 700
    }
  }
}
