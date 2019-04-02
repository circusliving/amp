<template>
  <div class="card">

    <div class="card-body text-center">
      <h3 class="c-title">
        <nuxt-link :to="getPath"> :alt="name">{{name}}</nuxt-link>
      </h3>
    </div>
    <div > 
      <figure class="position-relative">
        <nuxt-link :to="getPath">
          <div class="text-overlay">
            <div class="info" >Learn More</div>
          </div>
          <amp-img :srcset="imageObj.srcset" :width="imageObj.width" :height="imageObj.height" layout="responsive"></amp-img>
        </nuxt-link>
      </figure>
    </div>
    <div class="card-body">
      <p class="card-text">{{description}}</p>
      <!-- <p class="card-text"><small class="text-muted">Last updated 3 mins ago</small></p> -->
    </div>
  </div>
</template>
<script>
  import {getPath} from '~/modules/helpers'

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
    computed: {getPath}
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
  .c-title a{
    font-size: 18px;
    color: #444;
    font-weight: normal;
    text-decoration: none;
    -webkit-transition: all 200ms ease-in;
     font-weight: 700 !important;
  }

  .c-title a:hover {
    color: #28b8d8;
  }
  figure a .text-overlay {
    opacity: 0;
    height: 100%;
    max-height: 222px;
    position: absolute;
    text-decoration: none;
    width: 100%;
    z-index: 100;
    padding: 20px;
    background: #28b8d8;
    background: rgba(40,184,216,0.90);
    -webkit-transition: all 0.4s;
    -moz-transition: all 0.4s;
    -o-transition: all 0.4s;
    transition: all 0.4s;
  }
  figure a:hover .text-overlay {
      opacity: 1
  }
  figure a .text-overlay:before {
      content: "";
      display: block;
      position: absolute;
      z-index: -1;
      top: 10px;
      left: 10px;
      right: 10px;
      bottom: 10px;
      border: 1px solid rgba(255,255,255,0.3);
  }
  figure a .text-overlay .info {
      text-align: center;
      top: 50%;
      width: 100%;
      left: 0;
      position: absolute;
      margin-top: -11px;
      color: #fff;
      font-size: 14px;
      font-weight: normal;
      text-transform: uppercase;
  }
</style>