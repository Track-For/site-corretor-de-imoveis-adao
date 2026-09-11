import type {
  Property,
  PropertyFilters,
  PropertyInput,
  PropertyType,
  PropertyPurpose,
  PropertyStatus,
} from "@/lib/domain/property";
import type { PropertyRepository } from "./property-repository";

type DbFinalidade = "venda" | "aluguel";
type DbTipoImovel = "apartamento" | "casa" | "comercial" | "terreno" | "rural";
type DbStatus =
  | "rascunho"
  | "disponivel"
  | "reservado"
  | "vendido"
  | "alugado"
  | "inativo";

const PURPOSE_TO_DB: Record<PropertyPurpose, DbFinalidade> = {
  sale: "venda",
  rent: "aluguel",
};
const PURPOSE_FROM_DB: Record<DbFinalidade, PropertyPurpose> = {
  venda: "sale",
  aluguel: "rent",
};

const TYPE_TO_DB: Record<PropertyType, DbTipoImovel> = {
  apartment: "apartamento",
  house: "casa",
  commercial: "comercial",
  land: "terreno",
  rural: "rural",
};
const TYPE_FROM_DB: Record<DbTipoImovel, PropertyType> = {
  apartamento: "apartment",
  casa: "house",
  comercial: "commercial",
  terreno: "land",
  rural: "rural",
};

const STATUS_TO_DB: Record<PropertyStatus, DbStatus> = {
  draft: "rascunho",
  available: "disponivel",
  reserved: "reservado",
  sold: "vendido",
  rented: "alugado",
  inactive: "inativo",
};
const STATUS_FROM_DB: Record<DbStatus, PropertyStatus> = {
  rascunho: "draft",
  disponivel: "available",
  reservado: "reserved",
  vendido: "sold",
  alugado: "rented",
  inativo: "inactive",
};

const PUBLIC_STATUSES: PropertyStatus[] = ["available", "reserved", "sold", "rented"];

interface SupabaseRow {
  id: string;
  slug: string;
  titulo: string;
  descricao: string;
  finalidade: DbFinalidade;
  tipo_imovel: DbTipoImovel;
  status: DbStatus;
  preco: number;
  cidade: string;
  imagem_1?: string | null;
  imagem_2?: string | null;
  imagem_3?: string | null;
  imagem_4?: string | null;
  imagem_5?: string | null;
  video_url?: string | null;
  criado_em: string;
  atualizado_em: string;
}

function fromRow(row: SupabaseRow): Property {
  return {
    id: row.id,
    slug: row.slug,
    title: row.titulo,
    description: row.descricao,
    purpose: PURPOSE_FROM_DB[row.finalidade],
    propertyType: TYPE_FROM_DB[row.tipo_imovel],
    status: STATUS_FROM_DB[row.status],
    price: Number(row.preco),
    city: row.cidade,
    images: [
      row.imagem_1,
      row.imagem_2,
      row.imagem_3,
      row.imagem_4,
      row.imagem_5,
    ].filter(
      (image): image is string =>
        typeof image === "string" && image.trim().length > 0,
    ),
    videoUrl: row.video_url?.trim() ? row.video_url : undefined,
    createdAt: row.criado_em,
    updatedAt: row.atualizado_em,
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
      cache: "no-store",
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
      order: "criado_em.desc",
    });

    if (filters.purpose)
      params.set("finalidade", `eq.${PURPOSE_TO_DB[filters.purpose]}`);
    if (filters.propertyType)
      params.set("tipo_imovel", `eq.${TYPE_TO_DB[filters.propertyType]}`);
    if (filters.city) params.set("cidade", `eq.${filters.city}`);
    if (filters.minPrice) params.set("preco", `gte.${filters.minPrice}`);
    if (filters.maxPrice) params.append("preco", `lte.${filters.maxPrice}`);
    if (filters.status) {
      params.set("status", `eq.${STATUS_TO_DB[filters.status]}`);
    } else {
      params.set(
        "status",
        `in.(${PUBLIC_STATUSES.map((status) => STATUS_TO_DB[status]).join(",")})`,
      );
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
