<template>
  <div class="card">
    <div class="card-body text-center">
      <h3 class="c-title">
        <NuxtLink :to="path">{{ article.name }}</NuxtLink>
      </h3>
    </div>

    <figure class="position-relative">
      <NuxtLink :to="path" :aria-label="article.name">
        <div class="text-overlay">
          <div class="info">{{ article.name }}</div>
        </div>
        <img
          :src="src"
          :srcset="srcSet"
          :alt="alt"
          loading="lazy"
          width="640"
          height="427"
        />
      </NuxtLink>
    </figure>

    <div class="card-body">
      <p class="card-text" v-html="article.description" />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import { getPath } from '../utils/helpers';
import { useImageAttrs } from '../composables/use-image-attrs';

const props = defineProps<{ article: Article }>();

const path = computed(() => getPath(props.article));

const { src, srcSet, alt } = useImageAttrs({
  url: () => props.article.coverImage ?? props.article.image ?? '',
  alt: () => props.article.name,
});
</script>

<style scoped lang="scss">
.c-title a {
  font-size: 18px;
  color: #444;
  font-weight: 700;
  text-decoration: none;
  transition: all 200ms ease-in;

  &:hover { color: #28b8d8; }
}

figure {
  margin-bottom: 20px;
  text-align: center;

  a {
    .text-overlay {
      opacity: 0;
      height: 100%;
      position: absolute;
      text-decoration: none;
      width: 100%;
      z-index: 100;
      padding: 20px;
      background: rgba(40, 184, 216, 0.9);
      transition: all 0.4s;

      &::before {
        content: '';
        display: block;
        position: absolute;
        z-index: -1;
        inset: 10px;
        border: 1px solid rgba(255, 255, 255, 0.3);
      }

      .info {
        text-align: center;
        top: 50%;
        width: 100%;
        left: 0;
        position: absolute;
        margin-top: -11px;
        color: white;
        font-size: 16px;
        font-weight: 600;
        text-transform: uppercase;
        background-color: rgba(0, 0, 0, 0.6);
      }
    }

    &:hover .text-overlay { opacity: 1; }
  }

  img {
    width: 100%;
    height: auto;
  }
}
</style>
