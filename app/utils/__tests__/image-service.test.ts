import { describe, it, expect } from 'vitest';
import { parseImageUrl, buildSrcSet, DEFAULT_WIDTHS } from '../image-service';

describe('parseImageUrl', () => {
  // ── Happy paths ─────────────────────────────────────────────────────────────

  it('parses a standard DatoCMS asset URL', () => {
    const result = parseImageUrl('https://www.datocms-assets.com/15223948/hero.webp');
    expect(result).toEqual({
      pathname: '/15223948/hero.webp',
      filename: 'hero',
      extension: '.webp',
    });
  });

  it('parses a JPEG URL', () => {
    const result = parseImageUrl('https://example.com/images/photo.jpg');
    expect(result).toEqual({
      pathname: '/images/photo.jpg',
      filename: 'photo',
      extension: '.jpg',
    });
  });

  it('parses a PNG URL with nested path', () => {
    const result = parseImageUrl('https://cdn.example.com/a/b/c/banner.png');
    expect(result).toEqual({
      pathname: '/a/b/c/banner.png',
      filename: 'banner',
      extension: '.png',
    });
  });

  it('parses a URL that already contains query params', () => {
    const result = parseImageUrl('https://www.datocms-assets.com/15223948/hero.webp?w=640');
    expect(result).toEqual({
      pathname: '/15223948/hero.webp',
      filename: 'hero',
      extension: '.webp',
    });
  });

  it('handles a filename with multiple dots (uses last dot for extension)', () => {
    const result = parseImageUrl('https://cdn.example.com/circus.living.min.webp');
    expect(result).toEqual({
      pathname: '/circus.living.min.webp',
      filename: 'circus.living.min',
      extension: '.webp',
    });
  });

  it('handles a URL with no file extension', () => {
    const result = parseImageUrl('https://example.com/images/photo');
    expect(result).toEqual({
      pathname: '/images/photo',
      filename: 'photo',
      extension: '',
    });
  });

  it('handles a root-only pathname', () => {
    const result = parseImageUrl('https://example.com/');
    expect(result).toEqual({
      pathname: '/',
      filename: '',
      extension: '',
    });
  });

  // ── Edge / error cases ───────────────────────────────────────────────────────

  it('returns empty strings for an empty string', () => {
    expect(parseImageUrl('')).toEqual({ pathname: '', filename: '', extension: '' });
  });

  it('returns empty strings for a non-URL string', () => {
    expect(parseImageUrl('not-a-valid-url')).toEqual({
      pathname: '',
      filename: '',
      extension: '',
    });
  });
});

describe('buildSrcSet', () => {
  const url = 'https://www.datocms-assets.com/15223948/hero.webp';

  // ── Output format ────────────────────────────────────────────────────────────

  it('generates a srcset string with one width', () => {
    const result = buildSrcSet(url, [640]);
    expect(result).toBe(`${url}?w=640 640w`);
  });

  it('generates a comma-separated srcset for multiple widths', () => {
    const result = buildSrcSet(url, [320, 640]);
    expect(result).toBe(`${url}?w=320 320w, ${url}?w=640 640w`);
  });

  it('uses DEFAULT_WIDTHS when no widths are provided', () => {
    const result = buildSrcSet(url);
    const parts = result.split(', ');
    expect(parts).toHaveLength(DEFAULT_WIDTHS.length);
    for (let i = 0; i < DEFAULT_WIDTHS.length; i++) {
      expect(parts[i]).toBe(`${url}?w=${DEFAULT_WIDTHS[i]} ${DEFAULT_WIDTHS[i]}w`);
    }
  });

  it('appends & instead of ? when the URL already has a query string', () => {
    const withQuery = `${url}?auto=format`;
    const result = buildSrcSet(withQuery, [320, 640]);
    expect(result).toBe(
      `${withQuery}&w=320 320w, ${withQuery}&w=640 640w`,
    );
  });

  it('preserves width order as given', () => {
    const result = buildSrcSet(url, [1280, 320, 640]);
    const parts = result.split(', ');
    expect(parts[0]).toContain('w=1280');
    expect(parts[1]).toContain('w=320');
    expect(parts[2]).toContain('w=640');
  });

  // ── Edge cases ───────────────────────────────────────────────────────────────

  it('returns an empty string for an empty URL', () => {
    expect(buildSrcSet('')).toBe('');
  });

  it('returns an empty string for an empty widths array', () => {
    expect(buildSrcSet(url, [])).toBe('');
  });
});
