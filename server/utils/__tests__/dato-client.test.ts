import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mkdtempSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { GraphQLClient } from 'graphql-request';

// Always reset the module-level singleton before each test so tests are isolated.
let resetDatoClient: () => void;
let useDatoClient: () => GraphQLClient;

const loadModule = async () => {
  vi.resetModules();
  const mod = await import('../dato-client');
  useDatoClient = mod.useDatoClient;
  resetDatoClient = mod._resetDatoClient;
};

beforeEach(async () => {
  // Stub the Nitro auto-import `useRuntimeConfig` before importing the module.
  vi.stubGlobal('useRuntimeConfig', () => ({
    datoApiToken: 'test-token-abc',
  }));
  vi.stubGlobal('createError', (e: { statusCode: number; message: string }) => Object.assign(new Error(e.message), e));

  await loadModule();
});

afterEach(() => {
  resetDatoClient?.();
  delete process.env.NUXT_DATO_API_TOKEN_FILE;
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

  it('falls back to NUXT_DATO_API_TOKEN_FILE when runtimeConfig token is empty', async () => {
    const dir = mkdtempSync(join(tmpdir(), 'dato-'));
    const file = join(dir, 'token');
    writeFileSync(file, '  secret-from-file\n');
    process.env.NUXT_DATO_API_TOKEN_FILE = file;

    vi.stubGlobal('useRuntimeConfig', () => ({ datoApiToken: '' }));
    vi.stubGlobal('createError', (e: { statusCode: number; message: string }) => Object.assign(new Error(e.message), e));
    await loadModule();

    // Should not throw — token resolved from the secret file.
    expect(() => useDatoClient()).not.toThrow();
    rmSync(dir, { recursive: true, force: true });
  });

  it('throws 503 when neither runtimeConfig token nor secret file is available', async () => {
    vi.stubGlobal('useRuntimeConfig', () => ({ datoApiToken: '' }));
    vi.stubGlobal('createError', (e: { statusCode: number; message: string }) => Object.assign(new Error(e.message), e));
    await loadModule();

    expect(() => useDatoClient()).toThrow(/not configured/);
  });
});
