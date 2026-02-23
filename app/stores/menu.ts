import { defineStore } from 'pinia';
import { ref } from 'vue';

/**
 * Pinia menu store — replaces legacy Vuex `store/menu.js`.
 * Tracks the sidebar/nav open/close state on the client.
 */
export const useMenuStore = defineStore('menu', () => {
  const isOpen = ref(false);

  function toggle(): void {
    isOpen.value = !isOpen.value;
  }

  function open(): void {
    isOpen.value = true;
  }

  function close(): void {
    isOpen.value = false;
  }

  return { isOpen, toggle, open, close };
});
