import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WebPage } from '../../../../shared/types/web-page';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchWebPageByPath = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchWebPageByPath: (...args: unknown[]) => mockFetchWebPageByPath(...args),
}));

const { default: handler } = await import('../[...path].get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const pageFixture: WebPage = { path: '/travel/paris', name: 'Paris', order: 2 };

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchWebPageByPath.mockReset();
});

describe('GET /api/web-pages/[...path]', () => {
  it('constructs the path with leading slash and returns the page', async () => {
    mockFetchWebPageByPath.mockResolvedValue(pageFixture);

    const result = await handler(mockEvent({ path: 'travel/paris' }));

    expect(result).toEqual(pageFixture);
    expect(mockFetchWebPageByPath).toHaveBeenCalledWith('/travel/paris');
  });

  it('handles a single segment path', async () => {
    const page: WebPage = { path: '/about', name: 'About' };
    mockFetchWebPageByPath.mockResolvedValue(page);

    const result = await handler(mockEvent({ path: 'about' }));

    expect(result).toEqual(page);
    expect(mockFetchWebPageByPath).toHaveBeenCalledWith('/about');
  });

  it('calls fetchWebPageByPath with "/" when path param is empty', async () => {
    mockFetchWebPageByPath.mockResolvedValue(null);

    await expect(handler(mockEvent())).rejects.toMatchObject({ statusCode: 404 });
    expect(mockFetchWebPageByPath).toHaveBeenCalledWith('/');
  });

  it('throws 404 when the page is not found', async () => {
    mockFetchWebPageByPath.mockResolvedValue(null);

    await expect(handler(mockEvent({ path: 'missing/page' }))).rejects.toMatchObject({
      statusCode: 404,
    });
  });
});
