import { fetchLatestArticles } from '../../utils/dato-fetch';

/**
 * GET /api/articles/latest
 * Returns the most recently published articles.
 * Accepts optional query param ?limit=N (default: 6).
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const limit = query.limit !== undefined ? Number(query.limit) : 6;
  return fetchLatestArticles(limit);
});
