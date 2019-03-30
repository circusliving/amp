<template>
  <footer class="amp-footer">
    <div class="row">
      <div class="col-sm">
        <span class="small">©{{year}} Circus Living. All rights reserved.</span>
      </div>
      <div class="col-sm social">
        <SocialBar/>
      </div>
    </div>
  </footer>
</template>

<script>
  import SocialBar from '../SocialBar.vue'

  export default {
    name: 'AmpFooter',
    components: { SocialBar },
    data() {
      let date = new Date()
      return {
        year: date.getFullYear()
      }
    }
  }
</script>

<style scoped>
  .amp-footer {
    background-color: black;
    color: white;
    min-height: 95px;
    padding: 0 1em 0 1em;
  }
  .small {
    font-size: 0.8em;
  }
  .social {
    text-align: right;
  }
  .col-sm {
    margin-top: 2em;
  }
  @media screen and (max-width: 575px) {
    .col-sm {
      text-align: center;
      margin-top: 0;
    }
    .row {
      padding: 1em 0 1.3em 0;
    }
    .social {
      padding-top: 1em;
    }
  }
</style>