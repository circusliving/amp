import { fetchArticles } from '../../utils/dato-fetch';

/**
 * GET /api/articles
 * Returns all articles, optionally filtered by tag name or id via ?tag=xxx.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const articles = await fetchArticles();

  const tag = typeof query.tag === 'string' ? query.tag.trim() : undefined;
  if (tag) {
    return articles.filter((a) => a.tags?.some((t) => t.name === tag || t.id === tag));
  }

  return articles;
});
