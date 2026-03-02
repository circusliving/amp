import { fetchLatestArticles, fetchLatestArticlesByTags } from '../../utils/dato-fetch';

/**
 * GET /api/articles/latest
 * Returns the most recently published articles.
 * Accepts optional query params:
 *   ?limit=N (default: 6) — max articles to return
 *   ?tags=id1,id2 — comma-separated DatoCMS tag IDs to filter by
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = query.limit !== undefined ? Number(query.limit) : 6;
  const tags = typeof query.tags === 'string' && query.tags
    ? query.tags.split(',')
    : undefined;

  try {
    if (tags?.length) {
      return await fetchLatestArticlesByTags(limit, tags);
    }
    return await fetchLatestArticles(limit);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }
});
