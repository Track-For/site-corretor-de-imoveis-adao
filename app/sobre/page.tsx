import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  MapPin,
} from "@phosphor-icons/react/dist/ssr";
import { broker } from "@/lib/config/broker";

export const metadata: Metadata = {
  title: "Sobre Adão",
  description: `Conheça ${broker.legalName}, corretor de imóveis registrado no ${broker.creci}.`,
  alternates: { canonical: "/sobre" },
};

export default function AboutPage() {
  return (
    <main id="conteudo" className="page-main">
      <section className="about-hero">
        <div className="shell about-hero__grid">
          <div className="about-hero__copy">
            <p className="eyebrow">{broker.creci}</p>
            <h1>Conversa direta em cada decisão.</h1>
            <p>
              Adão acompanha compradores, proprietários e locatários com atenção
              às condições reais de cada negociação.
            </p>
          </div>
          <figure className="about-hero__figure">
            <div className="about-hero__image">
              <Image
                src="/images/corretor-placeholder.webp"
                alt="Modelo fictício usado temporariamente no lugar da foto profissional de Adão"
                fill
                priority
                sizes="(max-width: 767px) 100vw, 48vw"
              />
            </div>
            <figcaption>Foto provisória com modelo fictício</figcaption>
          </figure>
        </div>
      </section>

      <section className="section">
        <div className="shell about-story">
          <div>
            <h2>Uma referência direta durante todo o processo</h2>
            <p>
              Em vez de um atendimento fragmentado, você conversa com o corretor
              responsável por entender a demanda, apresentar opções e acompanhar
              os próximos passos.
            </p>
            <p>
              O trabalho inclui imóveis residenciais, comerciais, terrenos e
              propriedades rurais para compra, venda e locação.
            </p>
          </div>
          <div className="about-principles">
            <div>
              <CheckCircle size={24} weight="duotone" aria-hidden="true" />
              <h3>Curadoria útil</h3>
              <p>Opções alinhadas ao que foi conversado, sem excesso de ofertas.</p>
            </div>
            <div>
              <CheckCircle size={24} weight="duotone" aria-hidden="true" />
              <h3>Acompanhamento</h3>
              <p>Contato presente na visita, negociação e encaminhamento documental.</p>
            </div>
            <div>
              <MapPin size={24} weight="duotone" aria-hidden="true" />
              <h3>Base local</h3>
              <p>{broker.serviceArea}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section page-cta">
        <div className="shell">
          <h2>Conte qual decisão você está considerando.</h2>
          <p>Adão ajuda a organizar a busca ou o anúncio do seu imóvel.</p>
          <Link href="/contato" className="button button--primary">
            Entrar em contato
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </section>
    </main>
  );
}
