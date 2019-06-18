const SiteClient = require('datocms-client').SiteClient
const client = new SiteClient('a42a32d7381a2815d35f013ce8d355')




export const getRoutes = async function () {
    try {
      //return new Set(['/','/side-shows/cabinet-of-curiosities','/articles/ghoulish-bunny-studios'])
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