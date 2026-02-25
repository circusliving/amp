<template>
  <section>
    <div class="card-img-middle">
      <h3>
        <NuxtLink :to="path">{{ article.name }}</NuxtLink>
      </h3>
      <h4>{{ article.alternateName }}</h4>
      <figure>
        <NuxtLink :to="path" :aria-label="article.name">
          <img
            :src="src"
            :srcset="srcSet"
            :alt="alt"
            loading="lazy"
            width="640"
            height="427"
          >
        </NuxtLink>
      </figure>
      <p>{{ truncatedDescription }}</p>
      <NuxtLink :to="path" class="continue-reading">CONTINUE READING</NuxtLink>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import { getPath, truncateText } from '../utils/helpers';
import { useImageAttrs } from '../composables/use-image-attrs';

const props = defineProps<{ article: Article }>();

const path = computed(() => getPath(props.article));

/** Truncate at 130 chars — replaces the old `needsSpace()` method. */
const truncatedDescription = computed(() =>
  truncateText(props.article.description ?? '', 130),
);

const { src, srcSet, alt } = useImageAttrs({
  url: () => props.article.coverImage ?? props.article.image ?? '',
  alt: () => props.article.name,
});
</script>

<style scoped lang="scss">
.card-img-middle {
  margin-bottom: 1em;

  h3 {
    font-weight: 600;
    font-size: 18px;

    a {
      color: #444;
      text-decoration: none;
      transition: color 200ms ease-in;

      &:hover { color: #28b8d8; }
    }
  }

  h4 {
    font-size: 20px;
    font-weight: 400;
    font-family: 'Euphoria Script', cursive, serif;
  }

  figure {
    margin: 1em 0;

    img {
      width: 100%;
      height: auto;
    }
  }

  .continue-reading {
    display: inline-block;
    margin-top: 0.5em;
    font-size: 0.85em;
    font-weight: 600;
    color: #28b8d8;
    text-decoration: none;
    text-transform: uppercase;
    letter-spacing: 0.05em;

    &:hover { text-decoration: underline; }
  }
}
</style>
