<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
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

// Scroll-based parallax — mirrors what amp-fx="parallax" does.
// The bg image is translated up at half the scroll speed of the page.
const bgRef = ref<HTMLElement | null>(null);
const PARALLAX_FACTOR = 0.35;

function onScroll(): void {
  if (!bgRef.value) return;
  const offset = window.scrollY * PARALLAX_FACTOR;
  bgRef.value.style.transform = `translateY(${offset}px)`;
}

onMounted(() => {
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
});

onUnmounted(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<template>
  <header class="hero" :class="{ 'hero--tint': tint }">
    <div ref="bgRef" class="hero__bg" aria-hidden="true">
      <img
        v-if="src"
        class="hero__img"
        :src="src"
        :srcset="srcSet"
        :alt="alt"
        loading="eager"
        fetchpriority="high"
        sizes="100vw"
      >
    </div>

    <div class="hero__content">
      <h1 v-if="title.trim()" class="hero__title">{{ title }}</h1>
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

/* Oversized so the parallax shift never reveals a gap at top/bottom */
.hero__bg {
  position: absolute;
  top: -20%;
  left: 0;
  right: 0;
  bottom: -20%;
  will-change: transform;
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
