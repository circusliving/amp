/**
 * Processes HTML content from DatoCMS article bodies.
 * Since AMP has been dropped, article body HTML passes through as-is,
 * with the addition of `loading="lazy"` on any img tags that lack it.
 */

/**
 * Adds `loading="lazy"` to `<img>` tags that don't already have a loading attribute.
 * Preserves all existing attributes including width and height.
 */
export function processArticleHtml(html: string): string {
  if (!html) return html;

  return html.replace(/<img\b([^>]*?)(\s*\/?>)/gi, (match, attrs: string, close: string) => {
    if (/\bloading\s*=/i.test(attrs)) return match;
    return `<img${attrs} loading="lazy"${close}`;
  });
}
