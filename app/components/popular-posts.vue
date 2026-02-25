<!--
  PopularPosts — Sidebar widget displaying the latest articles.

  Migrated from `components/amp/PopularPosts.vue` (Vuex → Pinia, Vue 2 → Vue 3).

  Changes vs old component:
  - Replaced `import { mapGetters } from 'vuex'` with `useArticleStore()` (Pinia)
  - Replaced Vue 2 `filters: { dateFormat }` with `formatDate()` function call
  - Replaced `created()` hook with `<script setup>` body call
  - Removed dead `src()` function that was never called
  - Fixed `v-bind:key` bug (old: `:key` with no value → new: `:key="article.identifier"`)
  - Replaced `<nuxt-link>` with `<NuxtLink>`
  - Replaced `<amp-img>` with `<img loading="lazy">`
-->
<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import { formatDate } from '../utils/date-format';
import { getPath } from '../utils/helpers';
import { buildSrcSet, DEFAULT_WIDTHS } from '../utils/image-service';

const articleStore = useArticleStore();

// Trigger fetch on mount — non-blocking; template updates reactively when done.
// `useFetch` inside the store runs with SSR hydration support when called from
// setup body context; falling back to client-side fetch is acceptable for this
// sidebar widget.
articleStore.fetchLatest();

/** Build `<img>` src/srcset/alt attributes for a given article. */
function imgAttrs(article: Article): { src: string; srcset: string; alt: string } {
  const url = article.image ?? article.coverImage ?? '';
  return {
    src: url,
    srcset: url ? buildSrcSet(url, [...DEFAULT_WIDTHS]) : '',
    alt: article.name,
  };
}
</script>

<template>
  <aside class="popular-posts" aria-label="Popular posts">
    <h3 class="popular-posts__heading">Popular Posts</h3>

    <ul v-if="articleStore.latestArticles.length" class="popular-posts__list">
      <li
        v-for="article in articleStore.latestArticles"
        :key="article.identifier"
        class="popular-posts__item"
      >
        <NuxtLink :to="getPath(article)" class="popular-posts__link">
          <img
            v-bind="imgAttrs(article)"
            loading="lazy"
            width="80"
            height="60"
            class="popular-posts__img"
          >
          <div class="popular-posts__meta">
            <span class="popular-posts__title">{{ article.name }}</span>
            <time
              v-if="article._updatedAt"
              :datetime="article._updatedAt"
              class="popular-posts__date"
            >
              {{ formatDate(article._updatedAt) }}
            </time>
          </div>
        </NuxtLink>
      </li>
    </ul>

    <p v-else class="popular-posts__empty">Loading…</p>
  </aside>
</template>

<style scoped lang="scss">
.popular-posts {
  &__heading {
    position: relative;
    display: inline-block;
    text-transform: uppercase;
    margin-bottom: 0.75em;
    font-size: 18px;
    font-family: 'Roboto Condensed', sans-serif;
    line-height: 22px;
    color: #444;
    font-weight: 700;
  }

  &__list {
    list-style: none;
    padding: 0;
    margin: 0;
  }

  &__item {
    margin-bottom: 1em;
    padding-bottom: 1em;
    border-bottom: 1px solid rgba(0, 0, 0, 0.08);

    &:last-child {
      border-bottom: none;
    }
  }

  &__link {
    display: flex;
    gap: 0.75em;
    text-decoration: none;
    color: inherit;
    align-items: flex-start;

    &:hover .popular-posts__title {
      color: #28b8d8;
    }
  }

  &__img {
    flex-shrink: 0;
    width: 80px;
    height: 60px;
    object-fit: cover;
    border-radius: 2px;
  }

  &__meta {
    display: flex;
    flex-direction: column;
    gap: 0.25em;
  }

  &__title {
    font-size: 14px;
    font-weight: 600;
    color: #444;
    line-height: 1.4;
    transition: color 200ms ease-in;
  }

  &__date {
    font-size: 12px;
    color: #999;
  }

  &__empty {
    color: #aaa;
    font-size: 14px;
  }
}
</style>
