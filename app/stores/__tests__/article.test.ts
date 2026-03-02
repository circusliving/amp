import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Article } from '~~/shared/types/article';
import { useArticleStore } from '../article';

const MOCK_ARTICLES: Article[] = [
  {
    identifier: 'article-1',
    name: 'First Article',
    description: 'About the first article',
  },
  {
    identifier: 'article-2',
    name: 'Second Article',
    description: 'About the second article',
  },
];

describe('useArticleStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('initialises with empty latestArticles', () => {
    const store = useArticleStore();
    expect(store.latestArticles).toEqual([]);
  });

  it('fetchLatest populates latestArticles on success', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(MOCK_ARTICLES));

    const store = useArticleStore();
    await store.fetchLatest();

    expect(store.latestArticles).toEqual(MOCK_ARTICLES);
  });

  it('fetchLatest passes limit query param', async () => {
    const mockFetch = vi.fn().mockResolvedValue([]);
    vi.stubGlobal('$fetch', mockFetch);

    const store = useArticleStore();
    await store.fetchLatest(3);

    expect(mockFetch).toHaveBeenCalledWith('/api/articles/latest', { query: { limit: 3 } });
  });

  it('fetchLatest uses default limit of 6', async () => {
    const mockFetch = vi.fn().mockResolvedValue([]);
    vi.stubGlobal('$fetch', mockFetch);

    const store = useArticleStore();
    await store.fetchLatest();

    expect(mockFetch).toHaveBeenCalledWith('/api/articles/latest', { query: { limit: 6 } });
  });

  it('fetchLatest does not overwrite latestArticles when data is null', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(null));

    const store = useArticleStore();
    store.latestArticles = [...MOCK_ARTICLES];
    await store.fetchLatest();

    expect(store.latestArticles).toEqual(MOCK_ARTICLES);
  });
});
