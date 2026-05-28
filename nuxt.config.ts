// Resolves the DatoCMS API token from NUXT_DATO_API_TOKEN / DATO_READ_ONLY.
// NOTE: this runs at BUILD time only, so in the deployed container the secret
// (mounted at runtime via NUXT_DATO_API_TOKEN_FILE) is NOT available here —
// the build-time value is empty. server/utils/dato-client.ts reads the
// secret file at first use as a runtime fallback.
const resolveDatoToken = (): string => process.env.NUXT_DATO_API_TOKEN || process.env.DATO_READ_ONLY || '';

export default defineNuxtConfig({
  compatibilityDate: '2026-02-23',

  modules: [
    '@pinia/nuxt',
    '@nuxt/image',
    '@nuxtjs/i18n',
    '@nuxt/eslint',
  ],

  runtimeConfig: {
    datoApiToken: resolveDatoToken(),
    public: {
      baseUrl: '', // NUXT_PUBLIC_BASE_URL
      canonicalBaseUrl: '', // NUXT_PUBLIC_CANONICAL_BASE_URL
      gaTagId: '', // NUXT_PUBLIC_GA_TAG_ID
    },
  },

  css: ['~/assets/scss/main.scss'],

  app: {
    head: {
      htmlAttrs: {
        lang: 'en',
      },
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
