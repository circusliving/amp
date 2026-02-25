<!--
  Icon — Renders a single SVG icon from the <CLIcons> sprite sheet.

  Uses SVG 2 `href` instead of the deprecated `xlink:href`.
  Requires <CLIcons> to be mounted somewhere in the layout before use.

  Migrated from `components/Icon.vue` (Vue 2 Options API → Vue 3 <script setup lang="ts">).
  `.icon` duplicate CSS removed from CLIcons — single source here.

  @example
  <Icon name="facebook" />
  <Icon name="youtube" :size="24" />
-->
<script setup lang="ts">
const props = defineProps<{
  /** Icon id — matches the `id="icon-{name}"` symbol in CLIcons. */
  name: string;
  /** Override the rendered size in pixels. Defaults to `1em` via CSS. */
  size?: number;
}>();

const style = computed(() =>
  props.size ? { width: `${props.size}px`, height: `${props.size}px` } : undefined,
);
</script>

<template>
  <svg
    class="icon"
    :class="`icon-${name}`"
    :style="style"
    aria-hidden="true"
    focusable="false"
  >
    <use :href="`#icon-${name}`" />
  </svg>
</template>

<style scoped lang="scss">
// Single source of truth for the `.icon` base styles.
// Old duplicated definition in CLIcons.vue has been removed.
.icon {
  display: inline-block;
  width: 1em;
  height: 1em;
  stroke-width: 0;
  stroke: currentColor;
  fill: currentColor;
  vertical-align: middle;
}

// youtube SVG has a non-square viewBox
:global(.icon-youtube) {
  width: 0.857421875em;
}
</style>
