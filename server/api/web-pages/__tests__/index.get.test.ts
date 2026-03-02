import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { WebPage } from '../../../../shared/types/web-page';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchWebPageByPath = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchWebPageByPath: (...args: unknown[]) => mockFetchWebPageByPath(...args),
}));

const { default: handler } = await import('../index.get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const homepageFixture: WebPage = {
  path: '/',
  name: 'Circus Living',
  description: 'Welcome to Circus Living',
  alternateName: 'Circus Living — Home',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchWebPageByPath.mockReset();
});

describe('GET /api/web-pages (homepage)', () => {
  it('fetches the homepage web page at path "/"', async () => {
    mockFetchWebPageByPath.mockResolvedValue(homepageFixture);

    const result = await handler({} as never);

    expect(result).toEqual(homepageFixture);
    expect(mockFetchWebPageByPath).toHaveBeenCalledWith('/');
  });

  it('throws 404 when no homepage web page exists', async () => {
    mockFetchWebPageByPath.mockResolvedValue(null);

    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 404 });
  });

  it('throws 503 when dato-fetch throws a non-HTTP error', async () => {
    mockFetchWebPageByPath.mockRejectedValue(new Error('Network error'));

    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 503 });
  });

  it('rethrows HTTP errors from dato-fetch', async () => {
    const httpError = { statusCode: 500, message: 'Internal error' };
    mockFetchWebPageByPath.mockRejectedValue(httpError);

    await expect(handler({} as never)).rejects.toMatchObject({ statusCode: 500 });
  });
});
