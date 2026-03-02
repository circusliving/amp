<script setup lang="ts">
import type { Article } from '~~/shared/types/article';

const route = useRoute();

const { data: article, error: fetchError } = await useFetch<Article>(
  `/api/articles/${route.params.id}`,
);

if (fetchError.value) {
  throw createError({
    statusCode: (fetchError.value as { statusCode?: number }).statusCode ?? 404,
    fatal: true,
  });
}

const heroImage = computed(() =>
  article.value?.coverImage ? { url: article.value.coverImage } : undefined,
);

const { src: articleImgSrc, srcSet: articleImgSrcSet, alt: articleImgAlt } = useImageAttrs({
  url: () => article.value?.image ?? '',
  alt: () => article.value?.name ?? '',
});

useSeoHead(
  computed(() => ({
    title: article.value?.alternateName ?? article.value?.name ?? '',
    description: article.value?.description ?? '',
    canonicalPath: `/articles/${route.params.id}`,
    type: 'article' as const,
    image: article.value?.image ? { url: article.value.image } : undefined,
    publishedTime: article.value?._firstPublishedAt ?? article.value?._createdAt,
    modifiedTime: article.value?._updatedAt,
  })),
);
</script>

<template>
  <article>
    <HeroTitle :title="article?.name ?? ''" :image="heroImage" :tint="true" />

    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div class="article-body">
            <h2
              v-if="article?.alternateName && article.alternateName !== article.name"
              class="text-center"
            >
              {{ article.alternateName }}
            </h2>

            <figure v-if="articleImgSrc" class="article-body__figure">
              <img
                class="article-body__img"
                :src="articleImgSrc"
                :srcset="articleImgSrcSet"
                :alt="articleImgAlt"
                loading="lazy"
                sizes="(min-width: 576px) 65vw, 100vw"
              >
            </figure>

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div v-if="article?.text" class="article-body__text" v-html="article.text" />
          </div>
        </div>

        <div class="col-sm-4 aside-cont">
          <aside>
            <PopularPosts />
          </aside>
        </div>
      </div>
    </div>
  </article>
</template>

<style scoped lang="scss">
.article-body {
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

.article-body__figure {
  margin: 0 0 1em;

  .article-body__img {
    width: 100%;
    height: auto;
    display: block;
  }
}

.article-body__text {
  padding: 0 1em;

  :deep(img) {
    width: 100%;
    height: auto;
  }

  :deep(p) {
    margin-bottom: 1rem;
  }

  :deep(a) {
    color: inherit;
    text-decoration: underline;

    &:hover {
      color: #28b8d8;
    }
  }
}

.aside-cont {
  padding-top: 3em;
}
</style>
