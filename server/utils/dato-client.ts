import { GraphQLClient } from 'graphql-request';

let _client: GraphQLClient | null = null;

/**
 * Returns a singleton GraphQL client configured for DatoCMS.
 * Reads the API token from server-only runtimeConfig — never exposed to client.
 * Auto-imported by Nitro in server routes and other server utils.
 */
export function useDatoClient(): GraphQLClient {
  if (!_client) {
    const config = useRuntimeConfig();

    if (!config.datoApiToken) {
      throw createError({
        statusCode: 503,
        message: 'DatoCMS API token is not configured. Set NUXT_DATO_API_TOKEN in your .env file.',
      });
    }

    _client = new GraphQLClient('https://graphql.datocms.com', {
      headers: {
        Authorization: `Bearer ${config.datoApiToken}`,
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
