<template>
  <section>
    <div class="container">
      <div class="card-columns">
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
