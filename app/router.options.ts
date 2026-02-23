import type { RouterConfig } from '@nuxt/schema';

/**
 * Router configuration: scroll to top on every navigation.
 * Replaces the per-component `scrollToTop: true` from the legacy Nuxt 2 mixin.
 * Saved scroll positions (browser back/forward) are still restored.
 */
export default <RouterConfig>{
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    }
    return { top: 0 };
  },
};
