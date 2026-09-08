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
      const hero = root.querySelector<HTMLElement>(".hero");
      const heroMedia = root.querySelector<HTMLElement>(".hero__media");
      const heroVideo = root.querySelector<HTMLVideoElement>(".hero__video");

      const markVideoReady = () => heroMedia?.classList.add("is-video-ready");

      if (heroVideo?.readyState && heroVideo.readyState >= 2) {
        markVideoReady();
      } else {
        heroVideo?.addEventListener("canplay", markVideoReady, { once: true });
      }

      const setupVideoScrub = (scrollDistance: number, scrub: number) => {
        if (!hero || !heroVideo) return;

        let scrollTimeline: gsap.core.Timeline | undefined;
        let seekFrame: number | undefined;
        let targetTime = 0;
        const playhead = { time: 0 };
        const frameStep = 1 / 30;

        const commitSeek = () => {
          seekFrame = undefined;

          if (
            heroVideo.seeking ||
            Math.abs(heroVideo.currentTime - targetTime) < frameStep
          ) {
            return;
          }

          heroVideo.currentTime = targetTime;
        };

        const queueSeek = () => {
          if (seekFrame === undefined) {
            seekFrame = window.requestAnimationFrame(commitSeek);
          }
        };

        const onSeeked = () => queueSeek();
        heroVideo.addEventListener("seeked", onSeeked);

        const createTimeline = () => {
          if (
            scrollTimeline ||
            !Number.isFinite(heroVideo.duration) ||
            heroVideo.duration <= 0
          ) {
            return;
          }

          heroVideo.pause();
          heroVideo.currentTime = 0;

          scrollTimeline = gsap.timeline({
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: () =>
                `+=${Math.round(window.innerHeight * scrollDistance)}`,
              pin: true,
              scrub,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onScrubComplete: queueSeek,
            },
          });

          scrollTimeline
            .to(
              playhead,
              {
                time: Math.max(0, heroVideo.duration - 0.08),
                duration: 1,
                ease: "none",
                onUpdate: () => {
                  targetTime = playhead.time;
                  queueSeek();
                },
              },
              0,
            )
            .to(
              ".hero__aside",
              { autoAlpha: 0, duration: 0.12, ease: "none" },
              0.08,
            )
            .to(
              ".hero__copy",
              { yPercent: -8, autoAlpha: 0, duration: 0.16, ease: "none" },
              0.14,
            )
            .fromTo(
              ".hero__chapter--curation",
              { y: 48, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.14, ease: "none" },
              0.27,
            )
            .to(
              ".hero__chapter--curation",
              { y: -32, autoAlpha: 0, duration: 0.12, ease: "none" },
              0.51,
            )
            .fromTo(
              ".hero__chapter--confidence",
              { y: 48, autoAlpha: 0 },
              { y: 0, autoAlpha: 1, duration: 0.14, ease: "none" },
              0.61,
            )
            .to(
              ".hero__shade",
              { opacity: 0.9, duration: 0.35, ease: "none" },
              0.3,
            );

          ScrollTrigger.refresh();
        };

        if (heroVideo.readyState >= 1) {
          createTimeline();
        } else {
          heroVideo.addEventListener("loadedmetadata", createTimeline, {
            once: true,
          });
        }

        return () => {
          heroVideo.removeEventListener("loadedmetadata", createTimeline);
          heroVideo.removeEventListener("seeked", onSeeked);
          if (seekFrame !== undefined) {
            window.cancelAnimationFrame(seekFrame);
          }
          scrollTimeline?.scrollTrigger?.kill();
          scrollTimeline?.kill();
        };
      };

      media.add("(prefers-reduced-motion: no-preference)", () => {
        const heroTimeline = gsap.timeline({
          defaults: { duration: 0.9, ease: "power3.out" },
        });

        heroTimeline
          .fromTo(
            ".hero__media",
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
            ".hero__actions > *",
            { y: 18, autoAlpha: 0, stagger: 0.07, duration: 0.65 },
            "-=0.48",
          )
          .from(
            ".hero__aside",
            { autoAlpha: 0, duration: 0.7 },
            "-=0.55",
          );

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

      media.add(
        "(min-width: 768px) and (prefers-reduced-motion: no-preference)",
        () => setupVideoScrub(2.2, 0.85),
      );

      media.add(
        "(max-width: 767px) and (prefers-reduced-motion: no-preference)",
        () => setupVideoScrub(1.45, 0.65),
      );

      media.add("(prefers-reduced-motion: reduce)", () => {
        heroVideo?.pause();
        if (heroVideo) heroVideo.currentTime = 0;
        gsap.set(
          ".hero__media, .hero__copy, [data-scroll-reveal], [data-parallax-media] img, [data-draw-line]",
          { clearProps: "all" },
        );
        gsap.set(".hero__chapter", { clearProps: "all" });
      });

      return () => {
        heroVideo?.removeEventListener("canplay", markVideoReady);
        media.revert();
      };
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
