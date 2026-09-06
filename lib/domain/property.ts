export type PropertyPurpose = "sale" | "rent";

export type PropertyType =
  | "apartment"
  | "house"
  | "commercial"
  | "land"
  | "rural";

export type PropertyStatus =
  | "draft"
  | "available"
  | "reserved"
  | "sold"
  | "rented"
  | "inactive";

export interface PropertyImage {
  id: string;
  propertyId: string;
  url: string;
  alt: string;
  order: number;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  images: PropertyImage[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  propertyType?: PropertyType;
  city?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: PropertyStatus;
}

export interface PropertyInput
  extends Omit<
    Property,
    "id" | "createdAt" | "updatedAt" | "images"
  > {
  images: Omit<PropertyImage, "id" | "propertyId">[];
}
