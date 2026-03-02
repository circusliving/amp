<template>
  <section>
    <div class="container">
      <div class="card-grid">
        <Card v-for="(article, index) in articles" :key="article.identifier ?? index" :article="article" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types/article';

defineProps<{ articles: Article[] }>();
// Card is auto-imported by Nuxt from app/components/card.vue
</script>

<style scoped>
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}
</style>
