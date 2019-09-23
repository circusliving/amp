import gql            from 'graphql-tag'
import clone          from 'lodash.clone'
import webPageByPath  from '~/apollo/webPageByPath'
import ImageService   from '~/modules/ImageService'
import path           from 'path'
import pluralize      from 'pluralize'

export default {
  scrollToTop: true,
  head,
  asyncData,
}

function genRoute({ section, page }) {
  if( section && page )
    return `/${section}/${page}`
  if( section )
    return `/${section}`
  return '/'
}

async function asyncData ({ app, params }) {
  
  let webPage           = await getWebPage ( app, genRoute(params) ) || {}
  
  let { items, count }  = await getItems   ( app, webPage.collectionsMap, webPage.tagsMap )

  if(webPage)
    await Promise.all([ImageService.setDimensions(webPage.image),ImageService.setDimensions(webPage.coverImage)])

  return  {
            items        : items,
            count        : count,
            name         : webPage.name,
            description  : webPage.description,
            page         : webPage,
            description  : webPage.description,
            image        : ImageService.getDimensions(webPage.image),
            alternateName: webPage.alternateName,
            widget       : webPage.widget,
            coverImage   : ImageService.getDimensions(webPage.coverImage)||ImageService.getDimensions(webPage.image),
          }
}

function head () {
  return {
    title: this.alternateName || this.name,
    link: [
      // We use $route.path since we don't use query parameters
      { hid: 'canonical'             , rel: 'canonical' , href:  path.normalize(`https://${process.env.BASE_URL}${process.env.BASE_PATH}${this.$route.path}`) },
      { hid: 'stylesheet-roboto-slab', rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto+Slab:300,700'                    },
      { hid: 'stylesheet-roboto'     , rel: 'stylesheet', href: 'https://fonts.googleapis.com/css?family=Roboto:400'                             }
    ],
    meta: [
      { hid: 'title'              , name: 'title'              , content: this.alternateName || this.name},
      { hid: 'description'        , name: 'description'        , content: this.description               },
      { hid: 'twitter:title'      , name: 'twitter:title'      , content: this.alternateName || this.name},
      { hid: 'twitter:description', name: 'twitter:description', content: this.description               },
      { hid: 'og:title'           , name: 'og:title'           , content: this.alternateName || this.name},
      { hid: 'og:description'     , name: 'og:description'     , content: this.description               },
      { hid: 'lang'               , name: 'lang'               , content: 'en'                           },
      { hid: 'og:image'           , name: 'og:image'           , content: this.image.src                 },
      { hid: 'twitter:card'       , name: 'twitter:card'       , content: 'summary'                      },
      { hid: 'twitter:site'       , name: 'twitter:site'       , content: '@cathoulahan'                 },
      { hid: 'twitter:image'      , name: 'twitter:image'      , content: this.image.src                 },
      { hid: 'twitter:image:alt'  , name: 'twitter:image:alt'  , content: this.alternateName || this.name}
    ]
  }
}


function collectionsQuery(collections=['articles'], tags=['notag']){
  let queries = ''

  for (let i = 0; i< collections.length; i++) 
      queries +=collectionsQueryPartial(pluralize(collections[i]),tags) 

  return gql`{
              ${queries}
            }`
}

function collectionsQueryPartial(col='Articles', tags){
  if(['Articles','People','WebPages','Events'].includes(col)) return legacyQuery(tags)

  return `all${capitalize(col)}( first:100, filter: { tags: { anyIn: ${JSON.stringify(tags)} } })
          {
            name
            alternateName
            description
            identifier {
              name
              value
            },
            image {
              contentUrl
              height {
                value
                name
                unitText
              }
              width {
                name
                value
                unitText
              }
              caption
            }
            url
          }

          _all${capitalize(col)}Meta {
            count
          }
          `
}

function legacyQuery(tags){

  return `allArticles( first:100, filter: { tags: { anyIn: ${JSON.stringify(tags)} } })
          {
            name,
            alternateName,
            description,
            coverImage,
            image,
            identifier,
            url
          }

          _allArticlesMeta {
            count
          }
          `
}

function capitalize (s) {
  if (typeof s !== 'string') return ''
  return s.charAt(0).toUpperCase() + s.slice(1)
}

async function getWebPage( { apolloProvider }, path ){
 
  let page = (await apolloProvider.defaultClient.query({
                query    : webPageByPath,
                variables: {path: path}
              })).data.webPage

  if(!page) console.error('no page found ----------------------------------------------------------------------------', path)
  if(!page) return null
  
  page.collectionsMap = page.widgetCollections.map((c)=>c.name)
  page.tagsMap        = page.widgetTags.map((c)=>c.id)


  return page
}

async function queryColls (apollo,collNames, tags) {

  return (await apollo.defaultClient.query({
                      query: collectionsQuery(collNames,tags)
                    })).data
}

async function getItems( app, collNamesArr, tags ){

  let apollo      = app.apolloProvider
  let collNames   = clone(collNamesArr)

  if(!collNames || !collNames.length || !collNames.length) return {items:'', count:''}

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
   
  await injectImageDimensions (app, items)
console.log(items[0])
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
  
  try{
    images = await Promise.all(images)
  }catch(e){
    console.warn(e.message)
  }

  for (let i = 0; i < images.length; i++) {
    items[i].imageObj        = {}
    items[i].imageObj.width  = Number(images[i]['x-amz-meta-width'])
    items[i].imageObj.height = Number(images[i]['x-amz-meta-height'])
    items[i].imageObj.alt    = images[i]['x-amz-meta-alt'] || images[i]['x-amz-meta-tags']
    items[i].imageObj.src    = items[i].image
    items[i].imageObj.srcset = ImageService.getSrcSet(items[i].imageObj)
  }

  return images
}