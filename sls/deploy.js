const  gulp               = require('gulp')
const  rename             = require('gulp-rename')
const  awspublish         = require('gulp-awspublish')
const  cloudfront         = require('gulp-cloudfront-invalidate-aws-publish')
const  parallelize        = require('concurrent-transform')
const  dotenv             = require('dotenv')
const  variableExpansion  = require('dotenv-expand')
const  consola            = require('consola')
const  fs                 = require('fs')
const  AWS                = require('aws-sdk')
const { resolve          } = require('path')
const ENV = process.env.NODE_ENV || 'dev'
const through = require('through2')

loadEnvVars()


const config = {

  options: { simulate: false },
  // Required
  params : {
    Bucket: process.env.AWS_BUCKET_NAME,
    Prefix: process.env.AWS_KEY_PREFIX
  },

  // Optional
  deleteOldVersions: true,                 // NOT FOR PRODUCTION

  //region           : process.env.AWS_DEFAULT_REGION,
  headers          : { 'Cache-Control': 'max-age=315360000, no-transform, public', 'content-encoding': 'gzip'  },
  //credentials      : new AWS.SharedIniFileCredentials({ profile: 'default' }),
  // Sensible Defaults - gitignore these Files and Dirs
  distDir          : 'dist',
  indexRootPath    : false,
  cacheFileName    : `.awspublish-${ENV}`,
  concurrentUploads: 50
  
}

const cfConfig = {
  distribution : process.env.AWS_CLOUDFRONT, // CloudFront distribution ID
  wait         : false,  // wait for CloudFront invalidation to complete (about 30-60 seconds)
  indexRootPath: false
}

const deploy = () => {
  const publisher = awspublish.create(config, config)

  let g = gulp.src('./' + config.distDir + '/**')

  if(config.params.Prefix)
    g = g.pipe(rename((path) => { path.dirname = process.env.AWS_KEY_PREFIX+'/'+path.dirname }))
        
  g = g.pipe(awspublish.gzip())

  g = g.pipe(parallelize(publisher.publish(config.headers, config.options), config.concurrentUploads))
  g = g.pipe(through.obj((chunk, enc, cb) => {
    if(chunk.path.includes('/index.html'))
      chunk.path = chunk.path.replace('/index.html', '')
    cb(null, chunk)
  }))
  // Invalidate CDN
  if (cfConfig.distribution)
    g = g.pipe(cloudfront(cfConfig))

  // Delete removed files
  if (config.deleteOldVersions)
    g = g.pipe(publisher.sync(process.env.AWS_KEY_PREFIX))
  // create a cache file to speed up consecutive uploads
  g = g.pipe(publisher.cache())
  // print upload updates to console
  g = g.pipe(awspublish.reporter())
  g.on('end', () => gulp.src('./' + config.distDir + '/**').pipe(cloudfront(cfConfig)))
  return g
}

module.exports = deploy

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