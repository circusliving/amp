import type { Article, AllArticlesResponse, ArticleResponse } from '../../shared/types/article';
import type { WebPage, AllWebPagesResponse, WebPageResponse } from '../../shared/types/web-page';
import type { ImageObject, ImageObjectResponse } from '../../shared/types/image-object';
import type {
  MenuItem,
  Place,
  PlaceResponse,
  IdentifierRecord,
  IdentifierByValueResponse,
} from '../../shared/types/menu';
import { useDatoClient } from './dato-client';
import {
  ALL_ARTICLES_QUERY,
  ARTICLE_BY_IDENTIFIER_QUERY,
  LATEST_ARTICLES_WITH_LIMIT_QUERY,
  LATEST_ARTICLES_BY_TAGS_QUERY,
  ALL_WEB_PAGES_QUERY,
  WEB_PAGE_BY_PATH_QUERY,
  IMAGE_OBJECT_BY_IDENTIFIER_QUERY,
  PLACE_BY_IDENTIFIER_QUERY,
  IDENTIFIER_BY_VALUE_QUERY,
} from './graphql-queries';

/**
 * Fetches all articles (up to 100) filtered by the main article section.
 */
export async function fetchArticles(): Promise<Article[]> {
  const data = await useDatoClient().request<AllArticlesResponse>(ALL_ARTICLES_QUERY);
  return data.allArticles;
}

/**
 * Fetches a single article by its identifier.
 * Returns `null` when no matching article is found.
 */
export async function fetchArticleByIdentifier(identifier: string): Promise<Article | null> {
  const data = await useDatoClient().request<ArticleResponse>(ARTICLE_BY_IDENTIFIER_QUERY, {
    identifier,
  });
  return data.article;
}

/**
 * Fetches the most recently published articles.
 * @param limit - Maximum number of articles to return (default: 2)
 */
export async function fetchLatestArticles(limit = 2): Promise<Article[]> {
  const data = await useDatoClient().request<AllArticlesResponse>(
    LATEST_ARTICLES_WITH_LIMIT_QUERY,
    { limit },
  );
  return data.allArticles;
}

/**
 * Fetches the most recently published articles filtered by tag IDs.
 * @param limit - Maximum number of articles to return
 * @param tagIds - Array of DatoCMS tag IDs to filter by
 */
export async function fetchLatestArticlesByTags(limit: number, tagIds: string[]): Promise<Article[]> {
  const data = await useDatoClient().request<AllArticlesResponse>(
    LATEST_ARTICLES_BY_TAGS_QUERY,
    { limit, tagIds },
  );
  return data.allArticles;
}

/**
 * Fetches a single web page by its URL path.
 * Returns `null` when no matching page is found.
 */
export async function fetchWebPageByPath(path: string): Promise<WebPage | null> {
  const data = await useDatoClient().request<WebPageResponse>(WEB_PAGE_BY_PATH_QUERY, { path });
  return data.webPage;
}

/**
 * Fetches all web pages (up to 100) ordered by path.
 */
export async function fetchAllWebPages(): Promise<WebPage[]> {
  const data = await useDatoClient().request<AllWebPagesResponse>(ALL_WEB_PAGES_QUERY);
  return data.allWebPages;
}

/**
 * Fetches a single image object by its identifier.
 * Returns `null` when no matching image object is found.
 */
export async function fetchImageObject(id: string): Promise<ImageObject | null> {
  const data = await useDatoClient().request<ImageObjectResponse>(
    IMAGE_OBJECT_BY_IDENTIFIER_QUERY,
    { identifierId: id },
  );
  return data.imageObject;
}

/**
 * Fetches all web pages and returns them as a flat `MenuItem` list.
 * Tree assembly (parent/child relationships) is done by the consuming API route or store.
 */
export async function fetchMenuItems(): Promise<MenuItem[]> {
  const pages = await fetchAllWebPages();
  return pages.map(({ path, url, name, menuName, order }) => ({
    path,
    url,
    name,
    menuName,
    order,
  }));
}

/**
 * Fetches a single place by its identifier.
 * Returns `null` when no matching place is found.
 */
export async function fetchPlaceByIdentifier(id: string): Promise<Place | null> {
  const data = await useDatoClient().request<PlaceResponse>(PLACE_BY_IDENTIFIER_QUERY, {
    identifierId: id,
  });
  return data.place;
}

/**
 * Resolves an identifier record by its value string.
 * Returns `null` when no matching identifier is found.
 */
export async function fetchIdentifierByValue(value: string): Promise<IdentifierRecord | null> {
  const data = await useDatoClient().request<IdentifierByValueResponse>(IDENTIFIER_BY_VALUE_QUERY, {
    value,
  });
  return data.identifier;
}
