import { mockProperties } from "@/lib/data/mock-properties";
import type {
  Property,
  PropertyFilters,
  PropertyInput,
} from "@/lib/domain/property";
import type { PropertyRepository } from "./property-repository";

function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

function matches(property: Property, filters: PropertyFilters) {
  if (filters.purpose && property.purpose !== filters.purpose) return false;
  if (
    filters.propertyType &&
    property.propertyType !== filters.propertyType
  )
    return false;
  if (
    filters.city &&
    normalize(property.city) !== normalize(filters.city)
  )
    return false;
  if (
    filters.neighborhood &&
    normalize(property.neighborhood || "") !== normalize(filters.neighborhood)
  )
    return false;
  if (filters.minPrice && property.price < filters.minPrice) return false;
  if (filters.maxPrice && property.price > filters.maxPrice) return false;
  if (filters.bedrooms && (property.bedrooms || 0) < filters.bedrooms)
    return false;
  if (filters.suites && (property.suites || 0) < filters.suites) return false;
  if (
    filters.parkingSpaces &&
    (property.parkingSpaces || 0) < filters.parkingSpaces
  )
    return false;
  if (filters.minArea && (property.area || 0) < filters.minArea) return false;
  if (
    filters.furnished !== undefined &&
    property.furnished !== filters.furnished
  )
    return false;
  if (
    filters.isDevelopment !== undefined &&
    property.isDevelopment !== filters.isDevelopment
  )
    return false;
  if (filters.status && property.status !== filters.status) return false;
  return true;
}

const readonlyError = () =>
  new Error(
    "O repositório local é somente leitura. Faça alterações no painel do Supabase.",
  );

export class LocalPropertyRepository implements PropertyRepository {
  async getProperties(filters: PropertyFilters = {}) {
    return mockProperties
      .filter((property) => property.isActive)
      .filter((property) => matches(property, filters));
  }

  async getFeaturedProperties(limit = 3) {
    return mockProperties
      .filter((property) => property.isActive && property.featured)
      .slice(0, limit);
  }

  async getPropertyBySlug(slug: string) {
    return (
      mockProperties.find(
        (property) => property.slug === slug && property.isActive,
      ) || null
    );
  }

  async getPropertiesByCity(city: string) {
    return this.getProperties({ city });
  }

  async getPropertiesByNeighborhood(neighborhood: string) {
    return this.getProperties({ neighborhood });
  }

  async createProperty(_input: PropertyInput): Promise<Property> {
    void _input;
    throw readonlyError();
  }

  async updateProperty(
    _id: string,
    _input: Partial<PropertyInput>,
  ): Promise<Property> {
    void _id;
    void _input;
    throw readonlyError();
  }

  async archiveProperty(_id: string): Promise<void> {
    void _id;
    throw readonlyError();
  }
}
