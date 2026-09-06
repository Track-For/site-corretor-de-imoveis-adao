"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

export function HomeExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const root = rootRef.current;
      if (!root) return;

      const media = gsap.matchMedia();

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.9, ease: "power3.out" },
        });

        heroTimeline
          .fromTo(
            ".hero__media img",
            { scale: 1.12 },
            { scale: 1.04, duration: 1.8, ease: "power2.out" },
          )
          .from(
            ".hero__eyebrow, .hero__title-line, .hero__description",
            {
              y: 34,
              autoAlpha: 0,
              stagger: 0.09,
              duration: 0.85,
            },
            "-=1.25",
          )
          .from(
            ".hero__actions > *, .hero__trust > *",
            { y: 18, autoAlpha: 0, stagger: 0.07, duration: 0.65 },
            "-=0.48",
          )
          .from(
            ".hero__aside, .hero__scroll",
            { autoAlpha: 0, duration: 0.7 },
            "-=0.55",
          );

        gsap.to(".hero__media img", {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom top",
            scrub: 0.8,
          },
        });

        gsap.to(".hero__copy", {
          yPercent: -10,
          autoAlpha: 0.45,
          ease: "none",
          scrollTrigger: {
            trigger: ".hero",
            start: "top top",
            end: "bottom 20%",
            scrub: 0.7,
          },
        });

        gsap.utils
          .toArray<HTMLElement>("[data-scroll-reveal]")
          .forEach((element) => {
            gsap.from(element, {
              y: 38,
              autoAlpha: 0,
              duration: 0.9,
              ease: "power3.out",
              scrollTrigger: {
                trigger: element,
                start: "top 86%",
                once: true,
              },
            });
          });

        gsap.utils
          .toArray<HTMLElement>("[data-parallax-media]:not(.hero__media)")
          .forEach((element) => {
            const image = element.querySelector("img");
            if (!image) return;

            gsap.fromTo(
              image,
              { yPercent: -6, scale: 1.08 },
              {
                yPercent: 6,
                scale: 1.08,
                ease: "none",
                scrollTrigger: {
                  trigger: element,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 0.8,
                },
              },
            );
          });

        gsap.utils
          .toArray<HTMLElement>("[data-draw-line]")
          .forEach((element) => {
            gsap.fromTo(
              element,
              { scaleX: 0, transformOrigin: "left center" },
              {
                scaleX: 1,
                duration: 1.1,
                ease: "power3.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 88%",
                  once: true,
                },
              },
            );
          });
      });

      media.add("(prefers-reduced-motion: reduce)", () => {
        gsap.set(
          ".hero__media img, .hero__copy, [data-scroll-reveal], [data-parallax-media] img, [data-draw-line]",
          { clearProps: "all" },
        );
      });

      return () => media.revert();
    },
    { scope: rootRef },
  );

  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    document.fonts.ready.then(refresh);
    window.addEventListener("load", refresh, { once: true });

    return () => window.removeEventListener("load", refresh);
  }, []);

  return (
    <div ref={rootRef} className="home-experience">
      {children}
    </div>
  );
}
