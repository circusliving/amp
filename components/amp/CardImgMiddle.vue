<template>
  <section>
    <div class="card-img-middle">
      <h3><nuxt-link  :to="link" >{{title}}</nuxt-link ></h3>
      <h4>{{subTitle}}</h4>
      <figure>
        <nuxt-link  :to="link" >
          <amp-img :src="image.src" :alt="image.alt" :width="image.width" :height="image.height" layout="responsive" ></amp-img>
        </nuxt-link >
      </figure>
      <p>
        {{description}}
        <br v-if="needsSpace()"/>
        <br v-if="needsSpace()"/>
      </p>
      <nuxt-link  :to="link" >CONTINUE READING</nuxt-link >
    </div>
  </section>
</template>
<script>
  export default {
    name: 'AmpCardImgMiddle',
    props:['title','subTitle','link','description','image'],
    methods:{
      needsSpace:function(){
        if(this.description.length <= 130)
          return true
        return false
      }

    }
  }
</script>
