import { readFileSync } from 'node:fs';

// Resolves the DatoCMS API token from (in order): NUXT_DATO_API_TOKEN env,
// DATO_READ_ONLY env, or NUXT_DATO_API_TOKEN_FILE (Docker secret pattern —
// the swarm stack mounts /run/secrets/dato_api_token and points this var
// at it). Reading the file at build/boot time keeps useRuntimeConfig()
// synchronous everywhere downstream.
const resolveDatoToken = (): string => {
  const inline = process.env.NUXT_DATO_API_TOKEN || process.env.DATO_READ_ONLY;
  if (inline) return inline;
  const file = process.env.NUXT_DATO_API_TOKEN_FILE;
  if (!file) return '';
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return '';
  }
};

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
