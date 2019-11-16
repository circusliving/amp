<template>
  <article >
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
        
          <div class="col-sm-4 aside-cont">
            <aside >
              <PopularPosts />
            </aside>
          </div>
        
      </div>
    </div>
  </article>
</template>

<script>
  import articleByIdentifier from '~/apollo/articleByIdentifier'
  import ImageService        from '~/modules/ImageService'
  import HeroTitle           from '~/components/amp/HeroTitle'
  import PopularPosts        from '~/components/amp/PopularPosts'
  import path                from 'path'
  import stripHtml           from 'string-strip-html'

  export default {
    name       : 'AmpArticle',
    head       ,
    components : { HeroTitle, PopularPosts },
    scrollToTop: true,
    asyncData  ,
    computed   : { hasAlternateName, width, height, alt },
    methods    : { genDescription }
  }

  async function asyncData ({ app, params, error, payload }) {
    
    const article = payload? payload : await query( app, params.id )

    if(article===null) 
      return error({ statusCode: 404, message: `/articles/${params.id} not found` })

    app.$ToAMP.loadHtml(article.text)
    await Promise.all([ImageService.setDimensions(article.image),ImageService.setDimensions(article.coverImage),app.$ToAMP.loadImages()])

    let addAttrbs = await getImageAttrs(app.$axios,app.$ToAMP.imgAttribs)

    app.$ToAMP.convertImages(addAttrbs)
    article.text=app.$ToAMP.toHTML()

    return {
      article      : article,
      name         : article.name,
      description  : article.description || '',
      image        : article.image || article.coverImage,
      alternateName: article.alternateName,
      coverImage   : ImageService.getDimensions(article.coverImage)||{},
      url          : article.url
    }
  }

async function query(app, identifier){
  return (await app.apolloProvider.defaultClient.query({
      query: articleByIdentifier,
      variables: { identifier } 
    })).data.article
}
  function width(){
      return ImageService.width(this.image)
  }
    
  function height(){
      return ImageService.height(this.image)
  }

  function alt(){
      return ImageService.alt(this.image)
  }

  function hasAlternateName () {
    let article = this.article
    if(!article.alternateName) return false
    if(article.alternateName && article.name !== article.alternateName) return true
    return false
  }

  async function getImageAttrs (axios, attrs) {

    try {
      let ampAttrs = []
      let headers = []
      for (let i = 0; i < attrs.length; i++) 
        headers[i] = axios.head(attrs[i].src)
      
      headers = await Promise.all(headers)

      for (let i = 0; i < headers.length; i++) {
        headers[i] = headers[i].headers
        ampAttrs[i] = Object.assign( attrs[i], { width:Number(headers[i]['x-amz-meta-width']), height: Number(headers[i]['x-amz-meta-height']) })
      }

      return ampAttrs
    }catch(e){
      console.error(e.toString())
    }
  }


function genDescription (){
  let desc = stripHtml(this.article.text)
  return desc.substring(0,165)
}

  function     head () {
      return {
        title: this.alternateName || this.name,
        link: [
          {
            hid: 'canonical',
            rel: 'canonical',
            href: path.normalize(`https://${process.env.BASE_URL}${process.env.BASE_PATH}${this.$route.path}`)
          },
          {
            hid: 'stylesheet-roboto-slab',
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:300,700'
          },
          {
            hid: 'stylesheet-roboto',
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css?family=Roboto:400'
          },
          {
            hid: 'stylesheet-roboto-condensed',
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css?family=Roboto+Condensed:700'
          },
          {
            hid: 'stylesheet-walter-turncoat',
            rel: 'stylesheet',
            href: 'https://fonts.googleapis.com/css?family=Walter+Turncoat'
          }
        ],
        meta: [
          { hid: 'title'              , name: 'title'              , content: this.alternateName || this.name},
          { hid: 'description'        , name: 'description'        , content: this.description  || this.genDescription() },
          { hid: 'twitter:title'      , name: 'twitter:title'      , content: this.alternateName || this.name},
          { hid: 'twitter:description', name: 'twitter:description', content: this.description               },
          { hid: 'og:title'           , name: 'og:title'           , content: this.alternateName || this.name},
          { hid: 'og:description'     , name: 'og:description'     , content: this.description               },
          { hid: 'lang'               , name: 'lang'               , content: 'en'                           },
          { hid: 'og:image'           , name: 'og:image'           , content: this.image                     },
          { hid: 'twitter:card'       , name: 'twitter:card'       , content: 'summary'                      },
          { hid: 'twitter:site'       , name: 'twitter:site'       , content: '@cathoulahan'                 },
          { hid: 'twitter:image'      , name: 'twitter:image'      , content: this.image                     },
          { hid: 'twitter:image:alt'  , name: 'twitter:image:alt'  , content: this.alternateName || this.name}
        ]
      }
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
  .debug{
  border-color:red;
  border-style: solid;
  border-width: 1px;
}
.debugB {
  border: 1px solid blue;
}
  .aside-cont{
   padding-top: 3em;
  }
</style>

