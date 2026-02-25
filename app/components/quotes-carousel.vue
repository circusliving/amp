<script setup lang="ts">
import { ref } from 'vue';

/** Indices of the 3 named slots (quoteOne, quoteTwo, quoteThree). */
const SLIDE_COUNT = 3;

const current = ref<number>(0);

function prev(): void {
  current.value = (current.value - 1 + SLIDE_COUNT) % SLIDE_COUNT;
}

function next(): void {
  current.value = (current.value + 1) % SLIDE_COUNT;
}

function goTo(index: number): void {
  current.value = index;
}
</script>

<template>
  <section class="quotes-carousel">
    <!-- Parallax background (CSS, no AMP) -->
    <div class="quotes-carousel__bg" aria-hidden="true" />

    <!-- Carousel region -->
    <div
      class="quotes-carousel__track"
      role="region"
      aria-label="Quotes carousel"
      aria-live="polite"
    >
      <div
        v-for="(_, i) in SLIDE_COUNT"
        :key="i"
        class="quotes-carousel__slide"
        :class="{ 'quotes-carousel__slide--active': i === current }"
        :aria-hidden="i !== current"
        :inert="i !== current || undefined"
      >
        <slot v-if="i === 0" name="quoteOne" />
        <slot v-else-if="i === 1" name="quoteTwo" />
        <slot v-else name="quoteThree" />
      </div>
    </div>

    <!-- Controls -->
    <div class="quotes-carousel__controls">
      <button
        class="quotes-carousel__btn quotes-carousel__btn--prev"
        aria-label="Go to previous slide"
        type="button"
        @click="prev"
      >
        ‹
      </button>

      <div class="quotes-carousel__dots" role="tablist" aria-label="Slides">
        <button
          v-for="(_, i) in SLIDE_COUNT"
          :key="i"
          class="quotes-carousel__dot"
          :class="{ 'quotes-carousel__dot--active': i === current }"
          role="tab"
          :aria-selected="i === current"
          :aria-label="`Go to slide ${i + 1}`"
          type="button"
          @click="goTo(i)"
        />
      </div>

      <button
        class="quotes-carousel__btn quotes-carousel__btn--next"
        aria-label="Go to next slide"
        type="button"
        @click="next"
      >
        ›
      </button>
    </div>
  </section>
</template>

<style scoped>
.quotes-carousel {
  position: relative;
  overflow: hidden;
  min-height: 350px;
}

/* CSS parallax background — replaces amp-img amp-fx="parallax" */
.quotes-carousel__bg {
  position: absolute;
  inset: 0;
  background-image: url('https://images.circusliving.com/CircusLivingParallax.jpg');
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
}

.quotes-carousel__track {
  position: relative;
  z-index: 1;
  min-height: 350px;
}

.quotes-carousel__slide {
  display: none;
  min-height: 350px;
  position: relative;
}

.quotes-carousel__slide--active {
  display: block;
}

.quotes-carousel__controls {
  position: absolute;
  bottom: 1rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.quotes-carousel__btn {
  background: transparent;
  border: none;
  color: #fff;
  font-size: 2rem;
  line-height: 1;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  opacity: 0.8;
  transition: opacity 0.2s;
}

.quotes-carousel__btn:hover,
.quotes-carousel__btn:focus-visible {
  opacity: 1;
  outline: 2px solid #fff;
  outline-offset: 2px;
}

.quotes-carousel__dots {
  display: flex;
  gap: 0.4rem;
}

.quotes-carousel__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  border: none;
  background: rgba(255, 255, 255, 0.5);
  cursor: pointer;
  padding: 0;
  transition: background 0.2s;
}

.quotes-carousel__dot--active,
.quotes-carousel__dot:hover {
  background: #fff;
}
</style>
