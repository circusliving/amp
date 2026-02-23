import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { IdentifierRecord } from '../../../../shared/types/menu';

// ─── Mocks ───────────────────────────────────────────────────────────────────

const mockFetchIdentifierByValue = vi.fn();

vi.mock('../../../utils/dato-fetch', () => ({
  fetchIdentifierByValue: (...args: unknown[]) => mockFetchIdentifierByValue(...args),
}));

const { default: handler } = await import('../[value].get');

// ─── Fixtures ────────────────────────────────────────────────────────────────

const identifierFixture: IdentifierRecord = { id: 'abc-123' };

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ───────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockFetchIdentifierByValue.mockReset();
});

describe('GET /api/identifiers/:value', () => {
  it('returns the identifier record when found', async () => {
    mockFetchIdentifierByValue.mockResolvedValue(identifierFixture);

    const result = await handler(mockEvent({ value: 'some-slug' }));

    expect(result).toEqual(identifierFixture);
    expect(mockFetchIdentifierByValue).toHaveBeenCalledWith('some-slug');
  });

  it('throws 404 when the identifier is not found', async () => {
    mockFetchIdentifierByValue.mockResolvedValue(null);

    await expect(handler(mockEvent({ value: 'missing' }))).rejects.toMatchObject({
      statusCode: 404,
    });
  });

  it('throws 400 when no value param is present', async () => {
    await expect(handler(mockEvent())).rejects.toMatchObject({
      statusCode: 400,
    });
  });
});
