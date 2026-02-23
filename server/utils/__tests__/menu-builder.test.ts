import { describe, it, expect } from 'vitest';
import type { MenuItem } from '../../../shared/types/menu';
import { buildMenuTree } from '../menu-builder';

// ─── Fixtures ────────────────────────────────────────────────────────────────

const home: MenuItem = { path: '/', name: 'Home', order: 0 };
const travel: MenuItem = { path: '/travel', name: 'Travel', order: 1 };
const paris: MenuItem = { path: '/travel/paris', name: 'Paris', order: 2 };
const london: MenuItem = { path: '/travel/london', name: 'London', order: 1 };
const about: MenuItem = { path: '/about', name: 'About', order: 2 };
const noOrder: MenuItem = { path: '/contact', name: 'Contact' };

// ─── Tests ───────────────────────────────────────────────────────────────────

describe('buildMenuTree', () => {
  it('returns empty array for empty input', () => {
    expect(buildMenuTree([])).toEqual([]);
  });

  it('returns [home] when only the home item is provided', () => {
    const result = buildMenuTree([home]);
    expect(result).toHaveLength(1);
    expect(result[0].path).toBe('/');
  });

  it('places home at the end of the tree', () => {
    const result = buildMenuTree([home, travel, about]);
    expect(result[result.length - 1].path).toBe('/');
  });

  it('puts top-level pages before home and sorts them by order', () => {
    const result = buildMenuTree([home, about, travel]);
    // about.order=2, travel.order=1 → travel first, about second
    expect(result[0].path).toBe('/travel');
    expect(result[1].path).toBe('/about');
    expect(result[2].path).toBe('/'); // home last
  });

  it('assigns children to their parent node', () => {
    const result = buildMenuTree([home, travel, paris, london]);
    const travelNode = result.find((n) => n.path === '/travel');
    expect(travelNode?.nodes).toHaveLength(2);
    const paths = travelNode!.nodes!.map((n) => n.path);
    expect(paths).toContain('/travel/paris');
    expect(paths).toContain('/travel/london');
  });

  it('sorts child nodes by order ascending', () => {
    const result = buildMenuTree([home, travel, paris, london]);
    const travelNode = result.find((n) => n.path === '/travel');
    expect(travelNode!.nodes![0].path).toBe('/travel/london'); // order=1
    expect(travelNode!.nodes![1].path).toBe('/travel/paris');  // order=2
  });

  it('treats items with no order as order 0', () => {
    const result = buildMenuTree([home, noOrder, travel]);
    // noOrder has no order (→ 0), travel.order=1 → noOrder first
    expect(result[0].path).toBe('/contact');
    expect(result[1].path).toBe('/travel');
  });

  it('does not mutate the input array', () => {
    const input = [home, travel, paris];
    const copy = input.map((i) => ({ ...i }));
    buildMenuTree(input);
    expect(input).toEqual(copy);
  });

  it('handles a page whose parent is not in the top-level list without throwing', () => {
    // /travel is missing — /travel/paris has no parent to attach to
    const result = buildMenuTree([home, paris]);
    // paris is not top-level and has no parent → it is silently not added
    const paths = result.map((n) => n.path);
    expect(paths).not.toContain('/travel/paris');
  });
});
