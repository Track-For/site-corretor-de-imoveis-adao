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
  code: string;
  slug: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  propertyType: PropertyType;
  status: PropertyStatus;
  price: number;
  condominiumFee?: number;
  iptu?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  area?: number;
  builtArea?: number;
  furnished?: boolean;
  isDevelopment?: boolean;
  featured: boolean;
  isActive: boolean;
  isDemo: boolean;
  city: string;
  neighborhood?: string;
  state: string;
  approximateAddress: string;
  latitude?: number;
  longitude?: number;
  images: PropertyImage[];
  amenities: string[];
  createdAt: string;
  updatedAt: string;
}

export interface PropertyFilters {
  purpose?: PropertyPurpose;
  propertyType?: PropertyType;
  city?: string;
  neighborhood?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  suites?: number;
  parkingSpaces?: number;
  minArea?: number;
  furnished?: boolean;
  isDevelopment?: boolean;
  status?: PropertyStatus;
}

export interface PropertyInput
  extends Omit<
    Property,
    "id" | "createdAt" | "updatedAt" | "images"
  > {
  images: Omit<PropertyImage, "id" | "propertyId">[];
}
