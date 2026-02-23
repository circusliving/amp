export interface ArticleImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
}

export interface ArticleTag {
  id: string;
  name?: string;
}

export interface Article {
  identifier: string;
  name: string;
  alternateName?: string;
  text?: string;
  description?: string;
  image?: string;
  coverImage?: string;
  url?: string;
  articleSection?: string;
  tags?: ArticleTag[];
  jsonLd?: string;
  _updatedAt?: string;
  _firstPublishedAt?: string;
  _createdAt?: string;
}

export interface AllArticlesResponse {
  allArticles: Article[];
}

export interface ArticleResponse {
  article: Article | null;
}
