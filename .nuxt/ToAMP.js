import ToAMP from 'to-amp'
import Vue from 'vue'

Vue.config.ignoredElements = [
  'amp-menu-container',
]
const options =   {
  "version": "v0",
  "componentVersion": "0.1",
  "components": [
    "amp-carousel",
    "amp-sidebar",
    "amp-accordion",
    "amp-instagram",
    "amp-social-share",
    "amp-fx-collection"
  ],
  "pathFilter": false,
  "hostFilter": false,
  "imgLayout": "responsive",
  "svgLayout": "svg",
  "minify": true
}

export default (ctx, inject) => {
  ToAMP.setDefaultOpts(options)
  inject('ToAMP', ToAMP)
}
