/**
 * GET /gallaries/:id
 * 301 redirect to the corrected /galleries/:id URL.
 * Preserves SEO juice from any existing inbound links to the misspelled path.
 */
export default defineEventHandler((event) => {
  const id = getRouterParam(event, 'id');
  return sendRedirect(event, `/galleries/${id}`, 301);
});
