<script setup lang="ts">
import type { ImageObject } from '~~/shared/types/image-object';

const route = useRoute();

const { data: imageObject, error: fetchError } = await useFetch<ImageObject>(
  `/api/image-objects/${route.params.id}`,
);

if (fetchError.value) {
  throw createError({
    statusCode: (fetchError.value as { statusCode?: number }).statusCode ?? 404,
    fatal: true,
  });
}

const imageUrl = computed(() => imageObject.value?.contentUrl ?? imageObject.value?.url ?? '');
const imageName = computed(() => imageObject.value?.name ?? '');

const { src: imgSrc, srcSet: imgSrcSet, alt: imgAlt } = useImageAttrs({
  url: imageUrl,
  alt: imageName,
});

useSeoHead(
  computed(() => ({
    title: imageObject.value?.name ?? '',
    description: imageObject.value?.caption ?? imageObject.value?.keywords ?? '',
    canonicalPath: `/image-objects/${route.params.id}`,
    image: imageUrl.value ? { url: imageUrl.value } : undefined,
  })),
);
</script>

<template>
  <section>
    <HeroTitle :title="imageObject?.name ?? ''" :tint="true" />

    <div class="container">
      <div class="image-object-body">
        <h1 v-if="imageObject?.name" class="image-object-body__title">
          {{ imageObject.name }}
        </h1>

        <figure v-if="imgSrc" class="image-object-body__figure">
          <img
            class="image-object-body__img"
            :src="imgSrc"
            :srcset="imgSrcSet"
            :alt="imgAlt"
            loading="lazy"
            sizes="(min-width: 576px) 75vw, 100vw"
          />
          <figcaption v-if="imageObject?.caption" class="image-object-body__caption">
            {{ imageObject.caption }}
          </figcaption>
        </figure>

        <dl v-if="imageObject?.keywords" class="image-object-body__meta">
          <dt>Keywords</dt>
          <dd>{{ imageObject.keywords }}</dd>
        </dl>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.image-object-body {
  padding: 3em 0;

  &__title {
    font-family: 'Roboto Slab', serif;
    font-size: 28px;
    color: #444;
    margin-bottom: 1em;
    text-align: center;
  }

  &__figure {
    margin: 0 0 1.5em;
  }

  &__img {
    width: 100%;
    height: auto;
    display: block;
  }

  &__caption {
    padding: 0.5em 0;
    color: #666;
    font-style: italic;
    font-size: 0.9em;
    text-align: center;
  }

  &__meta {
    dt {
      font-weight: 700;
      color: #444;
    }

    dd {
      color: #666;
      margin-left: 0;
      margin-bottom: 0.5em;
    }
  }
}
</style>
