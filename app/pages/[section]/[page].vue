<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import type { WebPage } from '~~/shared/types/web-page';

const route = useRoute();

const { data: webPage, error } = await useFetch<WebPage>(
  () => `/api/web-pages${route.path}`,
);

useSeoHead(
  computed(() => ({
    title: webPage.value?.alternateName || webPage.value?.name || '',
    description: webPage.value?.description ?? '',
    canonicalPath: route.path,
    image: webPage.value?.image
      ? { url: webPage.value.image }
      : undefined,
  })),
);

if (error.value?.statusCode === 404) {
  throw createError({ statusCode: 404, statusMessage: 'Page not found' });
}

// Build query params for article fetch — filter by widget tags when available
const articleQuery = computed(() => {
  const params: Record<string, string | number> = {
    limit: webPage.value?.widget ? 50 : 12,
  };
  const tagIds = webPage.value?.widgetTags?.map(t => t.id).join(',');
  if (tagIds) params.tags = tagIds;
  return params;
});

// Fetch articles for widget content (card list or image list)
const articlesEndpoint = computed(() => webPage.value?.widget ? '/api/articles' : '/api/articles/latest');

const { data: articles } = await useFetch<Article[]>(articlesEndpoint, {
  query: articleQuery,
});

const heroImage = computed(() =>
  webPage.value?.coverImage ? { url: webPage.value.coverImage } : undefined,
);
</script>

<template>
  <section>
    <HeroTitle :title="webPage?.name ?? ''" :image="heroImage" />

    <PageBody
      v-if="webPage?.text"
      :name="webPage.name"
      :alternate-name="webPage.alternateName"
      :text="webPage.text"
      :image="webPage.image"
    />

    <ImageList v-if="webPage?.widget" :items="articles ?? []" />
    <CardList v-else :articles="articles ?? []" />
  </section>
</template>
