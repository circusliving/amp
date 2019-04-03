<template>
  <section >
    <HeroTitle :title="page.name" :image="page.coverImage"/>
    <PageBody v-bind="page"/>
    <ImageList :items="items" v-if="widget"/>
    <CardList :items="items" v-if="!widget"/>
  </section>
</template>

<script>
  import gql            from 'graphql-tag'
  import clone          from 'lodash.clone'
  import webPageByPath  from '~/apollo/webPageByPath'
  import ImageService   from '~/modules/ImageService'
  import webPageMixin   from '~/modules/webPageMixin'

  import PageBody       from '~/components/amp/PageBody'
  import HeroTitle      from '~/components/amp/HeroTitle'  
  import ImageList      from '~/components/amp/ImageList'
  import CardList       from '~/components/amp/CardList'

  export default {
    name       : 'Page',
    layout     : 'amp',
    mixins     : [webPageMixin],
    components : { PageBody,ImageList,HeroTitle, CardList },
    asyncData
  } 

  async function asyncData ({ app, params, route }) {
    let apollo                      = app.apolloProvider
    let { section, page }           = params
    let webPage                     = await getWebPage(apollo, `/${section}/${page}`)
    let { items, count}             = await getItems  (apollo,  webPage.collectionsMap, webPage.tagsMap)
    let itemImages                  = await injectImageDimensions (app, items)
  
    await ImageService.setDimensions(webPage.image)
    await ImageService.setDimensions(webPage.coverImage)
console.log('items',items[0])    
console.log('items',items[1])  
console.log('items',items[2])  
    return  {
              items        : items,
              count        : count,
              name         : webPage.name,
              description  : webPage.description,
              page         : webPage,
              name         : webPage.name,
              description  : webPage.description,
              image        : webPage.image || webPage.coverImage,
              alternateName: webPage.alternateName,
              url          : webPage.url,
              widget       : webPage.widget
            }
  }

  function collectionsQuery(collections=['articles'], tags=['notag']){
    let queries = ''

    for (let i = 0; i< collections.length; i++) 
        queries +=collectionsQueryPartial(collections[i],tags) 

    return gql`{
                ${queries}
              }`
  }

  function collectionsQueryPartial(col='Articles', tags){

    return `all${capitalize(col)}( first:100, filter: { tags: { anyIn: ${JSON.stringify(tags)} } })
            {
              name,
              alternateName,
              description,
              coverImage,
              image,
              identifier,
              url
            }

            _all${capitalize(col)}Meta {
              count
            }
            `
  }

  function capitalize (s) {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  async function getWebPage( apollo, path ){

  let page = (await apollo.defaultClient.query({
                query    : webPageByPath,
                variables: {path: path}
              })).data.webPage

    page.collectionsMap = page.widgetCollections.map((c)=>c.name)
    page.tagsMap        = page.widgetTags.map((c)=>c.id)

    return page
  }

  async function queryColls (apollo,collNames, tags) {

    return (await apollo.defaultClient.query({
                        query: collectionsQuery(collNames,tags)
                      })).data
  }

  async function getItems( apollo, collNamesArr, tags ){

    let collNames   = clone(collNamesArr)

    if(!collNames.length || !collNames.length) return {items:'', count:''}

    let items       = []
    let count       = 0
    let collObjs    = Object.values(await queryColls(apollo, collNames, tags))

    // merge items from diff collections into one array
    for (const collection of collObjs) 
      if(!Array.isArray(collection))    //add counts
        count += collection.count
      else{                             //add items
        let name    = collNames.pop()
        let collMap = mapMollection(collection,name)

        items = items.concat(collMap)
      }
    

    return {items, count}
  }

  function mapMollection(collection,name){
    return collection.map((col)=>{
                                    col.collection = name
                                    return col
                                  }) 
  }

  async function injectImageDimensions ({$axios}, items) {
    let images = []

    for (let i = 0; i < items.length; i++) 
        images[i] = $axios.head( items[i].image).then((res)=>res.headers)
    
    images = await Promise.all(images)

    for (let i = 0; i < images.length; i++) {
      items[i].imageObj        = {}
      items[i].imageObj.width  = Number(images[i]['x-amz-meta-width'])
      items[i].imageObj.height = Number(images[i]['x-amz-meta-height'])
      items[i].imageObj.srcset = ImageService.getSrcSet(items[i].image)
    }

    return images
  }
</script>