import { describe, it, expect } from 'vitest';
import { processArticleHtml } from '../html-processor';

describe('processArticleHtml', () => {
  it('adds loading="lazy" to img tags without a loading attribute', () => {
    const input = '<p><img src="photo.jpg" width="800" height="600" alt="A photo"></p>';
    const output = processArticleHtml(input);
    expect(output).toContain('loading="lazy"');
    expect(output).toContain('width="800"');
    expect(output).toContain('height="600"');
  });

  it('does not duplicate loading attribute when already present', () => {
    const input = '<img src="a.jpg" loading="lazy">';
    const output = processArticleHtml(input);
    const matches = output.match(/loading=/g);
    expect(matches).toHaveLength(1);
  });

  it('does not replace existing eager loading', () => {
    const input = '<img src="a.jpg" loading="eager">';
    const output = processArticleHtml(input);
    expect(output).toBe(input);
    expect(output).not.toContain('loading="lazy"');
  });

  it('handles self-closing img tags', () => {
    const input = '<img src="photo.jpg" />';
    const output = processArticleHtml(input);
    expect(output).toContain('loading="lazy"');
    expect(output).toContain('/>');
  });

  it('handles multiple img tags in the same string', () => {
    const input = '<img src="a.jpg"><img src="b.jpg" loading="lazy"><img src="c.jpg">';
    const output = processArticleHtml(input);
    const matches = output.match(/loading="lazy"/g);
    // a.jpg and c.jpg get lazy, b.jpg already had it (not duplicated)
    expect(matches).toHaveLength(3);
  });

  it('returns empty string unchanged', () => {
    expect(processArticleHtml('')).toBe('');
  });

  it('returns non-img HTML unchanged', () => {
    const input = '<p>Hello world</p>';
    expect(processArticleHtml(input)).toBe(input);
  });
});
