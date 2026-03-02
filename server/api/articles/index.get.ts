import { fetchArticles } from '../../utils/dato-fetch';

/**
 * GET /api/articles
 * Returns all articles, optionally filtered by tag name or id via ?tag=xxx.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  let articles;
  try {
    articles = await fetchArticles();
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  const tag = typeof query.tag === 'string' ? query.tag.trim() : undefined;
  if (tag) {
    return articles.filter((a) => a.tags?.some((t) => t.name === tag || t.id === tag));
  }

  return articles;
});
