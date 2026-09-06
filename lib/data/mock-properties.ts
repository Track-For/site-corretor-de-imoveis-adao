import type { Property } from "@/lib/domain/property";

const createdAt = "2026-08-18T12:00:00.000Z";
const updatedAt = "2026-09-02T12:00:00.000Z";

export const mockProperties: Property[] = [
  {
    id: "demo-apto-01",
    slug: "apartamento-contemporaneo-a-venda",
    title: "Apartamento contemporâneo à venda",
    description:
      "Planta ampla, integração entre sala e varanda e acabamentos atuais. Conteúdo criado apenas para demonstrar o catálogo enquanto os imóveis reais não são cadastrados.",
    purpose: "sale",
    propertyType: "apartment",
    status: "available",
    price: 985000,
    city: "Goiânia",
    images: [
      "/images/apartamento-interior-conceitual.webp",
      "/images/edificio-conceitual.webp",
      "/images/hero-casa-conceitual.webp",
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "demo-casa-02",
    slug: "casa-terrea-com-piscina-a-venda",
    title: "Casa térrea com piscina à venda",
    description:
      "Casa de convivência fluida, com varanda generosa, jardim e lazer integrado. Dados e valores ilustrativos para validação do layout.",
    purpose: "sale",
    propertyType: "house",
    status: "available",
    price: 1285000,
    city: "Aparecida de Goiânia",
    images: [
      "/images/casa-piscina-conceitual.webp",
      "/images/hero-casa-conceitual.webp",
      "/images/apartamento-interior-conceitual.webp",
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "demo-apto-03",
    slug: "apartamento-mobiliado-para-alugar",
    title: "Apartamento mobiliado para alugar",
    description:
      "Uma opção demonstrativa para o catálogo de locação, com ambientes integrados e mobiliário contemporâneo.",
    purpose: "rent",
    propertyType: "apartment",
    status: "available",
    price: 4600,
    city: "Goiânia",
    images: [
      "/images/edificio-conceitual.webp",
      "/images/apartamento-interior-conceitual.webp",
    ],
    createdAt,
    updatedAt,
  },
  {
    id: "demo-comercial-04",
    slug: "espaco-comercial-a-venda",
    title: "Espaço comercial à venda",
    description:
      "Exemplo de cadastro comercial para demonstrar a separação do catálogo por tipo e finalidade.",
    purpose: "sale",
    propertyType: "commercial",
    status: "available",
    price: 545000,
    city: "Aparecida de Goiânia",
    images: [
      "/images/edificio-conceitual.webp",
      "/images/hero-casa-conceitual.webp",
    ],
    createdAt,
    updatedAt,
  },
];
