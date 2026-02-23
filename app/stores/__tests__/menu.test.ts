import { createPinia, setActivePinia } from 'pinia';
import { beforeEach, describe, expect, it } from 'vitest';
import { useMenuStore } from '../menu';

describe('useMenuStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initialises with isOpen = false', () => {
    const store = useMenuStore();
    expect(store.isOpen).toBe(false);
  });

  it('toggle() flips isOpen', () => {
    const store = useMenuStore();
    store.toggle();
    expect(store.isOpen).toBe(true);
    store.toggle();
    expect(store.isOpen).toBe(false);
  });

  it('open() sets isOpen to true', () => {
    const store = useMenuStore();
    store.open();
    expect(store.isOpen).toBe(true);
  });

  it('close() sets isOpen to false', () => {
    const store = useMenuStore();
    store.open();
    store.close();
    expect(store.isOpen).toBe(false);
  });

  it('open() is idempotent when already open', () => {
    const store = useMenuStore();
    store.open();
    store.open();
    expect(store.isOpen).toBe(true);
  });

  it('close() is idempotent when already closed', () => {
    const store = useMenuStore();
    store.close();
    expect(store.isOpen).toBe(false);
  });
});
