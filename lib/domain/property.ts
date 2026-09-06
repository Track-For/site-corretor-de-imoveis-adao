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
  images: string[];
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

export type PropertyInput = Omit<Property, "id" | "createdAt" | "updatedAt">;
