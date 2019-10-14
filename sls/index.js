const serverless  = require('serverless-http')
const app         = require('express')()
const bodyParser  = require('body-parser')
const generate    = require('./generator')
const deploy      = require('./deploy-bk')
const consola     = require('consola')
const schemaMap   = { 42132: 'articles' }
const fs          = require('fs')
const fse         = require('fs-extra')
const DIST_SIZE   = (fs.readdirSync('/var/task/dist')).length
const TEMP_SIZE   = (fs.readdirSync('/tmp')).length

app.use(bodyParser.json({ strict: false }))
consola.wrapConsole()

console.info(`DIST_SIZE:${DIST_SIZE}`)
console.info(`TEMP_SIZE:${TEMP_SIZE}`)

const post = async (req, res) => {
  const route = getPath(req.body.entity)
  
  initDist()
  await generate(route)
  await deploy(true)
  
  res.status(200).send('ok \n')
}

app.post('/', authorize, post)

app.use((req, res) => res.status(404).send({ code: 'notFound', statusCode: 404 }))

module.exports.main = serverless(app)

function authorize (req, res, next){
  let auth = req.headers.authorization || ' '

  auth = auth.replace(/^(Ticket|Token|Bearer)\s+/, '')

  const authorized = (auth === process.env.DEPLOY_AUTH)

  if(authorized) return next()
  
  return res.status(401).send({ code: 'not authorized', statusCode: 401 })
}

function getPath({ relationships, attributes }){
  const schemaId = relationships.item_type.data.id
  const { identifier } = attributes

  return `/${schemaMap[schemaId]}/${identifier}`
}

function initDist(){
  const options = { overwrite: true, preserveTimestamps: true }

  console.info(`DIST_SIZE:${DIST_SIZE} === TEMP_SIZE:${TEMP_SIZE}`)
  if(TEMP_SIZE == DIST_SIZE+1)
    return console.info(`TEMP_SIZE:${TEMP_SIZE} == DIST_SIZE:${DIST_SIZE+1}`)

  console.time('initDist')

  //fse.copySync(`/var/task/.awspublish-${process.env.NODE_ENV}`, `/tmp/.awspublish-${process.env.NODE_ENV}`, options)
  fse.copySync('/var/task/dist', '/tmp', options)

  console.timeEnd('initDist')

  const SIZE = (fs.readdirSync('/tmp')).length

  consola.success('=======================')
  consola.success(`Dist initiated at /tmp ${SIZE}`)
  consola.success('=======================')
}