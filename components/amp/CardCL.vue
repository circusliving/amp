<template>
  <section>
    <div class="bordered">
      <figure>
        <nuxt-link  :to="link" :aria-label="title">
          <amp-img :src="image.src" :alt="image.alt" :width="image.width" :height="image.height" layout="responsive" ></amp-img>
        </nuxt-link >
      </figure>
      <h3>{{title}}</h3>
      <h4>{{subTitle}}</h4>
      <p>
        {{description}}
        <br v-if="needsSpace()"/>
        <br v-if="needsSpace()"/>
      </p>
    </div>
  </section>
</template>
<script>
  export default {
    name: 'AmpCardCL',
    props:['title','subTitle','link','description','image'],
    methods:{
      needsSpace:function(){
        if(!this.description) return false
        if(this.description.length <= 152)
          return true
        return false
      }

    }
  }
</script>
<style scoped>
.bordered {
    border: 1px solid rgba(0,0,0,0.1);
    padding: 20px 15px 5px 15px;
    text-align: center;
    background-color: white;
    margin-bottom: 1em;
    min-height: 470px;
}
.bordered h4{
  font-size: 23px;
  font-weight: 400;
  font-family: "Euphoria Script", cursive, serif;
  margin: .75em 0 .75em 0;
}
.bordered h3{
  font-weight: 600;
  font-size: 18px;
  color: black;
  font-family: "Roboto Slab", serif;
}

.bordered figure {
    margin-bottom: 20px;
    text-align: center;
}
</style>