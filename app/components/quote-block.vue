<script setup lang="ts">
defineProps<{
  quote: string;
  author?: string;
}>();
</script>

<template>
  <blockquote class="quote-block">
    <SectionHeaderH3 class="quote-block__header" title="HERALD" :light="true" />
    <p class="quote-block__text">{{ quote }}</p>
    <footer v-if="author" class="quote-block__author">{{ author }}</footer>
  </blockquote>
</template>

<style scoped>
.quote-block {
  position: absolute;
  margin: auto;
  left: 10%;
  right: 10%;
  top: 0;
  bottom: -20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  border: none;
  padding: 0;
}

.quote-block__header {
  display: none;
}

.quote-block__text {
  color: #fff;
  font-family: 'Roboto Slab', serif;
  font-size: 1em;
  font-weight: 300;
  line-height: 1.2em;
  padding: 0 8%;
  text-align: center;
  margin: 0;
}

.quote-block__author {
  color: #fff;
  text-transform: uppercase;
  font-size: 0.8em;
  font-weight: 700;
  letter-spacing: 0.1em;
  margin-top: 0.5em;
}

@media screen and (min-width: 648px) {
  .quote-block {
    left: 10%;
    right: 10%;
    top: -10%;
    bottom: 0;
  }

  .quote-block__header {
    display: block;
  }

  .quote-block__text {
    font-size: 1.6em;
    line-height: 2em;
    padding: 0;
  }

  .quote-block__author {
    font-size: 1em;
  }
}
</style>
