import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { Article } from '~~/shared/types/article';

/**
 * Pinia article store — replaces legacy Vuex `store/article.js`.
 * Caches the latest articles fetched from the server API.
 */
export const useArticleStore = defineStore('article', () => {
  const latestArticles = ref<Article[]>([]);

  /**
   * Fetch the latest N articles and populate `latestArticles`.
   * Uses `useFetch` (Nuxt auto-import) so SSR hydration is handled automatically.
   */
  async function fetchLatest(limit = 6): Promise<void> {
    const { data } = await useFetch<Article[]>('/api/articles/latest', {
      query: { limit },
    });
    if (data.value) {
      latestArticles.value = data.value;
    }
  }

  return { latestArticles, fetchLatest };
});
