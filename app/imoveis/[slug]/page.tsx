import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  Bathtub,
  Bed,
  Buildings,
  Car,
  Check,
  MapPin,
  Ruler,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { ContactForm } from "@/components/contact/contact-form";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { broker, siteUrl } from "@/lib/config/broker";
import {
  getProperties,
  getPropertyBySlug,
} from "@/lib/repositories/properties";
import {
  formatCurrency,
  propertyTypeLabels,
  purposeLabels,
  statusLabels,
} from "@/lib/utils/format";
import { buildPropertyWhatsAppUrl } from "@/lib/utils/whatsapp";

export const revalidate = 300;

export async function generateStaticParams() {
  const properties = await getProperties();
  return properties.map((property) => ({ slug: property.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) return { title: "Imóvel não encontrado" };

  const title = `${property.title} em ${property.city}`;
  const description = `${propertyTypeLabels[property.propertyType]} para ${purposeLabels[property.purpose].toLowerCase()} em ${property.city}. ${property.bedrooms ? `${property.bedrooms} quartos, ` : ""}${property.area ? `${property.area} m².` : ""}`;

  return {
    title,
    description,
    alternates: { canonical: `/imoveis/${property.slug}` },
    robots: property.status === "inactive" ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      images: property.images[0]
        ? [{ url: property.images[0].url, alt: property.images[0].alt }]
        : [],
    },
  };
}

export default async function PropertyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);
  if (!property) notFound();

  const allProperties = await getProperties();
  const related = allProperties
    .filter(
      (item) =>
        item.id !== property.id &&
        (item.propertyType === property.propertyType || item.city === property.city),
    )
    .slice(0, 2);

  const typeMap = {
    apartment: "Apartment",
    house: "House",
    commercial: "Place",
    land: "Place",
    rural: "Residence",
  } as const;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": typeMap[property.propertyType],
    name: property.title,
    description: property.description,
    url: `${siteUrl}/imoveis/${property.slug}`,
    image: property.images.map((image) => `${siteUrl}${image.url}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressRegion: property.state,
      addressCountry: "BR",
    },
    floorSize: property.area
      ? { "@type": "QuantitativeValue", value: property.area, unitCode: "MTK" }
      : undefined,
    offers: {
      "@type": "Offer",
      price: property.price,
      priceCurrency: "BRL",
      availability:
        property.status === "available"
          ? "https://schema.org/InStock"
          : "https://schema.org/SoldOut",
      seller: {
        "@type": "RealEstateAgent",
        name: broker.displayName,
        telephone: broker.phonePrimary,
      },
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Início", item: siteUrl },
      {
        "@type": "ListItem",
        position: 2,
        name: "Imóveis",
        item: `${siteUrl}/imoveis`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: property.title,
        item: `${siteUrl}/imoveis/${property.slug}`,
      },
    ],
  };

  return (
    <main id="conteudo" className="property-page">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="shell property-back">
        <Link href="/imoveis">
          <ArrowLeft size={18} aria-hidden="true" />
          Voltar aos imóveis
        </Link>
      </div>

      <div className="shell">
        <PropertyGallery images={property.images} title={property.title} />
      </div>

      <section className="shell property-layout">
        <div className="property-main">
          <div className="property-labels">
            <span>{purposeLabels[property.purpose]}</span>
            <span>{propertyTypeLabels[property.propertyType]}</span>
            <span>{statusLabels[property.status]}</span>
            {property.isDemo && <span>Demonstrativo</span>}
          </div>
          <h1>{property.title}</h1>
          <p className="property-address">
            <MapPin size={19} weight="duotone" aria-hidden="true" />
            {property.approximateAddress}
          </p>
          <strong className="property-price">
            {formatCurrency(property.price, property.purpose)}
          </strong>

          {property.isDemo && (
            <div className="demo-notice">
              Este imóvel, suas fotos e seus valores são demonstrativos. O
              conteúdo será substituído pelos cadastros reais no Supabase.
            </div>
          )}

          <div className="property-specs">
            {property.bedrooms !== undefined && (
              <div><Bed size={24} aria-hidden="true" /><span>Quartos</span><strong>{property.bedrooms}</strong></div>
            )}
            {property.suites !== undefined && (
              <div><Buildings size={24} aria-hidden="true" /><span>Suítes</span><strong>{property.suites}</strong></div>
            )}
            {property.bathrooms !== undefined && (
              <div><Bathtub size={24} aria-hidden="true" /><span>Banheiros</span><strong>{property.bathrooms}</strong></div>
            )}
            {property.parkingSpaces !== undefined && (
              <div><Car size={24} aria-hidden="true" /><span>Vagas</span><strong>{property.parkingSpaces}</strong></div>
            )}
            {property.area !== undefined && (
              <div><Ruler size={24} aria-hidden="true" /><span>Área privativa</span><strong>{property.area} m²</strong></div>
            )}
            {property.builtArea !== undefined && property.builtArea !== property.area && (
              <div><Ruler size={24} aria-hidden="true" /><span>Área construída</span><strong>{property.builtArea} m²</strong></div>
            )}
          </div>

          {(property.condominiumFee !== undefined || property.iptu !== undefined) && (
            <dl className="property-costs">
              {property.condominiumFee !== undefined && (
                <div>
                  <dt>Condomínio</dt>
                  <dd>{formatCurrency(property.condominiumFee)}/mês</dd>
                </div>
              )}
              {property.iptu !== undefined && (
                <div>
                  <dt>IPTU informado</dt>
                  <dd>{formatCurrency(property.iptu)}/ano</dd>
                </div>
              )}
            </dl>
          )}

          <div className="property-copy">
            <h2>Sobre este imóvel</h2>
            <p>{property.description}</p>
          </div>

          {property.amenities.length > 0 && (
            <div className="property-copy">
              <h2>Diferenciais</h2>
              <ul className="amenities-grid">
                {property.amenities.map((amenity) => (
                  <li key={amenity}>
                    <Check size={18} weight="bold" aria-hidden="true" />
                    {amenity}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="location-panel">
            <MapPin size={30} weight="duotone" aria-hidden="true" />
            <div>
              <h2>Localização aproximada</h2>
              <p>
                {property.city}, {property.state}. O endereço completo é
                informado conforme a política de segurança do imóvel.
              </p>
            </div>
          </div>
        </div>

        <aside className="property-contact">
          <p>Fale diretamente com o corretor</p>
          <h2>Tenho interesse neste imóvel</h2>
          <span>{broker.displayName}</span>
          <span>{broker.creci}</span>
          <a
            href={buildPropertyWhatsAppUrl(property)}
            className="button button--primary"
            target="_blank"
            rel="noreferrer"
            data-track="whatsapp_click"
            data-property-code={property.code}
            data-destination="property_detail"
          >
            <WhatsappLogo size={20} weight="bold" aria-hidden="true" />
            Falar sobre este imóvel
          </a>
          <details>
            <summary>Prefiro deixar meus dados</summary>
            <ContactForm propertyId={property.id} />
          </details>
        </aside>
      </section>

      {related.length > 0 && (
        <section className="section related-section" aria-labelledby="related-title">
          <div className="shell">
            <h2 id="related-title">Outras opções para conhecer</h2>
            <div className="property-grid">
              {related.map((item) => (
                <PropertyCard key={item.id} property={item} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
