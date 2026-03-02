import { fetchArticleByIdentifier } from '../../utils/dato-fetch';
import { processArticleHtml } from '../../utils/html-processor';

/**
 * GET /api/articles/:id
 * Returns a single article by its identifier.
 * Processes article body HTML to add lazy loading to images.
 * Throws 404 if the article is not found.
 */
export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, message: 'Article identifier is required' });
  }

  let article;
  try {
    article = await fetchArticleByIdentifier(id);
  } catch (error) {
    if (error && typeof error === 'object' && 'statusCode' in error) throw error;
    throw createError({ statusCode: 503, message: 'Content service unavailable', cause: error as Error });
  }

  if (!article) {
    throw createError({ statusCode: 404, message: `Article not found: ${id}` });
  }

  return {
    ...article,
    text: article.text ? processArticleHtml(article.text) : article.text,
  };
});
