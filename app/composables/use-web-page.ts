import { computed } from 'vue';
import { useSeoHead } from './use-seo-head';
import type { WebPage } from '~~/shared/types/web-page';

/**
 * Composable that fetches a CMS-driven WebPage for the current route,
 * sets SEO head tags automatically, and handles 404 errors.
 *
 * Replaces the legacy `webPageMixin.js` asyncData + head() pattern.
 */
export function useWebPage() {
  const route = useRoute();
  const path = computed(() => route.path);

  const { data: webPage, error, status } = useFetch<WebPage>(
    () => `/api/web-pages${path.value}`,
  );

  useSeoHead(
    computed(() => ({
      title: webPage.value?.alternateName || webPage.value?.name || '',
      description: webPage.value?.description ?? '',
      canonicalPath: path.value,
      image: webPage.value?.image
        ? { url: webPage.value.image }
        : undefined,
    })),
  );

  if (error.value) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  return { webPage, error, status };
}
