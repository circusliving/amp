<template>
  <section>
    <div class="bordered">
      <figure>
        <NuxtLink :to="path" :aria-label="article.name">
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
      <h3>{{ article.name }}</h3>
      <h4>{{ article.alternateName }}</h4>
      <p>{{ truncatedDescription }}</p>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { Article } from '~~/shared/types/article';
import { getPath, truncateText } from '../utils/helpers';
import { useImageAttrs } from '../composables/use-image-attrs';

const props = defineProps<{ article: Article }>();

const path = computed(() => getPath(props.article));

/** Truncate at 152 chars — replaces the old `needsSpace()` method. */
const truncatedDescription = computed(() =>
  truncateText(props.article.description ?? '', 152),
);

const { src, srcSet, alt } = useImageAttrs({
  url: () => props.article.coverImage ?? props.article.image ?? '',
  alt: () => props.article.name,
});
</script>

<style scoped lang="scss">
.bordered {
  border: 1px solid rgba(0, 0, 0, 0.1);
  padding: 20px 15px 5px 15px;
  text-align: center;
  background-color: white;
  margin-bottom: 1em;
  min-height: 470px;

  h3 {
    font-weight: 600;
    font-size: 18px;
    color: black;
    font-family: 'Roboto Slab', serif;
  }

  h4 {
    font-size: 23px;
    font-weight: 400;
    font-family: 'Euphoria Script', cursive, serif;
    margin: 0.75em 0;
  }

  figure {
    margin-bottom: 20px;
    text-align: center;

    img {
      width: 100%;
      height: auto;
    }
  }
}
</style>
