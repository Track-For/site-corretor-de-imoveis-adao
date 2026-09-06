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
      {
        id: "demo-apto-01-1",
        propertyId: "demo-apto-01",
        url: "/images/apartamento-interior-conceitual.webp",
        alt: "Sala de apartamento contemporâneo usada como imagem demonstrativa",
        order: 1,
      },
      {
        id: "demo-apto-01-2",
        propertyId: "demo-apto-01",
        url: "/images/edificio-conceitual.webp",
        alt: "Fachada de edifício residencial usada como imagem demonstrativa",
        order: 2,
      },
      {
        id: "demo-apto-01-3",
        propertyId: "demo-apto-01",
        url: "/images/hero-casa-conceitual.webp",
        alt: "Arquitetura residencial usada como imagem demonstrativa",
        order: 3,
      },
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
      {
        id: "demo-casa-02-1",
        propertyId: "demo-casa-02",
        url: "/images/casa-piscina-conceitual.webp",
        alt: "Área de lazer de casa térrea usada como imagem demonstrativa",
        order: 1,
      },
      {
        id: "demo-casa-02-2",
        propertyId: "demo-casa-02",
        url: "/images/hero-casa-conceitual.webp",
        alt: "Fachada de casa contemporânea usada como imagem demonstrativa",
        order: 2,
      },
      {
        id: "demo-casa-02-3",
        propertyId: "demo-casa-02",
        url: "/images/apartamento-interior-conceitual.webp",
        alt: "Interior residencial usado como imagem demonstrativa",
        order: 3,
      },
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
      {
        id: "demo-apto-03-1",
        propertyId: "demo-apto-03",
        url: "/images/edificio-conceitual.webp",
        alt: "Edifício residencial usado como imagem demonstrativa",
        order: 1,
      },
      {
        id: "demo-apto-03-2",
        propertyId: "demo-apto-03",
        url: "/images/apartamento-interior-conceitual.webp",
        alt: "Sala mobiliada usada como imagem demonstrativa",
        order: 2,
      },
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
      {
        id: "demo-comercial-04-1",
        propertyId: "demo-comercial-04",
        url: "/images/edificio-conceitual.webp",
        alt: "Edifício usado como imagem demonstrativa de imóvel comercial",
        order: 1,
      },
      {
        id: "demo-comercial-04-2",
        propertyId: "demo-comercial-04",
        url: "/images/hero-casa-conceitual.webp",
        alt: "Arquitetura contemporânea usada como imagem demonstrativa",
        order: 2,
      },
    ],
    createdAt,
    updatedAt,
  },
];
