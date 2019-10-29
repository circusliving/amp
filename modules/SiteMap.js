//TODO create xml for google
const consola     = require('consola')
const Dato        = require('./Dato')

const processDocuments = (routeProcessor) => (documents) => {
  const aSet  = []
  
  documents.forEach(doc => {
    const route       = routeProcessor(doc)
    const payload     = doc
    const routeObject = { route, payload }

    aSet.push(routeObject)
  })
  return aSet
}

//legacy identifier TODO handle identifier object
const typeRouteProcessor    = (route) => (type) => `/${type}/${route.identifier}`
const articleRouteProcessor = (route) => typeRouteProcessor(route)('articles')
const webPageRouteProcessor = (route) => route.path

function webPages(){ return Dato.webPages().then(mapWidgets).then(processDocuments(webPageRouteProcessor)) }
function articles(){ return Dato.articles().then(processDocuments(articleRouteProcessor)) }
function tags(){ return Dato.tags }
function collections(){ return Dato.collections }

async function all(){
  try {
    const promises = (await Promise.all([ webPages(), articles() ]))

    return [].concat(...promises)
  }
  catch (er){ consola.error(er) }
}

function mapWidgets(pages){
  pages.forEach(async (page) => {
    if(page.widgetCollections.length){
      page.collectionsMap = page.widgetCollections.map((c) => getCollection(c))

      page.collectionsMap = await Promise.all(page.collectionsMap)
    }
    if(page.widgetTags)
      page.tagsMap = page.widgetTags
  })
  
  return pages
}

async function getCollection(id){
  return (await collections()).find(col => (col.id === id)).name
}


module.exports = { default: all, articles, webPages, all, tags, collections  }