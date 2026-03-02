import { fetchMenuItems } from '../utils/dato-fetch';
import { buildMenuTree } from '../utils/menu-builder';

/**
 * GET /api/menu
 * Returns the full site navigation as a nested MenuItem tree.
 * The first item from DatoCMS is treated as the home page and appended last.
 */
export default defineEventHandler(async () => {
  try {
    const items = await fetchMenuItems();
    return buildMenuTree(items);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }
});
