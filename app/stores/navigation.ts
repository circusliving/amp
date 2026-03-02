import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { MenuItem } from '~~/shared/types/menu';

/**
 * Pinia navigation store — replaces the `nuxtServerInit` menu-tree fetch
 * from the legacy Vuex `store/index.js`.
 * Holds the fully built menu tree for layout rendering.
 */
export const useNavigationStore = defineStore('navigation', () => {
  const menuItems = ref<MenuItem[]>([]);

  /**
   * Fetch the complete menu tree from the server API.
   * Uses `$fetch` for direct server calls within store actions.
   */
  async function fetchMenu(): Promise<void> {
    const data = await $fetch<MenuItem[]>('/api/menu');
    if (data) {
      menuItems.value = data;
    }
  }

  return { menuItems, fetchMenu };
});
