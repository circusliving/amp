import { describe, it, expect } from 'vitest';
import { truncateText, getPath } from '../helpers';

describe('truncateText', () => {
  // ── Truncation behaviour ──────────────────────────────────────────────────

  it('truncates text longer than maxLength and appends ellipsis', () => {
    expect(truncateText('Hello World', 5)).toBe('Hello…');
  });

  it('returns the full text when it is exactly maxLength characters', () => {
    expect(truncateText('Hello', 5)).toBe('Hello');
  });

  it('returns the full text when it is shorter than maxLength', () => {
    expect(truncateText('Hi', 100)).toBe('Hi');
  });

  it('uses 150 as the default maxLength', () => {
    const long = 'a'.repeat(151);
    const result = truncateText(long);
    expect(result).toBe('a'.repeat(150) + '…');
  });

  it('does not truncate exactly 150 characters with default maxLength', () => {
    const exact = 'a'.repeat(150);
    expect(truncateText(exact)).toBe(exact);
  });

  it('works with multi-byte unicode characters', () => {
    // emoji is one character in JS string but visually multi-byte
    const text = '😀'.repeat(6);
    expect(truncateText(text, 5)).toBe('😀'.repeat(5) + '…');
  });

  // ── Edge cases ────────────────────────────────────────────────────────────

  it('returns empty string for empty input', () => {
    expect(truncateText('')).toBe('');
  });

  it('returns empty string for maxLength 0', () => {
    expect(truncateText('Hello World', 0)).toBe('…');
  });
});

describe('getPath', () => {
  // ── Object input ──────────────────────────────────────────────────────────

  it('extracts the pathname from an object with a url property', () => {
    expect(getPath({ url: 'https://www.circusliving.com/blog/post-1' })).toBe(
      '/blog/post-1',
    );
  });

  it('extracts the pathname from a root URL', () => {
    expect(getPath({ url: 'https://www.circusliving.com/' })).toBe('/');
  });

  it('returns empty string when url is undefined in object', () => {
    expect(getPath({})).toBe('');
  });

  // ── String input ──────────────────────────────────────────────────────────

  it('extracts the pathname from a plain URL string', () => {
    expect(getPath('https://www.circusliving.com/travel/paris')).toBe(
      '/travel/paris',
    );
  });

  it('returns empty string for an empty string', () => {
    expect(getPath('')).toBe('');
  });

  it('returns empty string for a non-URL string', () => {
    expect(getPath('not-a-url')).toBe('');
  });
});
