import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article } from '../../../../shared/types/article';

// ─── Mock dato-fetch ──────────────────────────────────────────────────────────

const mockFetchArticleByIdentifier = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchArticleByIdentifier: (...args: unknown[]) => mockFetchArticleByIdentifier(...args),
}));

// Mock html-processor to return a predictable value
vi.mock('../../../utils/html-processor', () => ({
  processArticleHtml: (html: string) => `[processed]${html}`,
}));

const { default: handler } = await import('../[id].get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const articleFixture: Article = {
  identifier: 'paris-guide',
  name: 'Paris Guide',
  text: '<p>Visit <img src="eiffel.jpg"> the tower.</p>',
};

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchArticleByIdentifier.mockReset();
});

describe('GET /api/articles/:id', () => {
  it('returns the article with processed HTML when found', async () => {
    mockFetchArticleByIdentifier.mockResolvedValue(articleFixture);

    const result = await handler(mockEvent({ id: 'paris-guide' }));

    expect(result).toMatchObject({ identifier: 'paris-guide', name: 'Paris Guide' });
    expect((result as Article).text).toBe('[processed]<p>Visit <img src="eiffel.jpg"> the tower.</p>');
    expect(mockFetchArticleByIdentifier).toHaveBeenCalledWith('paris-guide');
  });

  it('preserves other article fields when returning the result', async () => {
    const article: Article = { identifier: 'test', name: 'Test', description: 'Desc' };
    mockFetchArticleByIdentifier.mockResolvedValue(article);

    const result = await handler(mockEvent({ id: 'test' })) as Article;

    expect(result.description).toBe('Desc');
  });

  it('leaves text undefined when the article has no text', async () => {
    const article: Article = { identifier: 'no-text', name: 'No Text' };
    mockFetchArticleByIdentifier.mockResolvedValue(article);

    const result = await handler(mockEvent({ id: 'no-text' })) as Article;

    expect(result.text).toBeUndefined();
  });

  it('throws 404 when the article is not found', async () => {
    mockFetchArticleByIdentifier.mockResolvedValue(null);

    await expect(handler(mockEvent({ id: 'missing' }))).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 400 when no id param is present', async () => {
    await expect(handler(mockEvent())).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
