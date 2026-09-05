import type {
  PropertyPurpose,
  PropertyStatus,
  PropertyType,
} from "@/lib/domain/property";

export const purposeLabels: Record<PropertyPurpose, string> = {
  sale: "Comprar",
  rent: "Alugar",
};

export const propertyTypeLabels: Record<PropertyType, string> = {
  apartment: "Apartamento",
  house: "Casa",
  commercial: "Comercial",
  land: "Terreno",
  rural: "Rural",
};

export const statusLabels: Record<PropertyStatus, string> = {
  draft: "Rascunho",
  available: "Disponível",
  reserved: "Reservado",
  sold: "Vendido",
  rented: "Alugado",
  inactive: "Inativo",
};

export function formatCurrency(value: number, purpose?: PropertyPurpose) {
  const currency = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(value);

  return purpose === "rent" ? `${currency}/mês` : currency;
}
