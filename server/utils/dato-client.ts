import { readFileSync } from 'node:fs';
import { GraphQLClient } from 'graphql-request';

let _client: GraphQLClient | null = null;

/**
 * Resolves the DatoCMS token at runtime. Prefers the value baked into
 * runtimeConfig (set from NUXT_DATO_API_TOKEN / DATO_READ_ONLY), and falls
 * back to reading NUXT_DATO_API_TOKEN_FILE — the Docker-secret path the swarm
 * stack mounts at /run/secrets/dato_api_token. nuxt.config.ts only runs at
 * build time, so in the deployed container the secret can only be read here,
 * at first use.
 */
function resolveToken(): string {
  const config = useRuntimeConfig();
  if (config.datoApiToken) return config.datoApiToken;

  const file = process.env.NUXT_DATO_API_TOKEN_FILE;
  if (!file) return '';
  try {
    return readFileSync(file, 'utf8').trim();
  } catch {
    return '';
  }
}

/**
 * Returns a singleton GraphQL client configured for DatoCMS.
 * Reads the API token from server-only runtimeConfig — never exposed to client.
 * Auto-imported by Nitro in server routes and other server utils.
 */
export function useDatoClient(): GraphQLClient {
  if (!_client) {
    const token = resolveToken();

    if (!token) {
      throw createError({
        statusCode: 503,
        message: 'DatoCMS API token is not configured. Set NUXT_DATO_API_TOKEN or DATO_READ_ONLY (or NUXT_DATO_API_TOKEN_FILE) in your environment.',
      });
    }

    _client = new GraphQLClient('https://graphql.datocms.com', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
  return _client;
}

/**
 * Resets the singleton client. Intended for use in unit tests only.
 * @internal
 */
export function _resetDatoClient(): void {
  _client = null;
}
