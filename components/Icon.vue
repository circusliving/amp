<template>
    <svg class="icon" :class="{[`icon-${name}`]:name}"><use :xlink:href="`#icon-${name}`"></use></svg>
</template>

<script>
  export default {
    name: 'Icon',
    props:['name', 'size']
  }
</script>

<style>
    .icon {
        display: inline-block;
        width: 1em;
        height: 1em;
        stroke-width: 0;
        stroke: currentColor;
        fill: currentColor;
    }

    .icon-youtube {
        width: 0.857421875em;
    }
</style>
