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

  ssr: true,

  nitro: {
    preset: 'node-server',
  },

  image: {
    domains: ['www.datocms-assets.com'],
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
          // Bootstrap 5 variable overrides if needed
        },
      },
    },
  },
});
