import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { GraphQLClient } from 'graphql-request';

// Always reset the module-level singleton before each test so tests are isolated.
let resetDatoClient: () => void;
let useDatoClient: () => GraphQLClient;

beforeEach(async () => {
  // Stub the Nitro auto-import `useRuntimeConfig` before importing the module.
  vi.stubGlobal('useRuntimeConfig', () => ({
    datoApiToken: 'test-token-abc',
  }));

  // Reset module registry so the singleton starts null for each test.
  vi.resetModules();
  const mod = await import('../dato-client');
  useDatoClient = mod.useDatoClient;
  resetDatoClient = mod._resetDatoClient;
});

afterEach(() => {
  resetDatoClient?.();
  vi.unstubAllGlobals();
});

describe('useDatoClient', () => {
  it('creates a GraphQLClient instance', () => {
    const client = useDatoClient();
    expect(client).toBeInstanceOf(GraphQLClient);
  });

  it('returns the same singleton instance on repeated calls', () => {
    const first = useDatoClient();
    const second = useDatoClient();
    expect(first).toBe(second);
  });

  it('calls useRuntimeConfig to read the API token', () => {
    const spy = vi.fn(() => ({ datoApiToken: 'spy-token' }));
    vi.stubGlobal('useRuntimeConfig', spy);

    // Reset singleton so the next call goes through client creation again.
    resetDatoClient();
    useDatoClient();

    expect(spy).toHaveBeenCalledOnce();
  });

  it('creates a new client after _resetDatoClient is called', () => {
    const first = useDatoClient();
    resetDatoClient();
    const second = useDatoClient();
    expect(first).not.toBe(second);
  });
});
