import { toValue, type MaybeRefOrGetter } from 'vue';

export interface SeoHeadOptions {
  title: string;
  description: string;
  canonicalPath: string;
  image?: {
    url: string;
    width?: number;
    height?: number;
    alt?: string;
  };
  type?: 'website' | 'article';
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
}

export function useSeoHead(options: MaybeRefOrGetter<SeoHeadOptions>): void {
  const config = useRuntimeConfig();

  const resolved = computed((): SeoHeadOptions => toValue(options));

  const canonicalUrl = computed((): string => {
    let base = (config.public.canonicalBaseUrl as string) || '';
    // Ensure the base URL includes protocol
    if (base && !base.startsWith('http')) {
      base = `https://${base}`;
    }
    const rawPath = resolved.value.canonicalPath || '/';
    const path = rawPath.startsWith('/') ? rawPath : `/${rawPath}`;
    return `${base.replace(/\/$/, '')}${path}`;
  });

  useSeoMeta({
    title: () => resolved.value.title,
    description: () => resolved.value.description,
    ogTitle: () => resolved.value.title,
    ogDescription: () => resolved.value.description,
    ogUrl: () => canonicalUrl.value,
    ogType: () => resolved.value.type ?? 'website',
    ogLocale: () => resolved.value.locale ?? 'en',
    ogImage: () => resolved.value.image?.url,
    ogImageWidth: () => resolved.value.image?.width,
    ogImageHeight: () => resolved.value.image?.height,
    ogImageAlt: () => resolved.value.image?.alt ?? resolved.value.title,
    twitterCard: 'summary_large_image',
    twitterTitle: () => resolved.value.title,
    twitterDescription: () => resolved.value.description,
    twitterImage: () => resolved.value.image?.url,
    twitterImageAlt: () => resolved.value.image?.alt ?? resolved.value.title,
    // Article-specific tags (only rendered when type === 'article' and value is present)
    articlePublishedTime: () =>
      resolved.value.type === 'article' ? resolved.value.publishedTime : undefined,
    articleModifiedTime: () =>
      resolved.value.type === 'article' ? resolved.value.modifiedTime : undefined,
  });

  useHead({
    link: [{ rel: 'canonical', href: canonicalUrl }],
  });
}
