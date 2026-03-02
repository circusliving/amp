import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { MenuItem } from '~~/shared/types/menu';
import { useNavigationStore } from '../navigation';

const MOCK_MENU: MenuItem[] = [
  {
    path: '/lifestyle',
    name: 'Lifestyle',
    order: 1,
    nodes: [
      { path: '/lifestyle/food', name: 'Food', order: 1 },
      { path: '/lifestyle/travel', name: 'Travel', order: 2 },
    ],
  },
  {
    path: '/arts',
    name: 'Arts',
    order: 2,
  },
];

describe('useNavigationStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
    vi.restoreAllMocks();
  });

  it('initialises with empty menuItems', () => {
    const store = useNavigationStore();
    expect(store.menuItems).toEqual([]);
  });

  it('fetchMenu populates menuItems on success', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(MOCK_MENU));

    const store = useNavigationStore();
    await store.fetchMenu();

    expect(store.menuItems).toEqual(MOCK_MENU);
  });

  it('fetchMenu calls the correct API endpoint', async () => {
    const mockFetch = vi.fn().mockResolvedValue([]);
    vi.stubGlobal('$fetch', mockFetch);

    const store = useNavigationStore();
    await store.fetchMenu();

    expect(mockFetch).toHaveBeenCalledWith('/api/menu');
  });

  it('fetchMenu does not overwrite menuItems when data is null', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(null));

    const store = useNavigationStore();
    store.menuItems = [...MOCK_MENU];
    await store.fetchMenu();

    expect(store.menuItems).toEqual(MOCK_MENU);
  });

  it('menuItems preserves nested nodes structure', async () => {
    vi.stubGlobal('$fetch', vi.fn().mockResolvedValue(MOCK_MENU));

    const store = useNavigationStore();
    await store.fetchMenu();

    const firstItem = store.menuItems[0];
    expect(firstItem?.nodes).toHaveLength(2);
    expect(firstItem?.nodes?.[0]?.path).toBe('/lifestyle/food');
  });
});
