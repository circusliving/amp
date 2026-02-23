export interface MenuItem {
  path: string;
  url?: string;
  name: string;
  menuName?: string;
  order?: number;
  nodes?: MenuItem[];
}

export type MenuTree = MenuItem[];

export interface Place {
  name: string;
  alternateName?: string;
  text?: string;
  image?: string;
  coverImage?: string;
}

export interface PlaceResponse {
  place: Place | null;
}

export interface IdentifierRecord {
  id: string;
}

export interface IdentifierByValueResponse {
  identifier: IdentifierRecord | null;
}
