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

function webPages(){ return Dato.webPages().then(processDocuments(webPageRouteProcessor)) }
function articles(){ return Dato.articles().then(processDocuments(articleRouteProcessor)) }

async function all(){
  try {
    const promises = (await Promise.all([ webPages(), articles() ]))

    return [].concat(...promises)
  }
  catch (er){ consola.error(er) }
}

module.exports = { default: all, articles, webPages, all }