import type {
  Property,
  PropertyFilters,
  PropertyInput,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
} from "@/lib/domain/property";
import type { PropertyRepository } from "./property-repository";

interface SupabaseRow {
  id: string;
  code: string;
  slug: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  condominium_fee?: number;
  iptu?: number;
  bedrooms?: number;
  suites?: number;
  bathrooms?: number;
  parking_spaces?: number;
  area?: number;
  built_area?: number;
  furnished?: boolean;
  is_development?: boolean;
  featured: boolean;
  is_active: boolean;
  is_demo?: boolean;
  city: string;
  neighborhood?: string;
  state: string;
  approximate_address: string;
  latitude?: number;
  longitude?: number;
  amenities?: string[];
  created_at: string;
  updated_at: string;
  property_images?: Array<{
    id: string;
    property_id: string;
    url: string;
    alt: string;
    sort_order: number;
  }>;
}

function fromRow(row: SupabaseRow): Property {
  return {
    id: row.id,
    code: row.code,
    slug: row.slug,
    title: row.title,
    description: row.description,
    purpose: row.purpose,
    propertyType: row.property_type,
    status: row.status,
    price: Number(row.price),
    condominiumFee: row.condominium_fee
      ? Number(row.condominium_fee)
      : undefined,
    iptu: row.iptu ? Number(row.iptu) : undefined,
    bedrooms: row.bedrooms,
    suites: row.suites,
    bathrooms: row.bathrooms,
    parkingSpaces: row.parking_spaces,
    area: row.area ? Number(row.area) : undefined,
    builtArea: row.built_area ? Number(row.built_area) : undefined,
    furnished: row.furnished,
    isDevelopment: row.is_development,
    featured: row.featured,
    isActive: row.is_active,
    isDemo: row.is_demo ?? false,
    city: row.city,
    neighborhood: row.neighborhood,
    state: row.state,
    approximateAddress: row.approximate_address,
    latitude: row.latitude,
    longitude: row.longitude,
    amenities: row.amenities || [],
    images: (row.property_images || [])
      .map((image) => ({
        id: image.id,
        propertyId: image.property_id,
        url: image.url,
        alt: image.alt,
        order: image.sort_order,
      }))
      .sort((a, b) => a.order - b.order),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabasePropertyRepository implements PropertyRepository {
  private readonly baseUrl: string;
  private readonly publicKey: string;

  constructor() {
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !publicKey) {
      throw new Error(
        "Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
      );
    }

    this.baseUrl = `${url.replace(/\/$/, "")}/rest/v1`;
    this.publicKey = publicKey;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const response = await fetch(`${this.baseUrl}${path}`, {
      ...init,
      headers: {
        apikey: this.publicKey,
        Authorization: `Bearer ${this.publicKey}`,
        "Content-Type": "application/json",
        ...init?.headers,
      },
      next: { revalidate: 300, tags: ["properties"] },
    });

    if (!response.ok) {
      throw new Error(`Falha ao consultar imóveis: ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  async getProperties(filters: PropertyFilters = {}) {
    const params = new URLSearchParams({
      select: "*,property_images(*)",
      is_active: "eq.true",
      order: "created_at.desc",
    });

    if (filters.purpose) params.set("purpose", `eq.${filters.purpose}`);
    if (filters.propertyType)
      params.set("property_type", `eq.${filters.propertyType}`);
    if (filters.city) params.set("city", `eq.${filters.city}`);
    if (filters.neighborhood)
      params.set("neighborhood", `eq.${filters.neighborhood}`);
    if (filters.minPrice) params.set("price", `gte.${filters.minPrice}`);
    if (filters.maxPrice) params.append("price", `lte.${filters.maxPrice}`);
    if (filters.bedrooms)
      params.set("bedrooms", `gte.${filters.bedrooms}`);
    if (filters.suites) params.set("suites", `gte.${filters.suites}`);
    if (filters.parkingSpaces)
      params.set("parking_spaces", `gte.${filters.parkingSpaces}`);
    if (filters.minArea) params.set("area", `gte.${filters.minArea}`);
    if (filters.furnished !== undefined)
      params.set("furnished", `eq.${filters.furnished}`);
    if (filters.isDevelopment !== undefined)
      params.set("is_development", `eq.${filters.isDevelopment}`);
    if (filters.status) params.set("status", `eq.${filters.status}`);

    const rows = await this.request<SupabaseRow[]>(
      `/properties?${params.toString()}`,
    );
    return rows.map(fromRow);
  }

  async getFeaturedProperties(limit = 3) {
    const params = new URLSearchParams({
      select: "*,property_images(*)",
      is_active: "eq.true",
      featured: "eq.true",
      order: "created_at.desc",
      limit: String(limit),
    });
    const rows = await this.request<SupabaseRow[]>(
      `/properties?${params.toString()}`,
    );
    return rows.map(fromRow);
  }

  async getPropertyBySlug(slug: string) {
    const params = new URLSearchParams({
      select: "*,property_images(*)",
      slug: `eq.${slug}`,
      is_active: "eq.true",
      limit: "1",
    });
    const rows = await this.request<SupabaseRow[]>(
      `/properties?${params.toString()}`,
    );
    return rows[0] ? fromRow(rows[0]) : null;
  }

  async getPropertiesByCity(city: string) {
    return this.getProperties({ city });
  }

  async getPropertiesByNeighborhood(neighborhood: string) {
    return this.getProperties({ neighborhood });
  }

  async createProperty(_input: PropertyInput): Promise<Property> {
    void _input;
    throw new Error("Cadastre imóveis pelo painel do Supabase.");
  }

  async updateProperty(
    _id: string,
    _input: Partial<PropertyInput>,
  ): Promise<Property> {
    void _id;
    void _input;
    throw new Error("Edite imóveis pelo painel do Supabase.");
  }

  async archiveProperty(_id: string): Promise<void> {
    void _id;
    throw new Error("Arquive imóveis pelo painel do Supabase.");
  }
}
