/**
 * Google Analytics 4 client-only plugin.
 * Injects the gtag.js script when NUXT_PUBLIC_GA_TAG_ID is set.
 * Only loads in production to avoid polluting analytics with dev traffic.
 * Client-only: the `.client.ts` suffix ensures this never runs on the server.
 */
export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig();
  const tagId = config.public.gaTagId;

  if (!tagId) return;

  // Only load GA in production — prevent dev/staging traffic pollution
  if (import.meta.dev) return;

  useHead({
    script: [
      {
        src: `https://www.googletagmanager.com/gtag/js?id=${tagId}`,
        async: true,
      },
      {
        innerHTML: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${tagId}');`,
      },
    ],
  });
});
