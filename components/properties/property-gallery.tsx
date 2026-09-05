"use client";

import Image from "next/image";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { PropertyImage } from "@/lib/domain/property";

export function PropertyGallery({
  images,
  title,
}: {
  images: PropertyImage[];
  title: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.body.classList.add("modal-open");
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.classList.remove("modal-open");
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  if (!images.length) {
    return <div className="gallery-empty">Fotos indisponíveis</div>;
  }

  return (
    <>
      <div className="property-gallery">
        {images.slice(0, 3).map((image, index) => (
          <button
            type="button"
            key={image.id}
            className={index === 0 ? "property-gallery__main" : "property-gallery__side"}
            onClick={() => setOpen(true)}
            aria-label={`Ampliar foto ${index + 1} de ${title}`}
          >
            <Image
              src={image.url}
              alt={image.alt}
              fill
              priority={index === 0}
              sizes={index === 0 ? "(max-width: 767px) 100vw, 66vw" : "34vw"}
            />
          </button>
        ))}
        <button
          type="button"
          className="gallery-open"
          onClick={() => setOpen(true)}
        >
          <ArrowsOut size={18} weight="bold" aria-hidden="true" />
          Ver todas as fotos
        </button>
      </div>

      {open && (
        <div className="gallery-modal" role="dialog" aria-modal="true" aria-label={`Galeria de ${title}`}>
          <button
            type="button"
            className="gallery-modal__close"
            onClick={() => setOpen(false)}
            aria-label="Fechar galeria"
            autoFocus
          >
            <X size={24} />
          </button>
          <div className="gallery-modal__track">
            {images.map((image) => (
              <div className="gallery-modal__image" key={image.id}>
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="100vw"
                />
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
