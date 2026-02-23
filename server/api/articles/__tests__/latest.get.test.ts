import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article } from '../../../../shared/types/article';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchLatestArticles = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchLatestArticles: (...args: unknown[]) => mockFetchLatestArticles(...args),
}));

const { default: handler } = await import('../latest.get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const articleFixture: Article = { identifier: 'art-1', name: 'Latest News' };

function mockEvent(query: Record<string, string> = {}) {
  return { _query: query, _params: {} };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchLatestArticles.mockReset();
});

describe('GET /api/articles/latest', () => {
  it('uses a default limit of 6 when no query param is provided', async () => {
    mockFetchLatestArticles.mockResolvedValue([articleFixture]);

    await handler(mockEvent());

    expect(mockFetchLatestArticles).toHaveBeenCalledWith(6);
  });

  it('passes the limit query param as a number', async () => {
    mockFetchLatestArticles.mockResolvedValue([articleFixture]);

    await handler(mockEvent({ limit: '10' }));

    expect(mockFetchLatestArticles).toHaveBeenCalledWith(10);
  });

  it('returns the array of articles from fetchLatestArticles', async () => {
    mockFetchLatestArticles.mockResolvedValue([articleFixture]);

    const result = await handler(mockEvent({ limit: '1' }));

    expect(result).toEqual([articleFixture]);
  });
});
