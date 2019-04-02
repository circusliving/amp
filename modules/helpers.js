const url = require('url')

export const getPath = (item ) => { 
    let uri = (item||{}).url || this.url
    return (url.parse(uri)).path 
}