/**
 * Image service utilities.
 *
 * Replaces the legacy `modules/ImageService.js` class and its fragile HTTP
 * HEAD dimension-fetching pattern. Dimensions are no longer fetched at
 * runtime — the DatoCMS image API exposes width/height as query params and
 * the browser handles sizing via the `srcset` attribute.
 */

/** Parts extracted from an image URL. */
export interface ParsedImageUrl {
  /** Full URL pathname, e.g. `/15223948/hero.webp` */
  pathname: string;
  /** Filename without extension, e.g. `hero` */
  filename: string;
  /** File extension including dot, e.g. `.webp` */
  extension: string;
}

/** Default responsive widths (px) used when none are specified. */
export const DEFAULT_WIDTHS: readonly number[] = [320, 480, 640, 768, 960, 1280];

/**
 * Parse an image URL into its constituent parts.
 *
 * Returns empty strings for any part that cannot be determined, so callers
 * never have to guard against `undefined`.
 *
 * @example
 * parseImageUrl('https://www.datocms-assets.com/15223948/hero.webp')
 * // { pathname: '/15223948/hero.webp', filename: 'hero', extension: '.webp' }
 */
export function parseImageUrl(url: string): ParsedImageUrl {
  if (!url) return { pathname: '', filename: '', extension: '' };

  try {
    const parsed = new URL(url);
    const pathname = parsed.pathname;
    const lastSlash = pathname.lastIndexOf('/');
    const basename = lastSlash >= 0 ? pathname.slice(lastSlash + 1) : pathname;
    const dotIndex = basename.lastIndexOf('.');
    const filename = dotIndex >= 0 ? basename.slice(0, dotIndex) : basename;
    const extension = dotIndex >= 0 ? basename.slice(dotIndex) : '';

    return { pathname, filename, extension };
  } catch {
    return { pathname: '', filename: '', extension: '' };
  }
}

/**
 * Build a responsive `srcset` string for an image using DatoCMS image API
 * width parameters (`?w=<width>`).
 *
 * If the URL already contains a query string, width is appended as `&w=`.
 *
 * @param url    - Absolute or relative image URL.
 * @param widths - Array of widths (px) to include in the srcset.
 *                 Defaults to `DEFAULT_WIDTHS`.
 *
 * @example
 * buildSrcSet('https://www.datocms-assets.com/15223948/hero.webp', [320, 640])
 * // 'https://…/hero.webp?w=320 320w, https://…/hero.webp?w=640 640w'
 */
export function buildSrcSet(url: string, widths: number[] = [...DEFAULT_WIDTHS]): string {
  if (!url) return '';

  return widths
    .map((w) => {
      const separator = url.includes('?') ? '&' : '?';
      return `${url}${separator}w=${w} ${w}w`;
    })
    .join(', ');
}
