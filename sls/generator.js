//TODO
// refactor 
//   - modules genertae to sitemap
//   - modules generate.getRoutes to all routes
// route to fail on image 404
// create list of failed routes
const   config                      = require('../nuxt.config')
const { Nuxt, Generator,  Builder } = require('nuxt')
const { all }                       = require('../modules/SiteMap')
const   consola                     = require('consola')
const   hooks                       = { generate: { done, routeFailed } }
const   configOverride              = { 
                                        
                                        generate: { routes: all, interval: 2000 }, 
                                        dev     :   false
                                      }

const aNuxt    = new Nuxt   ({ ...config, ...configOverride,  hooks })
const aBuilder = new Builder(aNuxt)

async function generate () {
  const aGenerator = new Generator(aNuxt, aBuilder)

  return aGenerator.generate({ build: false, init: false})
}

module.exports = generate()

function done(nuxt, errors){

  if(errors.length) process.exit(0)
  console.log('\n')
  consola.success('====================================')
  consola.success('Generation of static routes complete')
  consola.success('====================================')
}

function routeFailed(nuxt, errors){ 
  consola.error('route failed', errors) 
}

function paths(){
  consola.error('process.argv[2]', Array.isArray(process.argv[2]))
}