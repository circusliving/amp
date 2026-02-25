<script setup lang="ts">
import { computed } from 'vue';
import { useImageAttrs } from '../composables/use-image-attrs';

const props = defineProps<{
  name: string;
  alternateName?: string;
  text: string;
  image?: string;
}>();

const { src, srcSet, alt } = useImageAttrs({
  url: () => props.image ?? '',
  alt: () => `${props.name} image`,
});

const altName = computed<string>(() => {
  if (!props.alternateName) return '';
  if (props.name === props.alternateName) return '';
  return props.alternateName;
});
</script>

<template>
  <div v-if="text" class="page-body">
    <div class="container my-3">
      <SectionHeaderH2 v-if="altName" :title="altName" />
      <div class="row">
        <div v-if="src" class="col-sm-5">
          <figure class="page-body__figure">
            <img
              class="page-body__img"
              :src="src"
              :srcset="srcSet"
              :alt="alt"
              loading="lazy"
              sizes="(min-width: 576px) 40vw, 100vw"
            />
          </figure>
        </div>
        <!-- eslint-disable-next-line vue/no-v-html -->
        <div class="col-sm-7 page-body__text" v-html="text" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.page-body__figure {
  margin: 0;
}

.page-body__img {
  width: 100%;
  height: auto;
  display: block;
}

.page-body__text :deep(img) {
  width: 100%;
  height: auto;
  loading: lazy;
}

.page-body__text :deep(p) {
  margin-bottom: 1rem;
}

.page-body__text :deep(a) {
  color: inherit;
}
</style>
