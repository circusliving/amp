import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WebPage } from '../../../../shared/types/web-page';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchAllWebPages = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchAllWebPages: (...args: unknown[]) => mockFetchAllWebPages(...args),
}));

const { default: handler } = await import('../index.get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const pageFixture: WebPage = { path: '/about', name: 'About', order: 1 };

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchAllWebPages.mockReset();
});

describe('GET /api/web-pages', () => {
  it('returns all web pages from fetchAllWebPages', async () => {
    mockFetchAllWebPages.mockResolvedValue([pageFixture]);

    const result = await handler({});

    expect(result).toEqual([pageFixture]);
    expect(mockFetchAllWebPages).toHaveBeenCalledOnce();
  });

  it('returns an empty array when no pages exist', async () => {
    mockFetchAllWebPages.mockResolvedValue([]);

    expect(await handler({})).toEqual([]);
  });
});
