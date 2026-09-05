import type {
  PropertyFilters,
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from "@/lib/domain/property";

type RawSearchParams = Record<string, string | string[] | undefined>;

function first(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function positiveNumber(value: string | undefined) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
}

export function parsePropertyFilters(
  searchParams: RawSearchParams,
): PropertyFilters {
  const purpose = first(searchParams.finalidade);
  const propertyType = first(searchParams.tipo);
  const status = first(searchParams.status);

  return {
    purpose:
      purpose === "sale" || purpose === "rent"
        ? (purpose as PropertyPurpose)
        : undefined,
    propertyType: ["apartment", "house", "commercial", "land", "rural"].includes(
      propertyType || "",
    )
      ? (propertyType as PropertyType)
      : undefined,
    city: first(searchParams.cidade) || undefined,
    neighborhood: first(searchParams.bairro) || undefined,
    minPrice: positiveNumber(first(searchParams.precoMin)),
    maxPrice: positiveNumber(first(searchParams.precoMax)),
    bedrooms: positiveNumber(first(searchParams.quartos)),
    suites: positiveNumber(first(searchParams.suites)),
    parkingSpaces: positiveNumber(first(searchParams.vagas)),
    minArea: positiveNumber(first(searchParams.area)),
    furnished:
      first(searchParams.mobiliado) === "true" ? true : undefined,
    isDevelopment:
      first(searchParams.lancamento) === "true" ? true : undefined,
    status: ["available", "reserved", "sold", "rented"].includes(status || "")
      ? (status as PropertyStatus)
      : undefined,
  };
}
