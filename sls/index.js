const serverless  = require('serverless-http')
const app         = require('express')()
const generator   = require('./generator')
const util        = require('util')
const   consola   = require('consola'       )


const post = async (req, res) => {
  generator()
  res.status(200).send('ok \n')
}

app.post('/generate', authorize, post)

app.use((req, res)=>res.status(404).send({ code: 'notFound', statusCode: 404}))

process.on('unhandledRejection', (error) => {consola.error(`UNHANDLED REJECTION - ${util.format(error.stack||error)}`)})

module.exports.main = serverless(app)

function authorize (req,res,next){
  let auth = req.headers.authorization || ' '

  auth = auth.replace(/^(Ticket|Token|Bearer)\s+/, '')
  
  let authorized = (auth === process.env.DEPLOY_AUTH)

  if(authorized) return next()
  
  return res.status(401).send({ code: 'not authorized', statusCode: 401})

}