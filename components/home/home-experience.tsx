"use client";

import { useEffect, useRef, type ReactNode } from "react";

export function HomeExperience({ children }: { children: ReactNode }) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const video = rootRef.current?.querySelector<HTMLVideoElement>(".hero__video");
    const media = video?.closest(".hero__media");
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    let visible = true;
    const sync = () => {
      if (preference.matches || document.hidden || !visible) {
        video.pause();
      } else {
        void video.play().catch(() => { /* The poster remains visible if autoplay is unavailable. */ });
      }
    };
    const showVideo = () => media?.classList.add("is-video-ready");
    video.addEventListener("playing", showVideo);
    preference.addEventListener("change", sync);
    document.addEventListener("visibilitychange", sync);
    const observer = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      sync();
    });
    observer.observe(video);
    sync();
    return () => {
      observer.disconnect();
      video.pause();
      video.removeEventListener("playing", showVideo);
      preference.removeEventListener("change", sync);
      document.removeEventListener("visibilitychange", sync);
    };
  }, []);

  return <div ref={rootRef} className="home-experience">{children}</div>;
}
