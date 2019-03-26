import Vue from 'vue'
import Router from 'vue-router'
import { interopDefault } from './utils'

const _2a9ba698 = () => interopDefault(import('../pages/amp/index.vue' /* webpackChunkName: "pages/amp/index" */))
const _96c90de0 = () => interopDefault(import('../pages/offline.vue' /* webpackChunkName: "pages/offline" */))
const _76fbe7f6 = () => interopDefault(import('../pages/amp/articles/_id.vue' /* webpackChunkName: "pages/amp/articles/_id" */))
const _4dcbe2d3 = () => interopDefault(import('../pages/amp/_section/_page.vue' /* webpackChunkName: "pages/amp/_section/_page" */))
const _dc49f482 = () => interopDefault(import('../pages/index.vue' /* webpackChunkName: "pages/index" */))

Vue.use(Router)

if (process.client) {
  if ('scrollRestoration' in window.history) {
    window.history.scrollRestoration = 'manual'

    // reset scrollRestoration to auto when leaving page, allowing page reload
    // and back-navigation from other pages to use the browser to restore the
    // scrolling position.
    window.addEventListener('beforeunload', () => {
      window.history.scrollRestoration = 'auto'
    })

    // Setting scrollRestoration to manual again when returning to this page.
    window.addEventListener('load', () => {
      window.history.scrollRestoration = 'manual'
    })
  }
}
const scrollBehavior = function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  // if no children detected and scrollToTop is not explicitly disabled
  if (
    to.matched.length < 2 &&
    to.matched.every(r => r.components.default.options.scrollToTop !== false)
  ) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some(r => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise((resolve) => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash) {
        let hash = to.hash
        // CSS.escape() is not supported with IE and Edge.
        if (typeof window.CSS !== 'undefined' && typeof window.CSS.escape !== 'undefined') {
          hash = '#' + window.CSS.escape(hash.substr(1))
        }
        try {
          if (document.querySelector(hash)) {
            // scroll to anchor by returning the selector
            position = { selector: hash }
          }
        } catch (e) {
          console.warn('Failed to save scroll position. Please add CSS.escape() polyfill (https://github.com/mathiasbynens/CSS.escape).')
        }
      }
      resolve(position)
    })
  })
}

export function createRouter() {
  return new Router({
    mode: 'history',
    base: decodeURI('/'),
    linkActiveClass: 'nuxt-link-active',
    linkExactActiveClass: 'nuxt-link-exact-active',
    scrollBehavior,

    routes: [{
      path: "/amp",
      component: _2a9ba698,
      name: "amp"
    }, {
      path: "/offline",
      component: _96c90de0,
      name: "offline"
    }, {
      path: "/amp/articles/:id?",
      component: _76fbe7f6,
      name: "amp-articles-id"
    }, {
      path: "/amp/:section/:page?",
      component: _4dcbe2d3,
      name: "amp-section-page"
    }, {
      path: "/",
      component: _dc49f482,
      name: "index"
    }],

    fallback: false
  })
}
