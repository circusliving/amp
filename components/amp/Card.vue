<template>
  <div class="card">
    <div class="card-header">
      <h3 class="card-title">{{name}}</h3>
    </div>
    <!-- <img class="card-img-top" :src="image || coverImage" alt="Card image cap"/> -->
    <div > 
      <amp-img :srcset="imageObj.srcset" :width="imageObj.width" :height="imageObj.height" layout="responsive"></amp-img>
    </div>
    <div class="card-body">

      <p class="card-text">{{description}}</p>
      <!-- <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> -->
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Card',
    props: {
      name         : {type:String},
      alternateName: {type:String},
      description  : {type:String},
      image        : {type:String},
      coverImage   : {type:String},
      url          : {type:String},
      imageObj     : {type:Object}
    },
    methods: {}
  }
</script>
<style scoped>
  .bordered {
    border: 1px solid rgba(0, 0, 0, 0.1);
    padding: 20px 15px 5px 15px;
    text-align: center;
    background-color: white;
    margin-bottom: 1em;
  }
  .bordered h4 {
    font-style: italic;
    font-weight: lighter;
    font-family: "Euphoria Script", cursive, serif;
  }
  .bordered p {
    font-size: 0.8em;
  }
  .bordered figure {
    margin-bottom: 20px;
    text-align: center;
  }
</style>