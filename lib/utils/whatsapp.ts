import { broker } from "@/lib/config/broker";
import type { Property } from "@/lib/domain/property";

export function buildWhatsAppUrl(message: string) {
  return `https://wa.me/${broker.whatsappPrimary}?text=${encodeURIComponent(message)}`;
}

export function buildPropertyWhatsAppUrl(property: Property) {
  return buildWhatsAppUrl(
    `Olá, tenho interesse no imóvel ${property.title}, código ${property.code}. Gostaria de receber mais informações.`,
  );
}

export function buildGeneralWhatsAppUrl() {
  return buildWhatsAppUrl(
    "Olá, Adão. Gostaria de conversar sobre um imóvel.",
  );
}
