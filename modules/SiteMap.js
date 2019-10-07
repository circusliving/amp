//TODO create xml for google
const consola     = require('consola')
const Dato        = require('./Dato')

const saveRoutes = (processor) => (routes) => {
  const aSet = []

  routes.forEach(route => aSet.push(processor(route)))
  return aSet
}

//legacy identifier TODO handle identifier object
const typeProcessor    = (route) => (type) => `/${type}/${route.identifier}`
const articleProcessor = (route) => typeProcessor(route)('articles')
const webPageProcessor = (route) => route.path

function webPages(){ return Dato.webPages().then(saveRoutes(webPageProcessor)) }
function articles(){ return Dato.articles().then(saveRoutes(articleProcessor)) }

async function all(){
  try {
    const promises = (await Promise.all([ webPages(), articles() ]))

    return [].concat(...promises)
  }
  catch (er){ consola.error(er) }
}

module.exports = { default: all, articles, webPages, all }