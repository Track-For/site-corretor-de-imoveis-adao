import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "@phosphor-icons/react/dist/ssr";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { getProperties } from "@/lib/repositories/properties";
import { parsePropertyFilters } from "@/lib/utils/filters";
import { propertyTypeLabels, purposeLabels } from "@/lib/utils/format";
import type { PropertyType } from "@/lib/domain/property";

type SearchParams = Record<string, string | string[] | undefined>;

export const revalidate = 300;

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const params = await searchParams;
  const hasFilters = Object.values(params).some(Boolean);

  return {
    title: "Imóveis para comprar ou alugar",
    description:
      "Consulte imóveis para compra e locação com atendimento direto de Adão, corretor registrado no CRECI-GO 8627.",
    alternates: { canonical: "/imoveis" },
    robots: hasFilters ? { index: false, follow: true } : undefined,
  };
}

export default async function PropertiesPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const rawParams = await searchParams;
  const filters = parsePropertyFilters(rawParams);
  const [properties, allProperties] = await Promise.all([
    getProperties(filters),
    getProperties(),
  ]);
  const cities = [...new Set(allProperties.map((property) => property.city))];
  const titleParts = [
    filters.purpose ? purposeLabels[filters.purpose] : "Imóveis",
    filters.propertyType ? propertyTypeLabels[filters.propertyType] : undefined,
    filters.city ? `em ${filters.city}` : undefined,
  ].filter(Boolean);
  const catalogTypes: PropertyType[] = [
    "apartment",
    "house",
    "commercial",
    "land",
    "rural",
  ];

  return (
    <main id="conteudo" className="page-main">
      <section className="page-hero page-hero--catalog">
        <div className="shell">
          <p className="eyebrow">Catálogo conectado à camada de dados</p>
          <h1>{titleParts.join(" ")}</h1>
          <p>
            Refine sua busca. Os filtros ficam na URL para você compartilhar ou
            retomar quando quiser.
          </p>
        </div>
      </section>

      <section className="catalog-section">
        <div className="shell">
          <nav className="catalog-tabs" aria-label="Atalhos do catálogo">
            <Link href="/imoveis" className={!filters.purpose ? "is-active" : ""}>
              Todos
            </Link>
            <Link
              href="/imoveis?finalidade=sale"
              className={filters.purpose === "sale" ? "is-active" : ""}
            >
              Comprar
            </Link>
            <Link
              href="/imoveis?finalidade=rent"
              className={filters.purpose === "rent" ? "is-active" : ""}
            >
              Alugar
            </Link>
          </nav>

          <nav className="catalog-type-links" aria-label="Catálogos por tipo">
            {catalogTypes.map((type) => {
              const query = new URLSearchParams();
              if (filters.purpose) query.set("finalidade", filters.purpose);
              query.set("tipo", type);
              return (
                <Link
                  key={type}
                  href={`/imoveis?${query.toString()}`}
                  className={filters.propertyType === type ? "is-active" : ""}
                >
                  {propertyTypeLabels[type]}
                </Link>
              );
            })}
          </nav>

          <details className="filters-panel" open>
            <summary>Filtros da busca</summary>
            <PropertyFilters filters={filters} cities={cities} />
          </details>

          <div className="catalog-result-heading">
            <h2>
              {properties.length} {properties.length === 1 ? "imóvel" : "imóveis"}
            </h2>
          </div>

          {properties.length ? (
            <div className="property-grid">
              {properties.map((property, index) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                  priority={index < 2}
                />
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state--large">
              <h2>Nenhum imóvel corresponde aos filtros</h2>
              <p>Tente ampliar a faixa de preço, cidade ou quantidade de quartos.</p>
              <Link href="/imoveis" className="button button--primary">
                Limpar busca
                <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
