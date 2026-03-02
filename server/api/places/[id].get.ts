import { fetchPlaceByIdentifier } from '../../utils/dato-fetch';

/**
 * GET /api/places/:id
 * Returns a single place by its identifier.
 * Throws 404 if the place is not found.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'Place identifier is required' });
  }

  let place;
  try {
    place = await fetchPlaceByIdentifier(id);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  if (!place) {
    throw createError({ statusCode: 404, message: `Place not found: ${id}` });
  }

  return place;
});
