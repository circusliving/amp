export interface WidgetCollection {
  name: string;
}

export interface WidgetTag {
  id: string;
}

export interface WebPage {
  path: string;
  url?: string;
  name: string;
  menuName?: string;
  description?: string;
  alternateName?: string;
  text?: string;
  image?: string;
  coverImage?: string;
  widget?: string;
  widgetCollections?: WidgetCollection[];
  widgetTags?: WidgetTag[];
  redirect?: string;
  order?: number;
}

export interface AllWebPagesResponse {
  allWebPages: WebPage[];
}

export interface WebPageResponse {
  webPage: WebPage | null;
}
