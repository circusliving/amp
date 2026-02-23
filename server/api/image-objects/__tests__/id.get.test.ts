import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { ImageObject } from '../../../../shared/types/image-object';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchImageObject = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchImageObject: (...args: unknown[]) => mockFetchImageObject(...args),
}));

const { default: handler } = await import('../[id].get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const imageFixture: ImageObject = {
  name: 'Eiffel Tower',
  url: 'https://example.com/eiffel.jpg',
  encodingFormat: 'image/jpeg',
};

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchImageObject.mockReset();
});

describe('GET /api/image-objects/:id', () => {
  it('returns the image object when found', async () => {
    mockFetchImageObject.mockResolvedValue(imageFixture);

    const result = await handler(mockEvent({ id: 'eiffel' }));

    expect(result).toEqual(imageFixture);
    expect(mockFetchImageObject).toHaveBeenCalledWith('eiffel');
  });

  it('throws 404 when the image object is not found', async () => {
    mockFetchImageObject.mockResolvedValue(null);

    await expect(handler(mockEvent({ id: 'missing' }))).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 400 when no id param is present', async () => {
    await expect(handler(mockEvent())).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
