<script setup lang="ts">
import { useImageAttrs } from '../composables/use-image-attrs';

interface HeroImage {
  url: string;
  alt?: string;
}

const props = withDefaults(
  defineProps<{
    title: string;
    image?: HeroImage;
    tint?: boolean;
  }>(),
  { tint: false },
);

const { src, srcSet, alt } = useImageAttrs({
  url: () => props.image?.url ?? '',
  alt: () => props.image?.alt ?? '',
});
</script>

<template>
  <header class="hero" :class="{ 'hero--tint': tint }">
    <div class="hero__bg" aria-hidden="true">
      <img
        v-if="src"
        class="hero__img"
        :src="src"
        :srcset="srcSet"
        :alt="alt"
        loading="eager"
        fetchpriority="high"
        sizes="100vw"
      />
    </div>

    <div class="hero__content">
      <h1 class="hero__title">{{ title }}</h1>
    </div>
  </header>
</template>

<style scoped>
.hero {
  position: relative;
  min-height: 550px;
  overflow: hidden;
  background-color: #000;
}

.hero--tint .hero__bg::after {
  content: '';
  position: absolute;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.4);
}

.hero__bg {
  position: absolute;
  inset: 0;
}

.hero__img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.hero__content {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero__title {
  padding-top: 66px;
  color: #fff;
  text-align: center;
  font-family: 'Roboto Slab', serif;
  z-index: 1;
}
</style>
