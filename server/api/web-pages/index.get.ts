import { fetchWebPageByPath } from '../../utils/dato-fetch';

/**
 * GET /api/web-pages
 * Fetches the homepage web page (path "/").
 *
 * The catch-all `[...path].get.ts` requires ≥1 path segment and does not
 * match the bare `/api/web-pages` URL, so this explicit handler is needed
 * for the homepage route.
 */
export default defineEventHandler(async () => {
  let page;
  try {
    page = await fetchWebPageByPath('/');
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  if (!page) {
    throw createError({ statusCode: 404, message: 'Web page not found: /' });
  }

  return page;
});
