<template>
  <h3 class="text-center title" >
      <span class="d-inline-block position-relative">
          <span class="section-title" :class="{light:light}">{{title}}</span>
      </span>
  </h3>
</template>

<script>
  export default {
    name: 'AmpSectionHeaderH3',
    props: [ 'title' , 'light']
  }
</script>

<style scoped>
.title{
    margin: 1em 0 1em 0;
}
    .section-title {
        font-weight: 700;
        display: inline-block;
        text-transform: uppercase;
        font-size: 18px;
        color: black
    }
    .light{
        color: white;
    }
    .section-title:after, .section-title:before {
        display      : inline-block;
        content      : "";
        border-top   : 1px solid #d9d9d9;
        border-bottom: 1px solid #d9d9d9;
        height       : 4px;
        position     : absolute;
        width        : 80px;
        top          : 55%;
    }
    .section-title:before {
        left: -100px;
    }
    .section-title:after {
        right: -100px;
    }
</style>