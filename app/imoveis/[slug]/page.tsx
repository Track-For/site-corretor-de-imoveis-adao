import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, MapPin, WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyGallery } from "@/components/properties/property-gallery";
import { PropertyVideo } from "@/components/properties/property-video";
import { broker, siteUrl } from "@/lib/config/broker";
import {
  getProperties,
  getPropertyBySlug,
} from "@/lib/repositories/properties";
import {
  formatCurrency,
  propertyPath,
  propertyTypeLabels,
  purposeLabels,
  statusLabels,
} from "@/lib/utils/format";
import { buildPropertyWhatsAppUrl } from "@/lib/utils/whatsapp";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(decodeURIComponent(slug));
  if (!property) return { title: "Imóvel não encontrado" };

  const title = `${property.title} em ${property.city}`;
  const description = `${propertyTypeLabels[property.propertyType]} para ${purposeLabels[property.purpose].toLowerCase()} em ${property.city}.`;

  return {
    title,
    description,
    alternates: { canonical: propertyPath(property.slug) },
    robots: property.status === "inactive" ? { index: false, follow: true } : undefined,
    openGraph: {
      type: "website",
      title,
      description,
      images: property.images[0]
        ? [{ url: property.images[0], alt: property.title }]
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
  const property = await getPropertyBySlug(decodeURIComponent(slug));
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
    url: `${siteUrl}${propertyPath(property.slug)}`,
    image: property.images.map((image) => `${siteUrl}${image}`),
    address: {
      "@type": "PostalAddress",
      addressLocality: property.city,
      addressCountry: "BR",
    },
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
        item: `${siteUrl}${propertyPath(property.slug)}`,
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
          </div>
          <h1>{property.title}</h1>
          <p className="property-address">
            <MapPin size={19} weight="duotone" aria-hidden="true" />
            {property.city}
          </p>
          <strong className="property-price">
            {formatCurrency(property.price, property.purpose)}
          </strong>

          <div className="property-copy">
            <h2>Sobre este imóvel</h2>
            <p>{property.description}</p>
          </div>

          {property.videoUrl && (
            <PropertyVideo videoUrl={property.videoUrl} title={property.title} />
          )}
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
            data-destination="property_detail"
          >
            <WhatsappLogo size={20} weight="bold" aria-hidden="true" />
            Falar sobre este imóvel
          </a>
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
