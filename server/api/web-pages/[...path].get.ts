import { fetchWebPageByPath } from '../../utils/dato-fetch';

/**
 * GET /api/web-pages/:section/:page (catch-all)
 * Matches any depth path, e.g. /api/web-pages/travel/paris.
 * The captured segments are joined to produce the DatoCMS path value (e.g. /travel/paris).
 * Throws 404 if the page is not found.
 */
export default defineEventHandler(async (event) => {
  const raw = getRouterParam(event, 'path') ?? '';
  const path = '/' + raw;

  let page;
  try {
    page = await fetchWebPageByPath(path);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  if (!page) {
    throw createError({ statusCode: 404, message: `Web page not found: ${path}` });
  }

  return page;
});
