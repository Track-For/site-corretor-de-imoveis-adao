import type {
  Property,
  PropertyFilters,
  PropertyInput,
} from "@/lib/domain/property";

export interface PropertyRepository {
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertyBySlug(slug: string): Promise<Property | null>;
  getPropertiesByCity(city: string): Promise<Property[]>;
  getPropertiesByNeighborhood(neighborhood: string): Promise<Property[]>;
  createProperty(input: PropertyInput): Promise<Property>;
  updateProperty(id: string, input: Partial<PropertyInput>): Promise<Property>;
  archiveProperty(id: string): Promise<void>;
}
