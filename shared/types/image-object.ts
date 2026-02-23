export interface QuantitativeValue {
  id: string;
}

export interface Person {
  id: string;
}

export interface ImageObject {
  identifier?: string;
  name?: string;
  url?: string;
  contentUrl?: string;
  creator?: Person;
  caption?: string;
  keywords?: string;
  height?: QuantitativeValue;
  width?: QuantitativeValue;
  contentSize?: QuantitativeValue;
  sameAs?: QuantitativeValue;
  encodingFormat?: string;
}

export interface ImageObjectResponse {
  imageObject: ImageObject | null;
}
