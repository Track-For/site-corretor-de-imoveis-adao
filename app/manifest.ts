import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Adão Corretor de Imóveis",
    short_name: "Adão Imóveis",
    description: "Compra, venda e locação de imóveis com atendimento direto.",
    start_url: "/",
    display: "standalone",
    background_color: "#f4f6f4",
    theme_color: "#174b4b",
  };
}
