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
  slug: string;
  title: string;
  description: string;
  purpose: PropertyPurpose;
  property_type: PropertyType;
  status: PropertyStatus;
  price: number;
  city: string;
  images?: Array<string | null>;
  created_at: string;
  updated_at: string;
}

function fromRow(row: SupabaseRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    description: row.description,
    purpose: row.purpose,
    propertyType: row.property_type,
    status: row.status,
    price: Number(row.price),
    city: row.city,
    images: (row.images || []).filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    ),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export class SupabasePropertyRepository implements PropertyRepository {
  private readonly baseUrl: string;
  private readonly publicKey: string;

  constructor() {
    const url = process.env.SUPABASE_URL;
    const publicKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!url || !publicKey) {
      throw new Error(
        "Configure SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.",
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
      signal: AbortSignal.timeout(10000),
    });

    if (!response.ok) {
      throw new Error(`Falha ao consultar imóveis: ${response.status}`);
    }

    if (response.status === 204) return undefined as T;
    return response.json() as Promise<T>;
  }

  async getProperties(filters: PropertyFilters = {}) {
    const params = new URLSearchParams({
      select: "*",
      order: "created_at.desc",
    });

    if (filters.purpose) params.set("purpose", `eq.${filters.purpose}`);
    if (filters.propertyType)
      params.set("property_type", `eq.${filters.propertyType}`);
    if (filters.city) params.set("city", `eq.${filters.city}`);
    if (filters.minPrice) params.set("price", `gte.${filters.minPrice}`);
    if (filters.maxPrice) params.append("price", `lte.${filters.maxPrice}`);
    if (filters.status) {
      params.set("status", `eq.${filters.status}`);
    } else {
      params.set("status", "in.(available,reserved,sold,rented)");
    }

    const rows = await this.request<SupabaseRow[]>(
      `/properties?${params.toString()}`,
    );
    return rows.map(fromRow);
  }

  async getFeaturedProperties(limit = 3) {
    const properties = await this.getProperties();
    return properties.slice(0, limit);
  }

  async getPropertyBySlug(slug: string) {
    const params = new URLSearchParams({
      select: "*",
      slug: `eq.${slug}`,
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
