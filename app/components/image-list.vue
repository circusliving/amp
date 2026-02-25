<!--
  ImageList — Responsive image grid for gallery-style pages.

  Migrated from `components/amp/ImageList.vue` (AMP → standard HTML/Vue 3).

  Changes vs old component:
  - Replaced `<amp-img layout="responsive" amp-fx="fly-in-bottom">` with
    `<img loading="lazy">` + CSS `width: 100%; height: auto;`
  - Fly-in animation re-implemented with CSS transitions + IntersectionObserver
    (no AMP dependency)
  - Replaced `<nuxt-link>` with `<NuxtLink>`
  - Replaced helpers.js imports with `getPath()` utility function
-->
<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import { getPath } from '../utils/helpers';
import { buildSrcSet, DEFAULT_WIDTHS } from '../utils/image-service';

defineProps<{
  /** Articles (or page items) to display as a responsive image grid. */
  items: Article[];
}>();

/** Build <img> attributes for a given article image URL. */
function imgAttrs(article: Article): { src: string; srcset: string; alt: string } {
  const url = article.image ?? article.coverImage ?? '';
  return {
    src: url,
    srcset: url ? buildSrcSet(url, [...DEFAULT_WIDTHS]) : '',
    alt: article.name,
  };
}

// Fly-in animation via IntersectionObserver — replaces `amp-fx="fly-in-bottom"`.
// We add the `.is-visible` class once an item enters the viewport.
onMounted(() => {
  const items = document.querySelectorAll('.image-list__item');
  if (!items.length || !('IntersectionObserver' in window)) {
    // Fallback: make all items visible immediately when IO is unsupported.
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 },
  );

  items.forEach((el) => observer.observe(el));
});
</script>

<template>
  <ul class="image-list" aria-label="Image gallery">
    <li
      v-for="item in items"
      :key="item.identifier"
      class="image-list__item"
    >
      <NuxtLink :to="getPath(item)" class="image-list__link" :aria-label="item.name">
        <figure class="image-list__figure">
          <img
            v-bind="imgAttrs(item)"
            loading="lazy"
            class="image-list__img"
            width="640"
            height="427"
          >
          <figcaption v-if="item.name" class="image-list__caption">
            {{ item.name }}
          </figcaption>
        </figure>
      </NuxtLink>
    </li>
  </ul>
</template>

<style scoped lang="scss">
.image-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;

  &__item {
    opacity: 0;
    transform: translateY(24px);
    transition:
      opacity 0.45s ease-out,
      transform 0.45s ease-out;

    &.is-visible {
      opacity: 1;
      transform: translateY(0);
    }
  }

  &__link {
    display: block;
    text-decoration: none;
    color: inherit;

    &:hover .image-list__img {
      transform: scale(1.03);
    }
  }

  &__figure {
    margin: 0;
    overflow: hidden;
    border-radius: 2px;
    background-color: #f4f4f4;
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.3s ease-in-out;
  }

  &__caption {
    padding: 0.5em 0.75em;
    font-size: 13px;
    color: #666;
    line-height: 1.4;
    background-color: #fafafa;
  }
}
</style>
