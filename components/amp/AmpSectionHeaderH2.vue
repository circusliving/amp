<template>
  <h2 class="text-center" >
      <span class="d-inline-block position-relative">
          <span class="section-title">{{title}}</span>
      </span>
  </h2>
</template>

<script>
  export default {
    name: 'AmpSectionHeaderH2',
    props: [ 'title' ]
  }
</script>

<style scoped>
    .section-title {
        font-weight: 700;
        display: inline-block;
        text-transform: uppercase;
        font-size: 24px;
    }
    @media screen and (min-width: 992px) {
        .section-title:after, .section-title:before {
            display      : inline-block;
            content      : "";
            border-top   : 1px solid #d9d9d9;
            border-bottom: 1px solid #d9d9d9;
            height       : 4px;
            position     : absolute;
            width        : 80px;
            top          : 50%;
        }
        .section-title:before {
            left: -100px;
        }
        .section-title:after {
            right: -100px;
        }
    }
</style>