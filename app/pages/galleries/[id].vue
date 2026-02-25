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
    canonicalPath: `/galleries/${route.params.id}`,
    image: imageUrl.value ? { url: imageUrl.value } : undefined,
  })),
);
</script>

<template>
  <section>
    <HeroTitle :title="imageObject?.name ?? ''" :tint="true" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div class="gallery-body">
            <h2 v-if="imageObject?.name" class="text-center">
              {{ imageObject.name }}
            </h2>

            <figure v-if="imgSrc" class="gallery-body__figure">
              <img
                class="gallery-body__img"
                :src="imgSrc"
                :srcset="imgSrcSet"
                :alt="imgAlt"
                loading="lazy"
                sizes="(min-width: 576px) 65vw, 100vw"
              />
            </figure>

            <p v-if="imageObject?.caption" class="gallery-body__caption">
              {{ imageObject.caption }}
            </p>
          </div>
        </div>

        <div class="col-sm-4 aside-cont">
          <aside>
            <PopularPosts />
          </aside>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
.gallery-body {
  padding: 1em 0;
  margin: 3em 0;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background-color: white;

  h2 {
    font-family: 'Roboto Slab', serif;
    font-size: 22px;
    color: #444;
    margin: 0 0 1em;
    font-weight: 700;
    line-height: 30px;
  }
}

.gallery-body__figure {
  margin: 0 0 1em;

  .gallery-body__img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.gallery-body__caption {
  padding: 0 1em;
  color: #666;
  font-style: italic;
  font-size: 0.9em;
}

.aside-cont {
  padding-top: 3em;
}
</style>
