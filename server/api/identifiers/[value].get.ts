import { fetchIdentifierByValue } from '../../utils/dato-fetch';

/**
 * GET /api/identifiers/:value
 * Resolves a URL slug / identifier value to its DatoCMS identifier record.
 * Used by the frontend to look up a page's content identifier from its path.
 * Throws 404 if no matching identifier is found.
 */
export default defineEventHandler(async (event) => {
  const value = getRouterParam(event, 'value');
  if (!value) {
    throw createError({ statusCode: 400, message: 'Identifier value is required' });
  }

  let identifier;
  try {
    identifier = await fetchIdentifierByValue(value);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  if (!identifier) {
    throw createError({ statusCode: 404, message: `Identifier not found: ${value}` });
  }

  return identifier;
});
