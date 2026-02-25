import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ref } from 'vue';
import type { WebPage } from '~~/shared/types/web-page';
import { useWebPage } from '../use-web-page';
import type { SeoHeadOptions } from '../use-seo-head';

import { useSeoHead } from '../use-seo-head';

// ─── Mock useSeoHead to isolate unit under test ───────────────────────────────

vi.mock('../use-seo-head', () => ({
  useSeoHead: vi.fn(),
}));
const mockUseSeoHead = vi.mocked(useSeoHead);

// ─── Helpers ──────────────────────────────────────────────────────────────────

const MOCK_PAGE: WebPage = {
  path: '/about',
  name: 'About Us',
  alternateName: 'About',
  description: 'Learn about us',
  image: 'https://example.com/about.jpg',
};

function stubRoute(path: string) {
  vi.stubGlobal('useRoute', vi.fn(() => ({ path })));
}

function stubFetch(page: WebPage | null, hasError = false) {
  vi.stubGlobal(
    'useFetch',
    vi.fn().mockReturnValue({
      data: ref(page),
      error: ref(hasError ? new Error('Not Found') : null),
      status: ref(hasError ? 'error' : 'success'),
    }),
  );
}

// ─── Tests ────────────────────────────────────────────────────────────────────

describe('useWebPage', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockUseSeoHead.mockReset();
    stubRoute('/about');
    stubFetch(MOCK_PAGE);
  });

  // ── URL construction ──────────────────────────────────────────────────────

  describe('useFetch URL', () => {
    it('calls useFetch with a getter returning the correct API URL', () => {
      const mockFetch = vi.fn().mockReturnValue({
        data: ref(MOCK_PAGE),
        error: ref(null),
        status: ref('success'),
      });
      vi.stubGlobal('useFetch', mockFetch);

      useWebPage();

      expect(mockFetch).toHaveBeenCalledOnce();
      const urlGetter = mockFetch.mock.calls[0]![0];
      expect(typeof urlGetter).toBe('function');
      expect(urlGetter()).toBe('/api/web-pages/about');
    });

    it('builds URL for root path', () => {
      stubRoute('/');
      const mockFetch = vi.fn().mockReturnValue({
        data: ref(null),
        error: ref(null),
        status: ref('success'),
      });
      vi.stubGlobal('useFetch', mockFetch);

      useWebPage();

      const urlGetter = mockFetch.mock.calls[0]![0];
      expect(urlGetter()).toBe('/api/web-pages/');
    });

    it('builds URL for nested path', () => {
      stubRoute('/travel/paris');
      const mockFetch = vi.fn().mockReturnValue({
        data: ref(null),
        error: ref(null),
        status: ref('success'),
      });
      vi.stubGlobal('useFetch', mockFetch);

      useWebPage();

      const urlGetter = mockFetch.mock.calls[0]![0];
      expect(urlGetter()).toBe('/api/web-pages/travel/paris');
    });
  });

  // ── SEO options ───────────────────────────────────────────────────────────

  describe('useSeoHead integration', () => {
    it('calls useSeoHead once', () => {
      useWebPage();
      expect(mockUseSeoHead).toHaveBeenCalledOnce();
    });

    it('passes alternateName as title when present', () => {
      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const resolved = typeof seoArg === 'function' ? seoArg() : (seoArg as unknown as { value: SeoHeadOptions }).value ?? seoArg;
      // unwrap computed
      const options = 'value' in (resolved as object) ? (resolved as unknown as { value: SeoHeadOptions }).value : resolved as SeoHeadOptions;
      expect((options as { title: string }).title).toBe('About');
    });

    it('falls back to name when alternateName is absent', () => {
      const page: WebPage = { path: '/blog', name: 'Blog', description: 'Posts' };
      stubFetch(page);

      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as unknown as { value: { title: string } }).value;
      expect(options.title).toBe('Blog');
    });

    it('passes description', () => {
      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as { value: { description: string } }).value;
      expect(options.description).toBe('Learn about us');
    });

    it('passes canonicalPath from route', () => {
      stubRoute('/contact');
      stubFetch({ path: '/contact', name: 'Contact', description: '' });

      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as { value: { canonicalPath: string } }).value;
      expect(options.canonicalPath).toBe('/contact');
    });

    it('passes image URL when image is present', () => {
      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as { value: { image: { url: string } } }).value;
      expect(options.image).toEqual({ url: 'https://example.com/about.jpg' });
    });

    it('passes undefined image when page has no image', () => {
      const page: WebPage = { path: '/no-img', name: 'No Image', description: 'None' };
      stubFetch(page);

      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as { value: { image: unknown } }).value;
      expect(options.image).toBeUndefined();
    });

    it('uses empty string for title when webPage is null', () => {
      stubFetch(null);

      useWebPage();

      const seoArg = mockUseSeoHead.mock.calls[0]![0];
      const options = (seoArg as { value: { title: string } }).value;
      expect(options.title).toBe('');
    });
  });

  // ── return value ──────────────────────────────────────────────────────────

  describe('return value', () => {
    it('returns webPage ref with fetched data', () => {
      const { webPage } = useWebPage();
      expect(webPage.value).toEqual(MOCK_PAGE);
    });

    it('returns status ref', () => {
      const { status } = useWebPage();
      expect(status.value).toBe('success');
    });

    it('returns error ref', () => {
      const { error } = useWebPage();
      expect(error.value).toBeNull();
    });
  });

  // ── 404 error handling ────────────────────────────────────────────────────

  describe('error handling', () => {
    it('throws createError with 404 when fetch errors', () => {
      const thrownError = new Error('Not Found') as Error & { statusCode: number };
      thrownError.statusCode = 404;
      const mockCreateError = vi.fn(() => thrownError);
      vi.stubGlobal('createError', mockCreateError);

      stubFetch(null, true);

      expect(() => useWebPage()).toThrow();
      expect(mockCreateError).toHaveBeenCalledWith({
        statusCode: 404,
        statusMessage: 'Page not found',
      });
    });

    it('does not call createError when fetch succeeds', () => {
      const mockCreateError = vi.fn();
      vi.stubGlobal('createError', mockCreateError);

      useWebPage();

      expect(mockCreateError).not.toHaveBeenCalled();
    });
  });
});
