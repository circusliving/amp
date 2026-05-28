/**
 * GET /_health
 * Liveness probe for the swarm healthcheck. Returns 200 as soon as Nitro is
 * routing requests — deliberately free of DatoCMS or other external calls so a
 * CMS outage never marks an otherwise-healthy container as failed.
 */
export default defineEventHandler((event) => {
  setResponseHeader(event, 'Content-Type', 'text/plain');
  return 'ok';
});
