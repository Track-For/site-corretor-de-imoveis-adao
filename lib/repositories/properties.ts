import type { PropertyFilters } from "@/lib/domain/property";
import { LocalPropertyRepository } from "./local-property-repository";
import type { PropertyRepository } from "./property-repository";
import { SupabasePropertyRepository } from "./supabase-property-repository";

let repository: PropertyRepository | undefined;

export function getPropertyRepository(): PropertyRepository {
  if (repository) return repository;

  repository =
    process.env.PROPERTY_DATA_SOURCE === "supabase"
      ? new SupabasePropertyRepository()
      : new LocalPropertyRepository();

  return repository;
}

export async function getProperties(filters?: PropertyFilters) {
  return getPropertyRepository().getProperties(filters);
}

export async function getFeaturedProperties(limit?: number) {
  return getPropertyRepository().getFeaturedProperties(limit);
}

export async function getPropertyBySlug(slug: string) {
  return getPropertyRepository().getPropertyBySlug(slug);
}

export async function getPropertiesByCity(city: string) {
  return getPropertyRepository().getPropertiesByCity(city);
}

export async function getPropertiesByNeighborhood(neighborhood: string) {
  return getPropertyRepository().getPropertiesByNeighborhood(neighborhood);
}
