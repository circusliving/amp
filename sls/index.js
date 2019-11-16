const serverless  = require('serverless-http')
const app         = require('express')()
const bodyParser  = require('body-parser')
const generate    = require('./generator')
const deploy      = require('./deploy')
const consola     = require('consola')
const schemaMap   = { 42132: 'articles' }
const fs          = require('fs')
const fse         = require('fs-extra')

app.use(bodyParser.json({ strict: false }))

const post = async (req, res) => {
  const route = getPath(req.body.entity)
  
  await generate(route, '/tmp')
  await deploy(() => {}, true)
  
  res.status(200).send('ok \n')
}

app.post('/', authorize, initDist, post)
app.post('/local', authorize, post)

app.use((req, res) => res.status(404).send({ code: 'notFound', statusCode: 404 }))

module.exports.main = serverless(app)

function authorize (req, res, next){
  let auth = req.headers.authorization || ' '

  auth = auth.replace(/^(Ticket|Token|Bearer)\s+/, '')

  const authorized = (auth === process.env.SLS_HOOK_AUTH)

  if(authorized) return next()
  
  return res.status(401).send({ code: 'not authorized', statusCode: 401 })
}

function getPath({ relationships, attributes }){
  const schemaId       = relationships.item_type.data.id
  const { identifier } = attributes

  return `/${schemaMap[schemaId]}/${identifier}`
}

// copies generated site included in SLS package to tmp dir as cache
// so no regenerated everey time.  then generated route in tmp
function initDist(req, res, next){
  const DIST_SIZE   = (fs.readdirSync('/var/task/dist')).length
  const TEMP_SIZE   = (fs.readdirSync('/tmp')).length

  if(TEMP_SIZE == DIST_SIZE+1){ 
    console.info(`No Init Dist: TEMP_SIZE:${TEMP_SIZE} == DIST_SIZE:${DIST_SIZE+1}`)
    return next()
  }

  console.time('initDist')
  const options = { overwrite: true, preserveTimestamps: true }

  fse.copySync('/var/task/dist', '/tmp', options)

  console.timeEnd('initDist')

  const SIZE = (fs.readdirSync('/tmp')).length

  consola.success('=======================')
  consola.success(`Dist initiated at /tmp ${SIZE}`)
  consola.success('=======================')
  consola.log('\n')
  consola.log('\n')
  next()
}