<script setup lang="ts">
defineProps<{
  title: string;
  subtitle?: string;
}>();
</script>

<template>
  <h2 class="section-header-h2 text-center">
    <span class="d-inline-block position-relative">
      <span class="section-header-h2__title">{{ title }}</span>
    </span>
    <span v-if="subtitle" class="section-header-h2__subtitle">{{ subtitle }}</span>
  </h2>
</template>

<style scoped>
.section-header-h2__title {
  font-weight: 700;
  display: inline-block;
  text-transform: uppercase;
  font-size: 24px;
}

@media screen and (min-width: 992px) {
  .section-header-h2__title::after,
  .section-header-h2__title::before {
    display: inline-block;
    content: '';
    border-top: 1px solid #d9d9d9;
    border-bottom: 1px solid #d9d9d9;
    height: 4px;
    position: absolute;
    width: 80px;
    top: 50%;
  }

  .section-header-h2__title::before {
    left: -100px;
  }

  .section-header-h2__title::after {
    right: -100px;
  }
}

.section-header-h2__subtitle {
  display: block;
  font-size: 14px;
  font-weight: 400;
  text-transform: none;
  margin-top: 0.25rem;
  color: #666;
}
</style>
