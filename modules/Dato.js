const SiteClient  = require('datocms-client').SiteClient
const client      = new SiteClient(process.env.DATO_READ_ONLY)
const ALL_PAGES   = { allPages: true }

function queryType(type){ return { 'filter[type]': [ type ] } }
function query(type){ return client.items.all(queryType(type), ALL_PAGES) }

const articles =  () => query('article')
const webPages =  () => query('web_page')

module.exports = { articles, webPages }