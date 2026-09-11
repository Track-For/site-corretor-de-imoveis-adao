import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight } from "@phosphor-icons/react/dist/ssr";
import type { Property } from "@/lib/domain/property";
import {
  formatCurrency,
  propertyPath,
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
  const validImages = property.images.filter((image) => image.trim().length > 0);
  const primaryImage = validImages[0];
  const hoverImage = validImages[1] || primaryImage;

  return (
    <article className={`property-card ${featured ? "property-card--featured" : ""}`}>
      <Link
        href={propertyPath(property.slug)}
        className="property-card__media"
        data-track="select_property"
      >
        {primaryImage ? (
          <>
            <Image
              src={primaryImage}
              alt={property.title}
              fill
              priority={priority}
              sizes={featured ? "(max-width: 768px) 100vw, 64vw" : "(max-width: 768px) 100vw, 48vw"}
              className="property-card__image property-card__image--primary"
            />
            <Image
              src={hoverImage}
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
        </div>

        <Link href={propertyPath(property.slug)} className="property-card__title">
          <h3>{property.title}</h3>
          <ArrowUpRight size={22} aria-hidden="true" />
        </Link>

        <p className="property-card__location">{property.city}</p>

        <strong className="property-card__price">
          {formatCurrency(property.price, property.purpose)}
        </strong>
      </div>
    </article>
  );
}
