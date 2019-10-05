import { InMemoryCache } from 'apollo-cache-inmemory';

const cache = new InMemoryCache()

export default function (context){
  return {
    // required

    httpEndpoint  : 'https://graphql.datocms.com',
    getAuth       : () => '6a99e149fb6b91bbc8b101e86fe7de',
    // optional
    // See https://www.apollographql.com/docs/link/links/http.html#options
    // httpLinkOptions: {
    //   credentials: 'same-origin'
    // },
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    // wsEndpoint: 'ws://localhost:4000', // optional
    // LocalStorage token
    tokenName     : 'apollo-token', // optional
    // Enable Automatic Query persisting with Apollo Engine
    persisting    : false, // Optional
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false, // Optional,
    cache

  }
  // test: {
  //   httpEndpoint: 'http://localhost:5000',
  //   wsEndpoint: 'ws://localhost:5000',
  //   tokenName: 'apollo-token'
  // }
  // // alternative: user path to config which returns exact same config options
  // test2: '~/plugins/my-alternative-apollo-config.js'
  // includeNodeModules: true
}
