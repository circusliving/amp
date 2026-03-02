import { fetchAllWebPages } from '../../utils/dato-fetch';

/**
 * GET /api/web-pages
 * Returns all web pages ordered by path.
 */
export default defineEventHandler(async () => {
  try {
    return await fetchAllWebPages();
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }
});
