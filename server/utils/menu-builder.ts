import type { MenuItem } from '../../shared/types/menu';

/**
 * Builds a nested menu tree from a flat list of MenuItems.
 *
 * Algorithm (ported from legacy store/index.js `makeTree`):
 *   1. The first item in the list is treated as the home page and is
 *      appended to the end of the final tree.
 *   2. Every remaining page is either top-level (one path segment after the
 *      leading `/`) or a direct child of a top-level page.
 *   3. Children are inserted into the first matching parent's `nodes` array.
 *   4. Both roots and their children are sorted by `order` ascending.
 *
 * Note: only one level of nesting is supported — this mirrors the existing
 * site structure and the original algorithm.
 */
export function buildMenuTree(items: MenuItem[]): MenuItem[] {
  if (items.length === 0) return [];

  const clone = items.map((item) => ({ ...item }));
  const home = clone.shift()!;

  let roots: MenuItem[] = [];

  for (const item of clone) {
    if (isTopLevel(item.path)) {
      roots.push(item);
    } else {
      insertChild(roots, item);
    }
  }

  roots = sortItems(roots);
  roots.push(home);
  return roots;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Returns `true` when `path` has exactly one non-empty segment, e.g. `/travel`.
 */
function isTopLevel(path: string): boolean {
  const parts = path.split('/');
  parts.shift(); // remove empty string produced by leading '/'
  return parts.length === 1;
}

/**
 * Returns `true` when `childPath` is a direct (one-level-deeper) child of
 * `parentPath`, e.g. parent `/travel`, child `/travel/paris`.
 */
function isDirectChild(parentPath: string, childPath: string): boolean {
  const remainder = childPath.replace(parentPath, '');
  return isTopLevel(remainder);
}

/**
 * Inserts `item` into the `nodes` array of the first matching parent in `roots`.
 */
function insertChild(roots: MenuItem[], item: MenuItem): void {
  for (const parent of roots) {
    if (isDirectChild(parent.path, item.path)) {
      if (!Array.isArray(parent.nodes)) parent.nodes = [];
      parent.nodes.push(item);
    }
  }
}

/**
 * Sorts a list of MenuItems by `order` ascending (items without `order` sort to 0).
 * Also sorts each item's child `nodes` array if present.
 */
function sortItems(items: MenuItem[]): MenuItem[] {
  const sorted = [...items].sort(compareOrder);
  for (const item of sorted) {
    if (Array.isArray(item.nodes)) {
      item.nodes = [...item.nodes].sort(compareOrder);
    }
  }
  return sorted;
}

function compareOrder(a: MenuItem, b: MenuItem): number {
  return (a.order ?? 0) - (b.order ?? 0);
}
