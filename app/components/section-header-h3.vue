<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    subtitle?: string;
    light?: boolean;
  }>(),
  { light: false },
);
</script>

<template>
  <h3 class="section-header-h3 text-center">
    <span class="d-inline-block position-relative">
      <span class="section-header-h3__title" :class="{ 'section-header-h3__title--light': light }">
        {{ title }}
      </span>
    </span>
    <span v-if="subtitle" class="section-header-h3__subtitle">{{ subtitle }}</span>
  </h3>
</template>

<style scoped>
.section-header-h3 {
  margin: 1em 0;
}

.section-header-h3__title {
  font-weight: 700;
  display: inline-block;
  text-transform: uppercase;
  font-size: 18px;
  color: #000;
}

.section-header-h3__title--light {
  color: #fff;
}

.section-header-h3__title::after,
.section-header-h3__title::before {
  display: inline-block;
  content: '';
  border-top: 1px solid #d9d9d9;
  border-bottom: 1px solid #d9d9d9;
  height: 4px;
  position: absolute;
  width: 80px;
  top: 55%;
}

.section-header-h3__title::before {
  left: -100px;
}

.section-header-h3__title::after {
  right: -100px;
}

.section-header-h3__subtitle {
  display: block;
  font-size: 13px;
  font-weight: 400;
  text-transform: none;
  margin-top: 0.25rem;
}
</style>
