import type { AllArticlesResponse, ArticleResponse } from '../../shared/types/article';
import type { AllWebPagesResponse, WebPageResponse } from '../../shared/types/web-page';
import type { ImageObjectResponse } from '../../shared/types/image-object';
import type { PlaceResponse, IdentifierByValueResponse } from '../../shared/types/menu';

// ─── Response type map ────────────────────────────────────────────────────────

export type QueryResponseMap = {
  ALL_ARTICLES_QUERY: AllArticlesResponse;
  ARTICLE_BY_IDENTIFIER_QUERY: ArticleResponse;
  LATEST_ARTICLES_WITH_LIMIT_QUERY: AllArticlesResponse;
  LATEST_ARTICLES_BY_TAGS_QUERY: AllArticlesResponse;
  ALL_WEB_PAGES_QUERY: AllWebPagesResponse;
  WEB_PAGE_BY_PATH_QUERY: WebPageResponse;
  IMAGE_OBJECT_BY_IDENTIFIER_QUERY: ImageObjectResponse;
  PLACE_BY_IDENTIFIER_QUERY: PlaceResponse;
  IDENTIFIER_BY_VALUE_QUERY: IdentifierByValueResponse;
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Fetch all articles (first 100). */
export const ALL_ARTICLES_QUERY = /* GraphQL */ `
  {
    allArticles(first: 100) {
      identifier
      name
      alternateName
      description
      image
      coverImage
      url
    }
  }
`;

/** Fetch a single article by its identifier. */
export const ARTICLE_BY_IDENTIFIER_QUERY = /* GraphQL */ `
  query article($identifier: String!) {
    article(filter: { identifier: { eq: $identifier } }) {
      identifier
      name
      alternateName
      description
      text
      image
      coverImage
      url
      _firstPublishedAt
      _createdAt
      _updatedAt
    }
  }
`;

/** Fetch the N most recently published articles (variable limit). */
export const LATEST_ARTICLES_WITH_LIMIT_QUERY = /* GraphQL */ `
  query latestArticles($limit: IntType!) {
    allArticles(first: $limit, orderBy: _firstPublishedAt_DESC) {
      identifier
      name
      alternateName
      description
      image
      coverImage
      url
      _updatedAt
      _firstPublishedAt
      jsonLd(markdown: false)
    }
  }
`;

/** Fetch the N most recently published articles filtered by tag IDs. */
export const LATEST_ARTICLES_BY_TAGS_QUERY = /* GraphQL */ `
  query latestArticlesByTags($limit: IntType!, $tagIds: [ItemId!]!) {
    allArticles(
      first: $limit
      orderBy: _firstPublishedAt_DESC
      filter: { tags: { anyIn: $tagIds } }
    ) {
      identifier
      name
      alternateName
      description
      image
      coverImage
      url
      _updatedAt
      _firstPublishedAt
      jsonLd(markdown: false)
    }
  }
`;

/** Fetch all web pages (first 100) ordered by path. */
export const ALL_WEB_PAGES_QUERY = /* GraphQL */ `
  {
    allWebPages(first: 100, orderBy: [path_ASC]) {
      name
      menuName
      path
      url
      order
    }
  }
`;

/** Fetch a single web page by URL path. */
export const WEB_PAGE_BY_PATH_QUERY = /* GraphQL */ `
  query webPage($path: String!) {
    webPage(filter: { path: { eq: $path } }) {
      url
      name
      description
      alternateName
      text
      image
      coverImage
      widget
      widgetCollections {
        name
      }
      widgetTags {
        id
      }
      redirect
    }
  }
`;

/** Fetch a single image object by its identifier. */
export const IMAGE_OBJECT_BY_IDENTIFIER_QUERY = /* GraphQL */ `
  query image($identifierId: ItemId!) {
    imageObject(filter: { identifier: { anyIn: [$identifierId] } }) {
      name
      url
      contentUrl
      creator {
        id
      }
      caption
      keywords
      height {
        id
      }
      width {
        id
      }
      contentSize {
        id
      }
      sameAs {
        id
      }
      encodingFormat
    }
  }
`;

/** Fetch a single place by its identifier. */
export const PLACE_BY_IDENTIFIER_QUERY = /* GraphQL */ `
  query place($identifierId: ItemId!) {
    place(filter: { identifier: { anyIn: [$identifierId] } }) {
      name
      alternateName
      description
      url
      image {
        name
        url
        contentUrl
      }
    }
  }
`;

/** Look up an identifier record by its value string. */
export const IDENTIFIER_BY_VALUE_QUERY = /* GraphQL */ `
  query identifier($value: String!) {
    identifier(filter: { value: { eq: $value } }) {
      id
    }
  }
`;
