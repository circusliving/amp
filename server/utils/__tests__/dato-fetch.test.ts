import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Article } from '../../../shared/types/article';
import type { WebPage } from '../../../shared/types/web-page';
import type { ImageObject } from '../../../shared/types/image-object';
import type { MenuItem } from '../../../shared/types/menu';

// ─── Mock dato-client so tests never hit the network ─────────────────────────

const mockRequest = vi.fn();

vi.mock('../dato-client', () => ({
  useDatoClient: () => ({ request: mockRequest }),
}));

// Import AFTER the mock is set up.
const {
  fetchArticles,
  fetchArticleByIdentifier,
  fetchLatestArticles,
  fetchWebPageByPath,
  fetchAllWebPages,
  fetchImageObject,
  fetchMenuItems,
} = await import('../dato-fetch');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const articleFixture: Article = {
  identifier: 'art-1',
  name: 'Test Article',
  image: 'https://example.com/img.jpg',
  _updatedAt: '2025-01-01T00:00:00+00:00',
};

const webPageFixture: WebPage = {
  path: '/about',
  name: 'About',
  menuName: 'About Us',
  order: 1,
};

const imageObjectFixture: ImageObject = {
  name: 'Hero Image',
  url: 'https://www.datocms-assets.com/hero.jpg',
  encodingFormat: 'image/jpeg',
};

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockRequest.mockReset();
});

describe('fetchArticles', () => {
  it('returns the allArticles array from the response', async () => {
    mockRequest.mockResolvedValue({ allArticles: [articleFixture] });

    const result = await fetchArticles();

    expect(result).toEqual([articleFixture]);
    expect(mockRequest).toHaveBeenCalledOnce();
  });
});

describe('fetchArticleByIdentifier', () => {
  it('passes the identifier variable and returns the article', async () => {
    mockRequest.mockResolvedValue({ article: articleFixture });

    const result = await fetchArticleByIdentifier('art-1');

    expect(result).toEqual(articleFixture);
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { identifier: 'art-1' });
  });

  it('returns null when no article is found', async () => {
    mockRequest.mockResolvedValue({ article: null });

    const result = await fetchArticleByIdentifier('missing');

    expect(result).toBeNull();
  });
});

describe('fetchLatestArticles', () => {
  it('defaults to limit 2', async () => {
    mockRequest.mockResolvedValue({ allArticles: [articleFixture, { ...articleFixture, identifier: 'art-2' }] });

    const result = await fetchLatestArticles();

    expect(result).toHaveLength(2);
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { limit: 2 });
  });

  it('passes a custom limit', async () => {
    mockRequest.mockResolvedValue({ allArticles: [articleFixture] });

    await fetchLatestArticles(5);

    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { limit: 5 });
  });
});

describe('fetchWebPageByPath', () => {
  it('passes the path variable and returns the web page', async () => {
    mockRequest.mockResolvedValue({ webPage: webPageFixture });

    const result = await fetchWebPageByPath('/about');

    expect(result).toEqual(webPageFixture);
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { path: '/about' });
  });

  it('returns null when the page is not found', async () => {
    mockRequest.mockResolvedValue({ webPage: null });

    expect(await fetchWebPageByPath('/missing')).toBeNull();
  });
});

describe('fetchAllWebPages', () => {
  it('returns the allWebPages array', async () => {
    mockRequest.mockResolvedValue({ allWebPages: [webPageFixture] });

    const result = await fetchAllWebPages();

    expect(result).toEqual([webPageFixture]);
  });
});

describe('fetchImageObject', () => {
  it('passes identifierId and returns the image object', async () => {
    mockRequest.mockResolvedValue({ imageObject: imageObjectFixture });

    const result = await fetchImageObject('img-42');

    expect(result).toEqual(imageObjectFixture);
    expect(mockRequest).toHaveBeenCalledWith(expect.any(String), { identifierId: 'img-42' });
  });

  it('returns null when the image object is not found', async () => {
    mockRequest.mockResolvedValue({ imageObject: null });

    expect(await fetchImageObject('missing')).toBeNull();
  });
});

describe('fetchMenuItems', () => {
  it('maps web pages to MenuItem shape (path, url, name, menuName, order)', async () => {
    const page: WebPage = { path: '/home', name: 'Home', url: 'https://example.com', menuName: 'Home', order: 0 };
    mockRequest.mockResolvedValue({ allWebPages: [page] });

    const result: MenuItem[] = await fetchMenuItems();

    expect(result).toEqual([{ path: '/home', name: 'Home', url: 'https://example.com', menuName: 'Home', order: 0 }]);
  });

  it('omits fields not in MenuItem (e.g. text, image)', async () => {
    const page: WebPage = { path: '/p', name: 'P', text: 'some body', image: 'img.jpg' };
    mockRequest.mockResolvedValue({ allWebPages: [page] });

    const [item] = await fetchMenuItems();

    expect(item).not.toHaveProperty('text');
    expect(item).not.toHaveProperty('image');
  });
});
