import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article } from '../../../../shared/types/article';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchArticles = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchArticles: (...args: unknown[]) => mockFetchArticles(...args),
}));

// Import handler AFTER mock is set up (defineEventHandler stub is from vitest.setup.ts)
const { default: handler } = await import('../index.get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const articleA: Article = {
  identifier: 'art-1',
  name: 'Paris Guide',
  tags: [{ id: 'tag-1', name: 'travel' }],
};

const articleB: Article = {
  identifier: 'art-2',
  name: 'Rome Guide',
  tags: [{ id: 'tag-2', name: 'food' }],
};

function mockEvent(query: Record<string, string> = {}) {
  return { _query: query, _params: {} };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchArticles.mockReset();
});

describe('GET /api/articles', () => {
  it('returns all articles when no tag filter is provided', async () => {
    mockFetchArticles.mockResolvedValue([articleA, articleB]);

    const result = await handler(mockEvent());

    expect(result).toEqual([articleA, articleB]);
  });

  it('filters articles by tag name when ?tag is provided', async () => {
    mockFetchArticles.mockResolvedValue([articleA, articleB]);

    const result = await handler(mockEvent({ tag: 'travel' }));

    expect(result).toEqual([articleA]);
  });

  it('filters articles by tag id when ?tag matches an id', async () => {
    mockFetchArticles.mockResolvedValue([articleA, articleB]);

    const result = await handler(mockEvent({ tag: 'tag-2' }));

    expect(result).toEqual([articleB]);
  });

  it('returns an empty array when no articles match the tag', async () => {
    mockFetchArticles.mockResolvedValue([articleA, articleB]);

    const result = await handler(mockEvent({ tag: 'nonexistent' }));

    expect(result).toEqual([]);
  });

  it('returns an empty array when fetchArticles returns nothing', async () => {
    mockFetchArticles.mockResolvedValue([]);

    expect(await handler(mockEvent())).toEqual([]);
  });
});
