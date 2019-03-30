<template>
  <section >
    <HeroTitle :title="article.name" :image="article.coverImage"/>
    <div class="container-fluid" v-html="article.text"></div>
  </section>
</template>

<script>
  import articleByIdentifier from '~/apollo/articleByIdentifier'
  import AmpSectionHeader from '~/components/amp/AmpSectionHeader'
  import HeroTitle from '~/components/amp/HeroTitle'  
  import webPageMixin   from '~/modules/webPageMixin'
  export default {
    name: 'AmpArticle',
    layout: 'amp',
    mixins:[webPageMixin],    
    components: { AmpSectionHeader, HeroTitle },
    async asyncData ({ app, params, error}) {
      let article = (await app.apolloProvider.defaultClient.query({
        query: articleByIdentifier,
        variables: { identifier: params.id }
      })).data.article

      if(article===null) 
        return error({ statusCode: 404, message: `/amp/articles/${params.id} not found` })
 
      app.$ToAMP.loadHtml(article.text)
      await app.$ToAMP.loadImages()
      console.log('app.$ToAMP.imgAttribs',app.$ToAMP.imgAttribs)
      let addAttrbs = await getImageAttrs(app.$axios,app.$ToAMP.imgAttribs)
      console.log('addAttrbs',addAttrbs)
      app.$ToAMP.convertImages(addAttrbs)
      article.text=app.$ToAMP.toHTML()
      // article.text = await Ampy.images(article.text)

      return {
        article      : article,
        name         : article.name,
        description  : article.description || '',
        image        : article.image || article.coverImage,
        alternateName: article.alternateName,
        url          : article.url
      }
    }
  }

  function getImageTags (text) {
    console.log($('img', text).length)
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
    // apollo: {
    //   article: {
    //     query: articleByIdentifier,
    //     prefetch: ({ route }) => ({ identifier: route.params.id }),
    //     variables () {
    //       return { identifier: this.$route.params.id }
    //     }
    //   }
    // }
    // asyncData ({ params }) {
    // return axios.get(`https://api.houlahan.ca/api/2017/posts/${params.post}`)
    //   .then((res) => {
    //     return { post: res.data }
    //   })
    // }
  // }
</script>

<style scoped>
  .article-content p{
    padding: 0 1em 0 1em;
  }
</style>

