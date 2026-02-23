import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { MenuItem } from '../../../shared/types/menu';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchMenuItems = vi.fn();
const mockBuildMenuTree = vi.fn();

vi.mock('../../utils/dato-fetch', () => ({
  fetchMenuItems: (...args: unknown[]) => mockFetchMenuItems(...args),
}));

vi.mock('../../utils/menu-builder', () => ({
  buildMenuTree: (...args: unknown[]) => mockBuildMenuTree(...args),
}));

const { default: handler } = await import('../menu.get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const flatItems: MenuItem[] = [
  { path: '/', name: 'Home', order: 0 },
  { path: '/travel', name: 'Travel', order: 1 },
];

const treeResult: MenuItem[] = [
  { path: '/travel', name: 'Travel', order: 1 },
  { path: '/', name: 'Home', order: 0 },
];

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchMenuItems.mockReset();
  mockBuildMenuTree.mockReset();
});

describe('GET /api/menu', () => {
  it('fetches menu items and returns the built tree', async () => {
    mockFetchMenuItems.mockResolvedValue(flatItems);
    mockBuildMenuTree.mockReturnValue(treeResult);

    const result = await handler({} as Parameters<typeof handler>[0]);

    expect(mockFetchMenuItems).toHaveBeenCalledOnce();
    expect(mockBuildMenuTree).toHaveBeenCalledWith(flatItems);
    expect(result).toEqual(treeResult);
  });

  it('returns an empty array when DatoCMS has no pages', async () => {
    mockFetchMenuItems.mockResolvedValue([]);
    mockBuildMenuTree.mockReturnValue([]);

    const result = await handler({} as Parameters<typeof handler>[0]);

    expect(result).toEqual([]);
  });
});
