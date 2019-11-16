<template>
  <div class="card">
    <div class="card-body">
      <h3 class="widget-title">
        Popular Posts
      </h3>
      <hr/>
      <ul>
        <li v-for="a in latest" v-bind:key>
          <div class="icon-overlay"> 
            <div class="meta">
                  <h6> <nuxt-link  :to="`/articles/${a.identifier}`" > {{a.name}}</nuxt-link > </h6>
                  <em class="ng-binding">{{a._updatedAt | dateFormat}}</em> 
            </div>
            
            <nuxt-link  :to="`/articles/${a.identifier}`" >
              <!-- <amp-img :src="a.image" :alt="image(a.image).alt" :width="image(a.image).width" :height="image(a.image).height" layout="responsive" ></amp-img> -->
              <!-- <img ng-src="https://s3.amazonaws.com/houlahan.ca/circusliving.com/images/circuslivinglogo.png" alt="" src="https://s3.amazonaws.com/houlahan.ca/circusliving.com/images/circuslivinglogo.png"/> -->
            </nuxt-link >
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import { mapGetters } from 'vuex'
  import   ImageService from '~/modules/ImageService'

  export default {
    name    : 'PopularPosts',
    computed: { ...gettersMap() },
    filters : { dateFormat},
    methods : { image, loadImages },
    created
  }

  function created(){ this.loadImages() }

  async function image(path){
    
    const img = await ImageService.getDimensions(path)
    //console.log(img)
    return img
  }

  async function loadImages(){
    //console.log(this.latest)
    for (let i = 0; i < this.latest.length; i++) {
      
      await ImageService.setDimensions(this.latest[i].image)
    }
  }

  function gettersMap(){
    dateFormat()
    return mapGetters({
      latest  : 'article/latestArticle'
    })
  }

  function dateFormat(date){
    const  options = {  year: 'numeric', month: 'short', day: '2-digit' };
    return (new Date(date)).toLocaleDateString("en-US", options)

  }

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

<style scoped>
.widget-title{
  font-family: 'Roboto Condensed', sans-serif;
  font-weight: 700;
  font-size: 1.3em;
  color: #444;
  line-height: 1.6em;
  text-transform: uppercase;
}

</style>