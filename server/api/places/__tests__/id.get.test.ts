import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { Place } from '../../../../shared/types/menu';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchPlaceByIdentifier = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchPlaceByIdentifier: (...args: unknown[]) => mockFetchPlaceByIdentifier(...args),
}));

const { default: handler } = await import('../[id].get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const placeFixture: Place = {
  name: 'Paris',
  alternateName: 'City of Lights',
  text: 'Capital of France.',
};

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchPlaceByIdentifier.mockReset();
});

describe('GET /api/places/:id', () => {
  it('returns the place when found', async () => {
    mockFetchPlaceByIdentifier.mockResolvedValue(placeFixture);

    const result = await handler(mockEvent({ id: 'paris' }));

    expect(result).toEqual(placeFixture);
    expect(mockFetchPlaceByIdentifier).toHaveBeenCalledWith('paris');
  });

  it('throws 404 when the place is not found', async () => {
    mockFetchPlaceByIdentifier.mockResolvedValue(null);

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
