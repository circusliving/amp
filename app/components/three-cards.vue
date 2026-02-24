<template>
  <section class="container">
    <div class="row">
      <div class="col-sm-4">
        <slot name="first" />
      </div>
      <div class="col-sm-4">
        <slot name="second" />
      </div>
      <div class="col-sm-4">
        <slot name="third" />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// No props — layout shell with three named slots.
</script>
