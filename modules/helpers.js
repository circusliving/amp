const url = require('url')

export const getPath = (item ) => { 
    let uri = (item||{}).url || this.url
    if(!uri) return ''
    return (url.parse(uri)).path 
}