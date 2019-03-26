export default ['nuxt-i18n', {
  defaultLocale: 'en',
  detectBrowserLanguage: {
    cookieKey: 'localePref',
    useCookie: true
  },
  locales: [
    {
      code: 'en',
      file: 'en.js',
      iso: 'en-US'
    },
    {
      code: 'fr',
      file: 'fr.js',
      iso: 'fr-FR'
    }
  ],
  strategy: 'prefix_except_default',
  lazy: true,
  langDir: 'locales/',
  vueI18n: { fallbackLocale: 'en' },
  seo: true,
  vuex: {
    // Module namespace
    moduleName: 'i18n'

    // Mutations config
    // mutations: {
    //   // Mutation to commit to store current locale, set to false to disable
    //   setLocale: 'I18N_SET_LOCALE'
    //
    //   // Mutation to commit to store current message, set to false to disable
    //   // setMessages: 'I18N_SET_MESSAGES'
    // }
  }

}]
