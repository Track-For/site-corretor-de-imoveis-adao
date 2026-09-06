import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  Handshake,
  HouseLine,
  Key,
  MapTrifold,
} from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Serviços imobiliários",
  description:
    "Compra, venda e locação de casas, apartamentos, terrenos, imóveis rurais e comerciais com atendimento direto.",
  alternates: { canonical: "/servicos" },
};

const services = [
  {
    icon: Key,
    title: "Compra de imóveis",
    description:
      "Definição de prioridades, seleção de opções, organização de visitas e apoio na negociação",
    href: "/imoveis?finalidade=sale",
    link: "Ver imóveis à venda",
  },
  {
    icon: Handshake,
    title: "Venda de imóveis",
    description:
      "Leitura comercial, preparação do cadastro, apresentação e acompanhamento dos interessados",
    href: "/contato?assunto=venda",
    link: "Quero anunciar",
  },
  {
    icon: HouseLine,
    title: "Locação",
    description:
      "Busca e divulgação de imóveis residenciais ou comerciais para aluguel",
    href: "/imoveis?finalidade=rent",
    link: "Ver imóveis para alugar",
  },
  {
    icon: Buildings,
    title: "Catálogos por tipo",
    description:
      "Apartamentos, casas, espaços comerciais, terrenos e imóveis rurais em jornadas separadas",
    href: "/imoveis",
    link: "Explorar o catálogo",
  },
  {
    icon: MapTrifold,
    title: "Atendimento regional",
    description:
      "A base fica em Aparecida de Goiânia. Demais regiões são avaliadas conforme a demanda",
    href: "/contato",
    link: "Consultar atendimento",
  },
];

export default function ServicesPage() {
  return (
    <main id="conteudo" className="page-main">
      <section className="page-hero">
        <div className="shell">
          <p className="eyebrow">Serviços</p>
          <h1>Seu objetivo, bem acompanhado</h1>
          <p>
            Atendimento para comprar, vender ou alugar diferentes tipos de imóvel
          </p>
        </div>
      </section>

      <section className="section service-page-list">
        <div className="shell">
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <article key={service.title}>
                <Icon size={30} weight="duotone" aria-hidden="true" />
                <div>
                  <h2>{service.title}</h2>
                  <p>{service.description}</p>
                </div>
                <Link href={service.href}>
                  {service.link}
                  <ArrowRight size={18} aria-hidden="true" />
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
}
