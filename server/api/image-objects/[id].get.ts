import { fetchImageObject } from '../../utils/dato-fetch';

/**
 * GET /api/image-objects/:id
 * Returns a single image object by its identifier.
 * Throws 404 if the image object is not found.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'Image object identifier is required' });
  }

  const imageObject = await fetchImageObject(id);
  if (!imageObject) {
    throw createError({ statusCode: 404, message: `Image object not found: ${id}` });
  }

  return imageObject;
});
