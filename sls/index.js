const AWS        = require('aws-sdk')
const serverless  = require('serverless-http')
const app         = require('express')()
const bodyParser  = require('body-parser')
const generate    = require('./generator')
const consola     = require('consola')
const schemaMap   = { 42132: 'articles', 42133:'webPages' }
const fs          = require('fs')

const { gzipAtomic, readFile, writeFileAtomic } = require('fs-nextra')
const { resolve              } = require('path')
const { NODE_ENV             } = process.env

const Bucket = process.env.AWS_BUCKET_NAME
const Prefix = process.env.AWS_KEY_PREFIX

app.use(bodyParser.json({ strict: false }))

const post = async (req, res) => {
  const route = getPath(req.body.entity)
  const dist = '/tmp/dist'

  try{
    await generate(route, dist)
    await deploy({ dist, route })

    res.status(200).send('ok \n')
  }catch(e){
    console.error(e)
    res.status(500).send('error \n')
  }
  
}

app.post('/', authorize, post)
app.post('/local', authorize, post)

app.use((req, res) => res.status(404).send({ code: 'notFound', statusCode: 404 }))

module.exports.main = serverless(app)

async function deploy({dist, route}){
  const S3              = new AWS.S3({signatureVersion: 'v4'})
  const filePath        = dist + route +'/index.html.gz'
  const ContentEncoding = 'gzip'
  const CacheControl    = 'max-age=60, no-transform, public'
  const s3ObjectOptions = { Bucket, ContentEncoding, CacheControl  }

  await gzipAtomic(filePath, dist + route +'/index.html') 

  s3ObjectOptions.Key         = Prefix + route + '/index.html'

  s3ObjectOptions.Body        = await readFile(filePath)
  s3ObjectOptions.ContentType = 'text/html; charset=utf-8'
  s3ObjectOptions.ACL         = 'public-read'

  return S3.putObject(s3ObjectOptions).promise()
  
}

function authorize (req, res, next){
  let auth = req.headers.authorization || ' '

  auth = auth.replace(/^(Ticket|Token|Bearer)\s+/, '')

  const authorized = (auth === process.env.SLS_HOOK_AUTH)

  if(authorized) return next()
  
  return res.status(401).send({ code: 'not authorized', statusCode: 401 })
}

function getPath({ relationships, attributes }){
  const schemaId             = relationships.item_type.data.id
  const { identifier, path } = attributes

  if(path && schemaId === '42133') return  path

  if(schemaMap[schemaId]) return `/${schemaMap[schemaId]}/${identifier}`
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

  //fse.copySync('/var/task/dist', '/tmp', options)

  console.timeEnd('initDist')

  const SIZE = (fs.readdirSync('/tmp')).length

  consola.success('=======================')
  consola.success(`Dist initiated at /tmp ${SIZE}`)
  consola.success('=======================')
  consola.log('\n')
  consola.log('\n')
  next()
}