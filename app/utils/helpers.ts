/**
 * General-purpose helper utilities.
 *
 * Replaces the legacy `modules/helpers.js`. URL-parsing helpers have been
 * consolidated into `app/utils/image-service.ts`. Only non-image utilities
 * live here.
 */

/**
 * Truncate a string to at most `maxLength` characters, appending `…` when the
 * text is shortened.
 *
 * Used by CardCL and CardImgMiddle (replaces the old `needsSpace()` computed).
 *
 * @param text      - Source string (may be HTML-free body text or a title).
 * @param maxLength - Maximum number of characters to keep (default: 150).
 *
 * @example
 * truncateText('Hello World', 5)  // 'Hello…'
 * truncateText('Hi', 100)         // 'Hi'
 */
export function truncateText(text: string, maxLength = 150): string {
  if (!text) return '';
  // Spread to Unicode code points so surrogate pairs (e.g. emoji) are counted
  // as one character each, avoiding truncation in the middle of a character.
  const codePoints = [...text];
  if (codePoints.length <= maxLength) return text;
  return `${codePoints.slice(0, maxLength).join('')}…`;
}

/**
 * Extract the path segment from a URL string.
 *
 * Returns an empty string when the input is falsy or cannot be parsed.
 *
 * @example
 * getPath({ url: 'https://www.circusliving.com/blog/post-1' })
 * // '/blog/post-1'
 */
export function getPath(item: { url?: string } | string): string {
  const raw = typeof item === 'string' ? item : item?.url;
  if (!raw) return '';
  try {
    return new URL(raw).pathname;
  } catch {
    return '';
  }
}
