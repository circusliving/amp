<script setup lang="ts">
import type { Article } from '~~/shared/types/article';

const { webPage } = useWebPage();

// Fetch articles for widget content (card list or image list)
const { data: articles } = await useFetch<Article[]>('/api/articles/latest', {
  query: { limit: 12 },
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
