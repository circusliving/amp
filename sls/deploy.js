const   gulp               = require('gulp')
const   rename             = require('gulp-rename')
const   awspublish         = require('gulp-awspublish')
const   cloudfront         = require('gulp-cloudfront-invalidate-aws-publish')
const   parallelize        = require('concurrent-transform')
const   dotenv             = require('dotenv')
const   variableExpansion  = require('dotenv-expand')
const   consola            = require('consola')
const   through            = require('through2')
const   fs                 = require('fs')
const { resolve         }  = require('path')
const   path               = require('path')
const ENV    = process.env.NODE_ENV || 'dev'

loadEnvVars()

const Bucket = process.env.AWS_BUCKET_NAME
const Prefix = process.env.AWS_KEY_PREFIX

const config = {
  options          : { simulate: false },
  params           : { Bucket, Prefix },
  deleteOldVersions: true,
  headers          : { 'Cache-Control': 'max-age=315360000, no-transform, public', 'content-encoding': 'gzip'  },
  distDir          : '/tmp',
  indexRootPath    : false,
  cacheFileName    : `.awspublish-${ENV}`,
  concurrentUploads: 50
}

const cfConfig = {
  distribution : process.env.AWS_CLOUDFRONT, // CloudFront distribution ID
  wait         : false,  // wait for CloudFront invalidation to complete (about 30-60 seconds)
  indexRootPath: true,
  originPath   : `/circusliving.com/${ENV}/`
}

const deploy = (isLambda = false) => {
  consola.info(`Deploy started to: ${Bucket}/${Prefix}`)
  console.time('deploy')

  if(isLambda)
    config.cacheFileName = `/tmp/.awspublish-${ENV}`
    
  let   g         = readFiles()
  const publisher = awspublish.create(config, config)

  g = setBucketPrefix(g)
  g = gzip(g)
  g = createCacheFile(g, publisher)
  g = setConcurrentUpload(g, publisher)
  g = deleteRemovedFiles(g, publisher, isLambda)
  g = invalidCDN(g)
  g = reportUpdatesToConsole(g, isLambda)
  
  return new Promise((resolve, reject) => {
    g.on('end',   ()  => { console.timeEnd('deploy'); done(); return resolve(g); })
    g.on('error', (e) => { console.timeEnd('deploy'); return reject(e); })
  })
}

module.exports = deploy

// create a cache file to speed up consecutive uploads
function setConcurrentUpload(g, publisher){
  return g.pipe(parallelize(publisher.publish(config.headers, config.options), config.concurrentUploads))
}

// create a cache file to speed up consecutive uploads
function createCacheFile(g, publisher){ return g.pipe(publisher.cache()) }

function readFiles(){ return gulp.src('./' + config.distDir + '/**') }

function gzip(g){ return g.pipe(awspublish.gzip()) }

function setBucketPrefix(g){
  if(!config.params.Prefix) return g

  return g.pipe(rename((path) => { path.dirname = process.env.AWS_KEY_PREFIX+'/'+path.dirname }))
}

function reportUpdatesToConsole(g, isLambda){
  if(isLambda) return g
  
  return g.pipe(awspublish.reporter())
}

function pathFixForInvalidation(g){
  return g.pipe(through.obj((chunk, enc, cb) => {
    if(chunk.s3.path.includes('/index.html'))
      chunk.s3.path = chunk.s3.path.replace('/index.html', '')
    cb(null, chunk)
  }))
}

function invalidCDN(g){
  if (!cfConfig.distribution) return g

  g = pathFixForInvalidation(g)
  
  return g.pipe(cloudfront(cfConfig))
}

function deleteRemovedFiles(g, publisher, isLambda){
  if (config.deleteOldVersions && !isLambda)
    return g.pipe(publisher.sync(process.env.AWS_KEY_PREFIX))

  return g
}

function loadEnvVars(){
  try {
    if (fs.existsSync(resolve(process.cwd(), `.${ENV}.env`)))
      return variableExpansion(dotenv.config({ path: resolve(process.cwd(), `.${ENV}.env`) }))
    
    if (fs.existsSync(resolve(process.cwd(), `.${ENV}.env.local`)))
      return variableExpansion(dotenv.config({ path: resolve(process.cwd(), `.${ENV}.env.local`) }))
    
    variableExpansion(dotenv.config({ path: resolve(process.cwd(), '.env') }))
  }
  catch(err){
    consola.error(err)
  }
}

function done(){
  console.log('\n')
  consola.success('====================================')
  consola.success('          Deploy complete')
  consola.success('====================================')
}