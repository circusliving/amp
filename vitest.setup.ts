/**
 * Vitest global setup — provides minimal stubs for Nitro/h3 auto-imports
 * so that server route files can be imported directly in unit tests without
 * the Nitro runtime. Also stubs Nuxt composables used by Pinia stores.
 */
import { vi } from 'vitest';
import { ref } from 'vue';

// defineEventHandler is a thin wrapper in Nitro — it just returns the handler fn.
vi.stubGlobal('defineEventHandler', (fn: (event: unknown) => unknown) => fn);

// getQuery reads the query string from the event.
vi.stubGlobal('getQuery', (event: unknown) => (event as Record<string, unknown>)._query ?? {});

// getRouterParam reads a named route param from the event.
vi.stubGlobal('getRouterParam', (event: unknown, name: string) => {
  const params = (event as Record<string, unknown>)._params as Record<string, string> | undefined;
  return params?.[name];
});

// createError creates a structured error with a statusCode.
vi.stubGlobal(
  'createError',
  ({ statusCode, message }: { statusCode: number; message?: string }) => {
    const err = new Error(message ?? String(statusCode)) as Error & { statusCode: number };
    err.statusCode = statusCode;
    return err;
  },
);

/**
 * useFetch — Nuxt composable used by Pinia stores.
 * Default stub resolves with null data; individual tests override per scenario.
 */
vi.stubGlobal(
  'useFetch',
  vi.fn().mockResolvedValue({
    data: ref(null),
    error: ref(null),
    pending: ref(false),
    refresh: vi.fn(),
  }),
);
