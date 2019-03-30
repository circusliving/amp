<template>
  <section>
    <div class="bordered">
      <figure>
        <nuxt-link  :to="link" >
          <amp-img :src="image" :alt="`${title} image`" width="338" height="222" layout="intrinsic" ></amp-img>
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
}
.bordered h4{
  font-style: italic;
  font-weight: lighter;
  font-family: "Euphoria Script", cursive, serif;
}
.bordered p{
  font-size: .8em;

}

.bordered figure {
    margin-bottom: 20px;
    text-align: center;
}
</style>