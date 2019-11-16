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

const ENV    = process.env.NODE_ENV || 'dev'

loadEnvVars()

const Bucket = process.env.AWS_BUCKET_NAME
const Prefix = process.env.AWS_KEY_PREFIX


const config = {
  options          : { simulate: false },
  params           : { Bucket, Prefix },
  deleteOldVersions: true,
  headers          : { 'Cache-Control': 'max-age=60, no-transform, public', 'content-encoding': 'gzip'  },
  distDir          : 'dist',
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

const deploy = (cb, isLambdaEnv = false) => {
  if(isLambdaEnv) lambdaConfig()

  consola.info(`Deploy started to: ${Bucket}/${Prefix}`)
  let   g  = gulp.src('./' + config.distDir + '/**')

  const publisher = awspublish.create(config, config)


  g = g.pipe(rename((path) => { path.dirname = `${Prefix}/${path.dirname}` }))

  g = g.pipe(awspublish.gzip())

  // create a cache file to speed up consecutive uploads
  g = g.pipe(publisher.cache())
    
  g = g.pipe(parallelize(publisher.publish(config.headers, config.options), config.concurrentUploads))
  
  // Delete removed files
  if (config.deleteOldVersions && !isLambdaEnv)
    g = g.pipe(publisher.sync(process.env.AWS_KEY_PREFIX))


  if (cfConfig.distribution)
    g = g.pipe(through.obj((chunk, enc, cb) => {
      const { s3 } = chunk

      if(s3 && s3.path.includes('/index.html'))
        s3.path = s3.path.replace('/index.html', '')

      cb(null, chunk)
    }))

  // Invalidate CDN
  if (cfConfig.distribution)
    g = g.pipe(cloudfront(cfConfig))


  // print upload updates to console
  g = g.pipe(awspublish.reporter())
  
  
  return new Promise((resolve, reject) => {
    console.time('deploy')
    g.on('end', () => {
      console.timeEnd('deploy')
      done()
      resolve(g)
    })
    g.on('error', (e) => {
      console.timeEnd('deploy')
      reject(e)
    })
  })
}

module.exports = deploy

function loadEnvVars(){
  try {
    console.log(`.${ENV}.env`)
    if (fs.existsSync(resolve(process.cwd(), `.${ENV}.env`)))
      return variableExpansion(dotenv.config({ path: resolve(process.cwd(), `.${ENV}.env`) }))
    console.log(`.${ENV}.env.local`)
    if (fs.existsSync(resolve(process.cwd(), `.${ENV}.env.local`)))
      return variableExpansion(dotenv.config({ path: resolve(process.cwd(), `.${ENV}.env.local`) }))
    console.log(`.${ENV}.envprod`)
    variableExpansion(dotenv.config({ path: resolve(process.cwd(), '.env') }))
  }
  catch(err){
    consola.error('Deploy.loadEnvVars error:', err)
  }
}

function done(){
  consola.log('\n')
  consola.success('====================================')
  consola.success('          Deploy complete')
  consola.success('====================================')
  console.log('\n')
  console.log('\n')
}

function lambdaConfig(){
  config.cacheFileName = `/tmp/.awspublish-${ENV}`
  config.distDir       = '/tmp'
}

function getEnv(){
  if(process.env.NODE_ENV === 'production') return 'prod'
  return process.env.NODE_ENV || 'dev'
}