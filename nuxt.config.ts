export default defineNuxtConfig({
  compatibilityDate: '2026-02-23',

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  runtimeConfig: {
    datoApiToken: '', // NUXT_DATO_API_TOKEN
    public: {
      baseUrl: '', // NUXT_PUBLIC_BASE_URL
      canonicalBaseUrl: '', // NUXT_PUBLIC_CANONICAL_BASE_URL
      gaTagId: '', // NUXT_PUBLIC_GA_TAG_ID
    },
  },

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      link: [
        {
          rel: 'preconnect',
          href: 'https://fonts.googleapis.com',
        },
        {
          rel: 'preconnect',
          href: 'https://fonts.gstatic.com',
          crossorigin: '',
        },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Euphoria+Script&family=Roboto+Condensed:wght@300;400;700&family=Roboto+Slab:wght@400;700&family=Roboto:wght@300;400;500;700&display=swap',
        },
      ],
    },
  },

  ssr: true,

  nitro: {
    preset: 'node-server',
  },

  image: {
    domains: ['www.datocms-assets.com', 'images.circusliving.com'],
  },

  i18n: {
    locales: [
      { code: 'en', file: 'en.ts' },
      { code: 'fr', file: 'fr.ts' },
    ],
    defaultLocale: 'en',
    langDir: '../locales/',
    strategy: 'prefix_except_default',
  },

  typescript: {
    strict: true,
  },

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Silence Bootstrap 5.x deprecation warnings caused by Dart Sass 2.x
          // Bootstrap 5 relies on legacy @import, color functions, and global
          // built-ins that are deprecated in Dart Sass 2.x but not yet removed.
          quietDeps: true,
          silenceDeprecations: ['import', 'global-builtin', 'color-functions', 'if-function'],
        },
      },
    },
  },
});
