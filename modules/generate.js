const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient(process.env.DATO_READ_ONLY)


module.exports.getRoutes = async function () {
    try {

      let webpages =  client.items.all({ 'filter[type]': ['web_page'] }, { allPages: true })//.then((records) => console.log(records.length));
      let articles =  client.items.all({ 'filter[type]': ['article'] }, { allPages: true })//.then((records) => console.log(records.length))

      let results = await Promise.all([webpages,articles])
      let routes = new Set([])

      for (let i = 0; i< results[0].length; i++) {
        let record = results[0][i];
        routes.add(record.path)  
      }

      for (let i = 0; i< results[1].length; i++) {
        let record = results[1][i];
        routes.add(`/articles/${record.identifier}`)  
      }
      //routes.forEach((v1,v2,set) => console.log(`s[${v1}] = ${v2}`))
      return routes

      console.log()
    } catch (er) {
      console.error(er)
    }
  }