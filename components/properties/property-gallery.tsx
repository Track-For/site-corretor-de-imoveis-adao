"use client";

import Image from "next/image";
import { ArrowsOut, X } from "@phosphor-icons/react";
import { useEffect, useState } from "react";

export function PropertyGallery({
  images,
  title,
}: {
  images: string[];
  title: string;
}) {
  const [open, setOpen] = useState(false);
  const validImages = images.filter((image) => image.trim().length > 0);

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

  if (!validImages.length) {
    return <div className="gallery-empty">Fotos indisponíveis</div>;
  }

  return (
    <>
      <div className="property-gallery">
        <div className="property-gallery__track">
          {validImages.slice(0, 3).map((image, index) => (
            <button
              type="button"
              key={image}
              className={index === 0 ? "property-gallery__main" : "property-gallery__side"}
              onClick={() => setOpen(true)}
              aria-label={`Ampliar foto ${index + 1} de ${title}`}
            >
              <Image
                src={image}
                alt={`Foto ${index + 1} de ${title}`}
                fill
                priority={index === 0}
                sizes={index === 0 ? "(max-width: 767px) 88vw, 66vw" : "(max-width: 767px) 88vw, 34vw"}
              />
            </button>
          ))}
        </div>
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
            {validImages.map((image, index) => (
              <div className="gallery-modal__image" key={image}>
                <Image
                  src={image}
                  alt={`Foto ${index + 1} de ${title}`}
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
