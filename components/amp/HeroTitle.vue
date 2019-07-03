<template>
  <header class="amp-header-hero">

    <div class="hero-parallax-image-float">
      <div class="hero-parallax-image-window">
        <amp-img amp-fx="parallax" data-parallax-factor=".20" class="cover" v-if="src" :src="src" layout="fill" :alt="image.alt"></amp-img>
      </div>
    </div>

    <div class="amp-page-hero">
      <h1>{{title}}</h1>
    </div>

  </header>
</template>

<script>
const { Url } = require("url");
const url = new Url();
import path from "path";

export default {
  name: "HeroTitle",
  props: {
    title: { type: String, required: true },
    image: { type: Object  },
    tint:  { type: Boolean, default: false }
  },
  computed: { src }
};

function src() {
  
  if (!this.image.src) return ''

  let parsedUrl = url .parse   (`${this.image.src}`)
  let ext       = path.extname (parsedUrl.pathname)
  let baseName  = path.basename(parsedUrl.pathname,ext)
  let imgPath   = path.dirname(parsedUrl.pathname)

  if(this.tint && baseName!='CircusLiving-Header') imgPath = `/o:65${imgPath}`

  if (!~baseName.indexOf('.min'))
    imgPath = path.normalize(`${imgPath}/${baseName}.min${ext}`)
  // else
  //   imgPath = imgPath

  return `https://${parsedUrl.host}${imgPath}`;
}
</script>

<style>
  .cover > img {
    object-fit: cover;
  }
  .hero-parallax-image-window amp-img {
     margin: -5% 0 0 0;
  }
</style>

<style scoped>

  .amp-header-hero {
    position: relative;
    min-height: 550px;
    overflow: hidden;
    background-color: black;
  }
  .hero-parallax-image-float{
    margin: auto;
    position:absolute; 
    top:0; 
    bottom:0; 
    left:0; 
    right:0;
  }
  .hero-parallax-image-window {
    min-height: 550px;
    overflow: hidden;
  }

  .amp-page-hero {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .amp-page-hero h1 {
    padding-top: 66px;
    color: white;
    text-align: center;
    font-family: "Roboto Slab", serif;
    z-index: 100;
  }
</style>
