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
  generate: { routes: all, interval: 2000, dir: '/dist' },
  dev     : false
}

async function generate (route, dir = '/dist'){
  console.time('route:generate')

  const routes = [ route ]

  configOverride.generate = { ...configOverride.generate, ...{ routes, dir } }

  const aNuxt      = new Nuxt({ ...config, ...configOverride,  hooks })
  const aBuilder   = new Builder(aNuxt)
  const aGenerator = new Generator(aNuxt, aBuilder)

  await aGenerator.generate({ build: false, init: false })

  console.timeEnd('route:generate')
}

module.exports = generate

function done(nuxt, errors){
  consola.log('\n')
  consola.success('====================================')
  consola.success('Generation of static routes complete')
  consola.success('====================================')
  consola.log('\n')
  consola.log('\n')
  if(errors.length)
    withErrors(errors)
}

function withErrors(errors){
  console.error('errors', errors)
  process.exit(1)
}

function routeFailed(nuxt, errors){
  consola.error('route failed', errors)
}