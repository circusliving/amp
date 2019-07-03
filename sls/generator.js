const { spawn   } = require('child_process' )
const   deploy    = require('./deploy'      )
const   consola   = require('consola'       )

async function generate () {
  consola.info('=======================')
  consola.info('Generating static files')
  consola.info('=======================\n\n')

  const gen =  spawn('yarn',['gen:dev'])

  gen.stderr.on('data', (data) => consola.error(data.toString()))  
  gen.stderr.on('close', () => deployToS3())

  return true
}

async function deployToS3(){
  consola.success('=======================')
  consola.success('Generated')
  consola.success('=======================\n\n')

  consola.info('=======================')
  consola.info('Deploying to S3')
  consola.info('=======================')

  await deploy()
  
  consola.success('=======================')
  consola.success('Deployed')
  consola.success('=======================\n\n')
}

module.exports = generate