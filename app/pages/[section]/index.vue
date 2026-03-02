<script setup lang="ts">
import type { Article } from '~~/shared/types/article';

const { webPage } = useWebPage();

// Build query params for article fetch — filter by widget tags when available
const articleQuery = computed(() => {
  const params: Record<string, string | number> = { limit: 12 };
  const tagIds = webPage.value?.widgetTags?.map(t => t.id).join(',');
  if (tagIds) params.tags = tagIds;
  return params;
});

// Fetch articles for widget content (card list or image list)
const { data: articles } = await useFetch<Article[]>('/api/articles/latest', {
  query: articleQuery,
  watch: [articleQuery],
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
