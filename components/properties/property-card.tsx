import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bathtub,
  Bed,
  Car,
  Ruler,
} from "@phosphor-icons/react/dist/ssr";
import type { Property } from "@/lib/domain/property";
import {
  formatCurrency,
  propertyTypeLabels,
  purposeLabels,
  statusLabels,
} from "@/lib/utils/format";

export function PropertyCard({
  property,
  priority = false,
  featured = false,
}: {
  property: Property;
  priority?: boolean;
  featured?: boolean;
}) {
  const primaryImage = property.images[0];
  const hoverImage = property.images[1] || primaryImage;

  return (
    <article className={`property-card ${featured ? "property-card--featured" : ""}`}>
      <Link
        href={`/imoveis/${property.slug}`}
        className="property-card__media"
        data-track="select_property"
        data-property-code={property.code}
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage.url}
              alt={primaryImage.alt}
              fill
              priority={priority}
              sizes={featured ? "(max-width: 768px) 100vw, 64vw" : "(max-width: 768px) 100vw, 48vw"}
              className="property-card__image property-card__image--primary"
            />
            <Image
              src={hoverImage.url}
              alt=""
              fill
              sizes={featured ? "(max-width: 768px) 100vw, 64vw" : "(max-width: 768px) 100vw, 48vw"}
              className="property-card__image property-card__image--hover"
              aria-hidden="true"
            />
          </>
        ) : (
          <div className="property-card__placeholder">Imagem indisponível</div>
        )}
      </Link>

      <div className="property-card__content">
        <div className="property-card__meta">
          <span>{purposeLabels[property.purpose]}</span>
          <span>{propertyTypeLabels[property.propertyType]}</span>
          <span>{statusLabels[property.status]}</span>
          {property.isDemo && <span>Demonstrativo</span>}
        </div>

        <Link href={`/imoveis/${property.slug}`} className="property-card__title">
          <h3>{property.title}</h3>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>

        <p className="property-card__location">
          {property.neighborhood && `${property.neighborhood}, `}
          {property.city}
        </p>

        <strong className="property-card__price">
          {formatCurrency(property.price, property.purpose)}
        </strong>

        <div className="property-card__features" aria-label="Características">
          {property.bedrooms !== undefined && (
            <span title="Quartos">
              <Bed size={18} aria-hidden="true" />
              {property.bedrooms} quartos
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span title="Banheiros">
              <Bathtub size={18} aria-hidden="true" />
              {property.bathrooms} banheiros
            </span>
          )}
          {property.parkingSpaces !== undefined && (
            <span title="Vagas">
              <Car size={18} aria-hidden="true" />
              {property.parkingSpaces} vagas
            </span>
          )}
          {property.area !== undefined && (
            <span title="Área">
              <Ruler size={18} aria-hidden="true" />
              {property.area} m²
            </span>
          )}
        </div>
      </div>
    </article>
  );
}
