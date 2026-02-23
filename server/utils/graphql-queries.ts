import type {
  AllArticlesResponse,
  ArticleResponse,
  AllWebPagesResponse,
  WebPageResponse,
  ImageObjectResponse,
  PlaceResponse,
  IdentifierByValueResponse,
} from '../../shared/types/index';

// ─── Response type map ────────────────────────────────────────────────────────

export type QueryResponseMap = {
  ALL_ARTICLES_QUERY: AllArticlesResponse;
  ARTICLE_BY_IDENTIFIER_QUERY: ArticleResponse;
  LATEST_ARTICLES_QUERY: AllArticlesResponse;
  LATEST_ARTICLES_WITH_LIMIT_QUERY: AllArticlesResponse;
  LATEST_ARTICLES_BY_TAG_QUERY: AllArticlesResponse;
  ALL_WEB_PAGES_QUERY: AllWebPagesResponse;
  WEB_PAGE_BY_PATH_QUERY: WebPageResponse;
  IMAGE_OBJECT_BY_IDENTIFIER_QUERY: ImageObjectResponse;
  PLACE_BY_IDENTIFIER_QUERY: PlaceResponse;
  IDENTIFIER_BY_VALUE_QUERY: IdentifierByValueResponse;
};

// ─── Queries ─────────────────────────────────────────────────────────────────

/** Fetch all articles (first 100) filtered by article section. */
export const ALL_ARTICLES_QUERY = /* GraphQL */ `
  {
    allArticles(
      first: 100
      filter: {
        articleSection: { eq: "https://site-api.datocms.com/items/377818" }
      }
    ) {
      identifier
      name
      img
      articleSection
    }
  }
`;

/** Fetch a single article by its identifier. */
export const ARTICLE_BY_IDENTIFIER_QUERY = /* GraphQL */ `
  query article($identifier: String!) {
    article(filter: { identifier: { eq: $identifier } }) {
      name
      alternateName
      text
      image
      coverImage
    }
  }
`;

/** Fetch the 2 most recently published articles. */
export const LATEST_ARTICLES_QUERY = /* GraphQL */ `
  {
    allArticles(first: 2, orderBy: _firstPublishedAt_DESC) {
      identifier
      name
      image
      _updatedAt
      jsonLd(markdown: false)
    }
  }
`;

/** Fetch the N most recently published articles (variable limit). */
export const LATEST_ARTICLES_WITH_LIMIT_QUERY = /* GraphQL */ `
  query latestArticles($limit: IntType!) {
    allArticles(first: $limit, orderBy: _firstPublishedAt_DESC) {
      identifier
      name
      image
      _updatedAt
      jsonLd(markdown: false)
    }
  }
`;

/** Fetch the 5 most recently published articles filtered by tag ID. */
export const LATEST_ARTICLES_BY_TAG_QUERY = /* GraphQL */ `
  {
    allArticles(
      first: 5
      orderBy: _firstPublishedAt_DESC
      filter: { tags: { anyIn: "731168" } }
    ) {
      url
      name
      image
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
  query image($identifierId: String!) {
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
  query place($identifierId: String!) {
    place(filter: { identifier: { anyIn: [$identifierId] } }) {
      name
      alternateName
      text
      image
      coverImage
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
