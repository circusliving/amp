export default {
  tokenName: 'circusApolloToken', // optional, default: apollo-token
  tokenExpires: 10, // optional, default: 7
  authenticationType: 'Bearer',
  // optional
  // errorHandler (error) {
  // // console.log('%cError', 'background: red; color: white; padding: 2px 4px; border-radius: 3px; font-weight: bold;', error.message)
  //   console.log('###################', error)
  // },
  // required
  clientConfigs: {
    default: '~/apollo/config.js'
  }
}
