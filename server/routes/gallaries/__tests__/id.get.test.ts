import { describe, it, expect, vi, beforeEach } from 'vitest';

// ─── Stub sendRedirect (Nitro auto-import) ────────────────────────────────────

const mockSendRedirect = vi.fn().mockResolvedValue(undefined);
vi.stubGlobal('sendRedirect', mockSendRedirect);

const { default: handler } = await import('../[id].get');

// ─── Helpers ─────────────────────────────────────────────────────────────────

function mockEvent(params: Record<string, string> = {}) {
  return { _query: {}, _params: params };
}

// ─── Tests ────────────────────────────────────────────────────────────────────

beforeEach(() => {
  mockSendRedirect.mockClear();
});

describe('GET /gallaries/:id', () => {
  it('calls sendRedirect with 301 to /galleries/:id', async () => {
    const event = mockEvent({ id: 'some-gallery' });
    await handler(event);
    expect(mockSendRedirect).toHaveBeenCalledWith(event, '/galleries/some-gallery', 301);
  });

  it('preserves the id in the redirect target', async () => {
    const event = mockEvent({ id: 'paris-2024' });
    await handler(event);
    expect(mockSendRedirect).toHaveBeenCalledWith(event, '/galleries/paris-2024', 301);
  });

  it('handles id with special characters in the URL', async () => {
    const event = mockEvent({ id: 'my-gallery-123' });
    await handler(event);
    expect(mockSendRedirect).toHaveBeenCalledWith(event, '/galleries/my-gallery-123', 301);
  });
});
