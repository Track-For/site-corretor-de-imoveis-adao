import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/config/broker";
import { getProperties } from "@/lib/repositories/properties";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const properties = await getProperties();
  const publicPages = ["", "/imoveis", "/sobre", "/servicos", "/contato"];

  return [
    ...publicPages.map((path) => ({
      url: `${siteUrl}${path}`,
      lastModified: new Date(),
      changeFrequency:
        path === "/imoveis" ? ("daily" as const) : ("monthly" as const),
      priority: path === "" ? 1 : path === "/imoveis" ? 0.9 : 0.7,
    })),
    ...properties
      .filter((property) => !["draft", "inactive"].includes(property.status))
      .map((property) => ({
        url: `${siteUrl}/imoveis/${property.slug}`,
        lastModified: new Date(property.updatedAt),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })),
  ];
}
