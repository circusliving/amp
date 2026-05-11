import { fetchArticles, fetchArticlesByTags } from '../../utils/dato-fetch';

/**
 * GET /api/articles
 * Returns all articles, optionally filtered by tag name or id via ?tag=xxx.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event);

  const limit = query.limit !== undefined ? Number(query.limit) : 100;
  const tags = typeof query.tags === 'string' && query.tags
    ? query.tags.split(',')
    : undefined;
  const tag = typeof query.tag === 'string' ? query.tag.trim() : undefined;

  let articles;
  try {
    if (tags?.length) {
      return await fetchArticlesByTags(limit, tags);
    }
    if (tag) {
      return await fetchArticlesByTags(limit, [tag]);
    }
    articles = await fetchArticles();
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  return articles;
});
