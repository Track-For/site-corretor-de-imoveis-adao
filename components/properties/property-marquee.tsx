"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";
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
      {items.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={styles.card}
          data-track="select_property"
        >
          <Image
            src={item.imageUrl}
            alt={item.imageAlt}
            fill
            sizes="(max-width: 767px) 78vw, (max-width: 1200px) 32vw, 500px"
            className={styles.image}
          />
          <span className={styles.caption}>
            <span>{item.meta}</span>
            <strong>{item.title}</strong>
          </span>
        </Link>
      ))}
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

  useGSAP(
    () => {
      const section = sectionRef.current;
      const first = firstRowRef.current;
      const second = secondRowRef.current;

      if (!section || !first || !second) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const travel = (row: HTMLDivElement) =>
          Math.max(0, row.scrollWidth - section.clientWidth);

        const scrollTrigger = {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: 0.5,
          invalidateOnRefresh: true,
        };

        gsap.fromTo(
          first,
          { x: () => -travel(first), force3D: true },
          {
            x: 0,
            ease: "none",
            force3D: true,
            scrollTrigger: {
              ...scrollTrigger,
              onEnter: () => gsap.set(first, { willChange: "transform" }),
              onLeave: () => gsap.set(first, { willChange: "auto" }),
              onEnterBack: () => gsap.set(first, { willChange: "transform" }),
              onLeaveBack: () => gsap.set(first, { willChange: "auto" }),
            },
          },
        );

        gsap.fromTo(
          second,
          { x: 0, force3D: true },
          {
            x: () => -travel(second),
            ease: "none",
            force3D: true,
            scrollTrigger: {
              ...scrollTrigger,
              onEnter: () => gsap.set(second, { willChange: "transform" }),
              onLeave: () => gsap.set(second, { willChange: "auto" }),
              onEnterBack: () => gsap.set(second, { willChange: "transform" }),
              onLeaveBack: () => gsap.set(second, { willChange: "auto" }),
            },
          },
        );
      });

      return () => media.revert();
    },
    { scope: sectionRef, dependencies: [items.length] },
  );

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
