"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export function AnalyticsEvents() {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = (event.target as HTMLElement).closest<HTMLElement>(
        "[data-track]",
      );
      if (!target) return;

      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: target.dataset.track,
        property_code: target.dataset.propertyCode,
        destination: target.dataset.destination,
      });
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, []);

  return null;
}
