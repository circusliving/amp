<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps<{ error: NuxtError }>();

const handleClearError = () => clearError({ redirect: '/' });
</script>

<template>
  <div class="error-page">
    <div class="container text-center py-5">
      <h1 class="error-page__code">{{ error.statusCode }}</h1>
      <p class="error-page__message">{{ error.statusMessage || 'An error occurred' }}</p>
      <button class="btn btn-primary" @click="handleClearError">Go Home</button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;

  &__code {
    font-size: 6rem;
    font-weight: 700;
    line-height: 1;
  }

  &__message {
    font-size: 1.25rem;
    margin-bottom: 2rem;
  }
}
</style>
