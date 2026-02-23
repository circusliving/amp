import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref, computed } from 'vue';
import { useSeoHead, type SeoHeadOptions } from '../use-seo-head';

// ─── Nuxt auto-import stubs ──────────────────────────────────────────────────

let capturedSeoMeta: Record<string, unknown> = {};
let capturedHeadLinks: unknown[] = [];

const mockUseSeoMeta = vi.fn((args: Record<string, unknown>) => {
  // Resolve any getter functions so assertions can use plain values
  const resolved: Record<string, unknown> = {};
  for (const [key, val] of Object.entries(args)) {
    resolved[key] = typeof val === 'function' ? (val as () => unknown)() : val;
  }
  capturedSeoMeta = resolved;
});

const mockUseHead = vi.fn((args: { link?: unknown[] }) => {
  const links = args.link ?? [];
  capturedHeadLinks = links.map((link) => {
    if (typeof link !== 'object' || link === null) return link;
    const resolved: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(link as Record<string, unknown>)) {
      // href can be a ref
      resolved[k] = v && typeof v === 'object' && 'value' in v ? (v as { value: unknown }).value : v;
    }
    return resolved;
  });
});

const mockUseRuntimeConfig = vi.fn(() => ({
  public: {
    canonicalBaseUrl: 'https://example.com',
  },
}));

vi.stubGlobal('useSeoMeta', mockUseSeoMeta);
vi.stubGlobal('useHead', mockUseHead);
vi.stubGlobal('useRuntimeConfig', mockUseRuntimeConfig);
vi.stubGlobal('computed', computed);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function run(options: SeoHeadOptions): void {
  capturedSeoMeta = {};
  capturedHeadLinks = [];
  mockUseSeoMeta.mockClear();
  mockUseHead.mockClear();
  useSeoHead(options);
}

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('useSeoHead', () => {
  describe('basic meta generation', () => {
    it('sets title and description', () => {
      run({ title: 'My Page', description: 'Page desc', canonicalPath: '/about' });
      expect(capturedSeoMeta.title).toBe('My Page');
      expect(capturedSeoMeta.description).toBe('Page desc');
    });

    it('sets og:title, og:description, og:type defaults', () => {
      run({ title: 'Home', description: 'Desc', canonicalPath: '/' });
      expect(capturedSeoMeta.ogTitle).toBe('Home');
      expect(capturedSeoMeta.ogDescription).toBe('Desc');
      expect(capturedSeoMeta.ogType).toBe('website');
    });

    it('sets og:locale default to en', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/' });
      expect(capturedSeoMeta.ogLocale).toBe('en');
    });

    it('respects explicit locale override', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', locale: 'fr' });
      expect(capturedSeoMeta.ogLocale).toBe('fr');
    });

    it('sets twitter card type', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/' });
      expect(capturedSeoMeta.twitterCard).toBe('summary_large_image');
    });

    it('sets twitter title and description', () => {
      run({ title: 'Tweet Title', description: 'Tweet desc', canonicalPath: '/' });
      expect(capturedSeoMeta.twitterTitle).toBe('Tweet Title');
      expect(capturedSeoMeta.twitterDescription).toBe('Tweet desc');
    });
  });

  describe('canonical URL construction', () => {
    it('builds canonical URL from base + path', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/about' });
      const canonical = capturedHeadLinks[0] as { rel: string; href: string };
      expect(canonical.rel).toBe('canonical');
      expect(canonical.href).toBe('https://example.com/about');
    });

    it('handles root path', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/' });
      const canonical = capturedHeadLinks[0] as { href: string };
      expect(canonical.href).toBe('https://example.com/');
    });

    it('adds leading slash if missing', () => {
      run({ title: 'T', description: 'D', canonicalPath: 'about' });
      const canonical = capturedHeadLinks[0] as { href: string };
      expect(canonical.href).toBe('https://example.com/about');
    });

    it('strips trailing slash from base URL', () => {
      mockUseRuntimeConfig.mockReturnValueOnce({
        public: { canonicalBaseUrl: 'https://example.com/' },
      });
      run({ title: 'T', description: 'D', canonicalPath: '/page' });
      const canonical = capturedHeadLinks[0] as { href: string };
      expect(canonical.href).toBe('https://example.com/page');
    });

    it('sets og:url to the canonical URL', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/contact' });
      expect(capturedSeoMeta.ogUrl).toBe('https://example.com/contact');
    });
  });

  describe('image meta tags', () => {
    const image = { url: 'https://img.example.com/photo.jpg', width: 1200, height: 630, alt: 'Photo' };

    it('sets og:image when image provided', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', image });
      expect(capturedSeoMeta.ogImage).toBe(image.url);
    });

    it('sets og:image dimensions', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', image });
      expect(capturedSeoMeta.ogImageWidth).toBe(1200);
      expect(capturedSeoMeta.ogImageHeight).toBe(630);
    });

    it('sets og:image:alt from image.alt', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', image });
      expect(capturedSeoMeta.ogImageAlt).toBe('Photo');
    });

    it('falls back og:image:alt to title when image.alt is missing', () => {
      run({ title: 'Fallback', description: 'D', canonicalPath: '/', image: { url: 'https://img.example.com/x.jpg' } });
      expect(capturedSeoMeta.ogImageAlt).toBe('Fallback');
    });

    it('sets twitter:image', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', image });
      expect(capturedSeoMeta.twitterImage).toBe(image.url);
    });

    it('sets twitter:image:alt from image.alt', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', image });
      expect(capturedSeoMeta.twitterImageAlt).toBe('Photo');
    });

    it('returns undefined og:image when no image provided', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/' });
      expect(capturedSeoMeta.ogImage).toBeUndefined();
    });
  });

  describe('article-specific tags', () => {
    it('sets og:type to article', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/article/1', type: 'article' });
      expect(capturedSeoMeta.ogType).toBe('article');
    });

    it('sets article:published_time when type is article', () => {
      run({
        title: 'T',
        description: 'D',
        canonicalPath: '/a',
        type: 'article',
        publishedTime: '2025-01-15T00:00:00Z',
      });
      expect(capturedSeoMeta.articlePublishedTime).toBe('2025-01-15T00:00:00Z');
    });

    it('sets article:modified_time when type is article', () => {
      run({
        title: 'T',
        description: 'D',
        canonicalPath: '/a',
        type: 'article',
        modifiedTime: '2025-06-01T00:00:00Z',
      });
      expect(capturedSeoMeta.articleModifiedTime).toBe('2025-06-01T00:00:00Z');
    });

    it('omits article:published_time when type is website', () => {
      run({
        title: 'T',
        description: 'D',
        canonicalPath: '/',
        type: 'website',
        publishedTime: '2025-01-15T00:00:00Z',
      });
      expect(capturedSeoMeta.articlePublishedTime).toBeUndefined();
    });

    it('omits article tags when no type set', () => {
      run({ title: 'T', description: 'D', canonicalPath: '/', publishedTime: '2025-01-01' });
      expect(capturedSeoMeta.articlePublishedTime).toBeUndefined();
      expect(capturedSeoMeta.articleModifiedTime).toBeUndefined();
    });
  });

  describe('reactive options', () => {
    it('reflects updated values when passed as a computed getter', () => {
      const titleRef = ref('Initial');
      const opts = computed((): SeoHeadOptions => ({
        title: titleRef.value,
        description: 'D',
        canonicalPath: '/r',
      }));

      capturedSeoMeta = {};
      mockUseSeoMeta.mockClear();
      mockUseHead.mockClear();
      useSeoHead(opts);

      // useSeoMeta was called with getter functions — call the title getter directly
      const titleGetter = mockUseSeoMeta.mock.calls[0]?.[0]?.title as (() => string) | undefined;
      expect(typeof titleGetter).toBe('function');
      expect(titleGetter?.()).toBe('Initial');

      titleRef.value = 'Updated';
      expect(titleGetter?.()).toBe('Updated');
    });
  });
});
