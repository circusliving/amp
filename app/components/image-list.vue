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

const props = defineProps<{
  /** Articles (or page items) to display as a responsive image grid. */
  items: Article[];
}>();

const listRef = ref<HTMLElement | null>(null);
let observer: IntersectionObserver | null = null;

const columns = computed(() => {
  const result: Article[][] = [[], [], [], []];
  props.items.forEach((item, index) => {
    result[index % result.length]!.push(item);
  });
  return result;
});

/** Build <img> attributes for a given article image URL. */
function imgAttrs(article: Article): { src: string; srcset: string; alt: string } {
  const url = article.image ?? article.coverImage ?? '';
  return {
    src: url,
    srcset: url ? buildSrcSet(url, [...DEFAULT_WIDTHS]) : '',
    alt: article.name,
  };
}

async function observeItems(): Promise<void> {
  await nextTick();

  const items = listRef.value?.querySelectorAll('.image-list__item:not(.is-visible)');
  if (!items?.length) return;

  if (!('IntersectionObserver' in window)) {
    // Fallback: make all items visible immediately when IO is unsupported.
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  items.forEach((el) => observer?.observe(el));
}

function createObserver(): void {
  observer?.disconnect();
  observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer?.unobserve(entry.target);
      });
    },
    { threshold: 0.1 },
  );
}

// Fly-in animation via IntersectionObserver — replaces `amp-fx="fly-in-bottom"`.
// Items can arrive after mount, so re-observe whenever the list changes.
onMounted(() => {
  if ('IntersectionObserver' in window) createObserver();
  void observeItems();
});

watch(
  () => props.items,
  () => {
    void observeItems();
  },
  { flush: 'post' },
);

onBeforeUnmount(() => {
  observer?.disconnect();
});
</script>

<template>
  <section ref="listRef" class="image-list" aria-label="Image gallery">
    <div class="image-list__columns">
      <div
        v-for="(column, columnIndex) in columns"
        :key="columnIndex"
        class="image-list__column"
      >
        <figure
          v-for="item in column"
          :key="item.identifier"
          class="image-list__item"
        >
          <NuxtLink :to="getPath(item)" class="image-list__link" :aria-label="item.name">
            <span class="image-list__overlay" aria-hidden="true">
              <span class="image-list__title">{{ item.name }}</span>
            </span>
            <img
              v-bind="imgAttrs(item)"
              loading="lazy"
              class="image-list__img"
            >
          </NuxtLink>
        </figure>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.image-list {
  padding: 0;
  margin: 0;

  &__columns {
    display: flex;
    flex-wrap: wrap;
    align-content: space-between;
  }

  &__column {
    flex: 1 1 25%;
    max-width: 25%;
    padding: 0;
  }

  &__item {
    position: relative;
    display: block;
    margin: 0;
    overflow: hidden;
    opacity: 0;
    transform: translateY(50%);
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
    position: relative;
    text-decoration: none;
    color: inherit;
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
    vertical-align: middle;
  }

  &__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    padding: 20px;
    opacity: 0;
    background: rgba(40, 184, 216, 0.9);
    transition: opacity 0.4s ease;

    &::before {
      content: '';
      position: absolute;
      inset: 10px;
      z-index: -1;
      border: 1px solid rgba(255, 255, 255, 0.3);
    }
  }

  &__link:hover &__overlay,
  &__link:focus-visible &__overlay {
    opacity: 1;
  }

  &__title {
    position: absolute;
    top: 50%;
    left: 0;
    width: 100%;
    margin-top: -11px;
    padding: 0.15em 0.5em;
    color: #fff;
    background-color: rgba(0, 0, 0, 0.6);
    font-size: 16px;
    font-weight: 400;
    line-height: 22px;
    text-align: center;
    text-transform: uppercase;
  }
}

@media screen and (max-width: 1199px) {
  .image-list__column {
    flex-basis: 50%;
    max-width: 50%;
  }
}

@media screen and (max-width: 600px) {
  .image-list__column {
    flex-basis: 100%;
    max-width: 100%;
  }
}
</style>
