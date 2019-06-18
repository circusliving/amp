const gulp              = require      ('gulp'                                  )
const awspublish        = require      ('gulp-awspublish'                       )
const cloudfront        = require      ('gulp-cloudfront-invalidate-aws-publish')
const parallelize       = require      ('concurrent-transform'                  )
const dotenv            = require      ('dotenv'                                )
const variableExpansion = require      ('dotenv-expand'                         )
const AWS = require('aws-sdk')
const {resolve} = require('path')
variableExpansion(dotenv.config({ path:resolve(process.cwd(), '.dev.env') }))

const config = {

  options:{simulate:false},
  // Required
  params: { Bucket: process.env.AWS_BUCKET_NAME},
   accessKeyId: 'AKIATL2LUJBOT5QOEYYL',
   secretAccessKey: '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',

//   credentials: new AWS.SharedIniFileCredentials({ profile: 'circus-static-deploy' }),
  // Optional
  deleteOldVersions: true,                 // NOT FOR PRODUCTION
  distribution: process.env.AWS_CLOUDFRONT, // CloudFront distribution ID
  region: process.env.AWS_DEFAULT_REGION,
  headers: { 'Cache-Control': 'max-age=315360000, no-transform, public', 'content-encoding': 'gzip'  },

  // Sensible Defaults - gitignore these Files and Dirs
  distDir: 'dist',
  indexRootPath: true,
  cacheFileName: '.awspublish',
  concurrentUploads: 2,
  wait: true,  // wait for CloudFront invalidation to complete (about 30-60 seconds)
}

gulp.task('deploy', function() {
  const publisher = awspublish.create(config, config)

  let g = gulp.src('./' + config.distDir + '/**').pipe(awspublish.gzip())
    // publisher will add Content-Length, Content-Type and headers specified above
    // If not specified it will set x-amz-acl to public-read by default
  g = g.pipe(parallelize(publisher.publish(config.headers,config.options), config.concurrentUploads))

  // Invalidate CDN
  if (config.distribution) {
    console.log('Configured with CloudFront distribution')
    g = g.pipe(cloudfront(config))
  } else {
    console.log('No CloudFront distribution configured - skipping CDN invalidation')
  }

  // Delete removed files
  if (config.deleteOldVersions) g = g.pipe(publisher.sync())
  // create a cache file to speed up consecutive uploads
  g = g.pipe(publisher.cache())
  // print upload updates to console
  g = g.pipe(awspublish.reporter())
  return g
})