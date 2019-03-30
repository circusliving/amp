<template>
  <section class="container">
    <div class="row">
      <div class="col-sm-4">
        <slot name="first"/>
      </div>
      <!-- /col -->
      <div class="col-sm-4">
        <slot name="second"/>
      </div>
      <!-- /col -->
      <div class="col-sm-4">
        <slot name="third"/>
      </div>
      <!-- /col -->
    </div>
  </section>
</template>
<script>
  export default {
    name: 'AmpThreeCards'
  }

</script>
