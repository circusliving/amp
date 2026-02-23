import { fetchMenuItems } from '../utils/dato-fetch';
import { buildMenuTree } from '../utils/menu-builder';

/**
 * GET /api/menu
 * Returns the full site navigation as a nested MenuItem tree.
 * The first item from DatoCMS is treated as the home page and appended last.
 */
export default defineEventHandler(async () => {
  const items = await fetchMenuItems();
  return buildMenuTree(items);
});
