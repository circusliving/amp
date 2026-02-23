import { fetchAllWebPages } from '../../utils/dato-fetch';

/**
 * GET /api/web-pages
 * Returns all web pages ordered by path.
 */
export default defineEventHandler(async () => {
  return fetchAllWebPages();
});
