import type { Metadata } from "next";
import { Barlow_Condensed, Manrope } from "next/font/google";
import { AnalyticsEvents } from "@/components/analytics/analytics-events";
import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { WhatsAppFab } from "@/components/layout/whatsapp-fab";
import { broker, siteUrl } from "@/lib/config/broker";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${broker.displayName} | ${broker.creci}`,
    template: `%s | ${broker.displayName}`,
  },
  description:
    "Compra, venda e locação de imóveis com atendimento direto do corretor em Aparecida de Goiânia e região sob consulta.",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "pt_BR",
    siteName: broker.displayName,
    title: `${broker.displayName} | ${broker.creci}`,
    description:
      "Atendimento imobiliário direto para comprar, vender ou alugar.",
    images: [
      {
        url: "/images/hero-casa-conceitual.webp",
        width: 1536,
        height: 1024,
        alt: "Casa contemporânea usada como imagem conceitual",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: broker.displayName,
    description: "Atendimento imobiliário direto e personalizado.",
    images: ["/images/hero-casa-conceitual.webp"],
  },
  icons: {
    icon: "/images/Logo_Adão-removebg-preview.png",
    apple: "/images/Logo_Adão-removebg-preview.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-scroll-behavior="smooth">
      <body className={`${manrope.variable} ${barlowCondensed.variable}`}>
        <a href="#conteudo" className="skip-link">
          Ir para o conteúdo
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <WhatsAppFab />
        <AnalyticsEvents />
      </body>
    </html>
  );
}
