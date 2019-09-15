<template>
  <section >
    <HeroTitle :title="article.name" :image="coverImage" :tint="true" />
    <div class="container">
      <div class="row">
        <div class="col-sm-8">
          <div class="article">
            <h2 class="text-center">{{article.alternateName || article.name}}</h2>
            <div> 
              <amp-img  :alt="alt" :width="width" :height="height" layout="responsive" :src="article.image"></amp-img>
            </div>
            <div class="container-fluid" v-html="article.text"></div>
          </div>
        </div>
        <div class="col-sm-4">
          &nbsp;VARIABLES_NAME_HERE
        </div>
      </div>
    </div>
  </section>
</template>

<script>
  export default {
    name:       'Gallary',
  }
</script>

<style scoped>
  .article{
    padding: 1em 0 1em 0;
    margin: 3em 0 3em 0;
    border: 1px solid rgba(0,0,0,0.1);
    background-color: white;
  }
  .article h2 {
    font-family:"Roboto Slab", serif;
    font-size: 22px;
    color:#444;
    margin: 0 0 1em 0;
    font-weight: 700;
    line-height: 30px;
  }
  </style>
  <style>
  .container{
    padding: 0 0 0 0;
  }
  .section-title h3 {
      position: relative;
      display: inline-block;
      text-transform: uppercase;
      margin-bottom: 0;
      font-size: 18px;
      font-family: 'Roboto Condensed', sans-serif;
      line-height: 22px;
      color: #444;
      font-weight: 700;
     margin-block-start: 1em;
      margin-block-end: 1em;
      margin-inline-start: 0px;
      margin-inline-end: 0px;
  }

</style>

