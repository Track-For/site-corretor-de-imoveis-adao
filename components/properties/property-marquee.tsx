"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef } from "react";
import styles from "./property-marquee.module.css";

export type PropertyMarqueeItem = {
  id: string;
  title: string;
  meta: string;
  href: string;
  imageUrl: string;
  imageAlt: string;
};

function MarqueeRow({
  items,
  rowRef,
}: {
  items: PropertyMarqueeItem[];
  rowRef: React.RefObject<HTMLDivElement | null>;
}) {
  return (
    <div ref={rowRef} className={styles.row}>
      {Array.from({ length: 3 }, (_, repetition) =>
        items.map((item) => (
          <Link
            key={`${repetition}-${item.id}`}
            href={item.href}
            className={styles.card}
            data-track="select_property"
            aria-hidden={repetition === 0 ? undefined : true}
            tabIndex={repetition === 0 ? undefined : -1}
          >
            <Image
              src={item.imageUrl}
              alt={repetition === 0 ? item.imageAlt : ""}
              fill
              sizes="(max-width: 767px) 78vw, (max-width: 1200px) 32vw, 500px"
              className={styles.image}
            />
            <span className={styles.caption}>
              <span>{item.meta}</span>
              <strong>{item.title}</strong>
            </span>
          </Link>
        )),
      )}
    </div>
  );
}

export function PropertyMarquee({ items }: { items: PropertyMarqueeItem[] }) {
  const sectionRef = useRef<HTMLElement>(null);
  const firstRowRef = useRef<HTMLDivElement>(null);
  const secondRowRef = useRef<HTMLDivElement>(null);
  const midpoint = Math.ceil(items.length / 2);
  const firstRow = items.slice(0, midpoint);
  const secondRow = items.slice(midpoint);

  useEffect(() => {
    const section = sectionRef.current;
    const first = firstRowRef.current;
    const second = secondRowRef.current;

    if (!section || !first || !second) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );
    let animationFrame: number | undefined;

    const updateRows = () => {
      animationFrame = undefined;

      if (reducedMotion.matches) {
        first.style.removeProperty("transform");
        second.style.removeProperty("transform");
        return;
      }

      const sectionTop = section.getBoundingClientRect().top + window.scrollY;
      const offset =
        (window.scrollY - sectionTop + window.innerHeight) * 0.3;
      const getSequenceWidth = (
        row: HTMLDivElement,
        sequenceLength: number,
      ) => {
        const firstDuplicate = row.children[sequenceLength] as
          | HTMLElement
          | undefined;
        return firstDuplicate?.offsetLeft ?? row.scrollWidth / 3;
      };
      const firstSequenceWidth = getSequenceWidth(first, firstRow.length);
      const secondSequenceWidth = getSequenceWidth(second, secondRow.length);
      const movement = offset - 200;

      first.style.transform = `translate3d(${
        -firstSequenceWidth + movement
      }px, 0, 0)`;
      second.style.transform = `translate3d(${
        -secondSequenceWidth - movement
      }px, 0, 0)`;
    };

    const requestUpdate = () => {
      if (animationFrame === undefined) {
        animationFrame = window.requestAnimationFrame(updateRows);
      }
    };

    updateRows();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    reducedMotion.addEventListener("change", requestUpdate);

    return () => {
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
      reducedMotion.removeEventListener("change", requestUpdate);
      if (animationFrame !== undefined) {
        window.cancelAnimationFrame(animationFrame);
      }
      first.style.removeProperty("transform");
      second.style.removeProperty("transform");
    };
  }, [firstRow.length, secondRow.length]);

  if (!firstRow.length || !secondRow.length) return null;

  return (
    <section
      ref={sectionRef}
      className={styles.showcase}
      aria-labelledby="moving-showcase-title"
    >
      <div className={`shell ${styles.heading}`}>
        <div className={styles.headingCopy}>
          <p className="eyebrow">Vitrine em movimento</p>
          <h2 id="moving-showcase-title">Explore cada espaço por um novo ângulo</h2>
          <p>
            Duas faixas apresentam os imóveis em sentidos opostos enquanto você
            percorre a página
          </p>
        </div>
        <p className={styles.directionNote} aria-hidden="true">
          Role para explorar ↕
        </p>
      </div>

      <div className={styles.viewport}>
        <MarqueeRow items={firstRow} rowRef={firstRowRef} />
        <MarqueeRow items={secondRow} rowRef={secondRowRef} />
      </div>
    </section>
  );
}
