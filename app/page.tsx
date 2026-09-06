import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Buildings,
  Handshake,
  House,
  Key,
  MapPin,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { Reveal } from "@/components/motion/reveal";
import {
  PropertyMarquee,
  type PropertyMarqueeItem,
} from "@/components/properties/property-marquee";
import { PropertyCard } from "@/components/properties/property-card";
import { QuickSearch } from "@/components/properties/quick-search";
import { broker, siteUrl } from "@/lib/config/broker";
import {
  getFeaturedProperties,
  getProperties,
} from "@/lib/repositories/properties";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";
import { propertyTypeLabels, purposeLabels } from "@/lib/utils/format";

export const revalidate = 300;

const services = [
  {
    title: "Compra",
    description:
      "Seleção objetiva de imóveis de acordo com a sua rotina, orçamento e momento de vida.",
    icon: Key,
  },
  {
    title: "Venda",
    description:
      "Posicionamento comercial, apresentação do imóvel e acompanhamento da negociação.",
    icon: Handshake,
  },
  {
    title: "Locação",
    description:
      "Apoio para encontrar ou anunciar imóveis residenciais e comerciais para aluguel.",
    icon: Buildings,
  },
  {
    title: "Imóveis diversos",
    description:
      "Casas, apartamentos, terrenos, imóveis rurais e espaços comerciais em catálogos separados.",
    icon: House,
  },
];

const faqs = [
  {
    question: "Como começo a busca por um imóvel?",
    answer:
      "Envie sua preferência de localização, tipo, faixa de valor e finalidade. Adão retorna com opções compatíveis e orienta os próximos passos.",
  },
  {
    question: "Posso anunciar meu imóvel com Adão?",
    answer:
      "Sim. O primeiro contato serve para conhecer o imóvel, alinhar documentação, estratégia de apresentação e condições comerciais.",
  },
  {
    question: "É possível agendar uma visita?",
    answer:
      "Sim. A disponibilidade é confirmada diretamente com o proprietário ou responsável pelo imóvel antes do agendamento.",
  },
  {
    question: "Quais tipos de imóvel são atendidos?",
    answer:
      "O atendimento inclui imóveis residenciais, comerciais, terrenos, propriedades rurais, compra, venda e locação.",
  },
  {
    question: "Quais regiões são atendidas?",
    answer:
      "A base de atendimento fica em Aparecida de Goiânia. Outras cidades e regiões são avaliadas conforme cada demanda.",
  },
];

export default async function HomePage() {
  const [featured, allProperties] = await Promise.all([
    getFeaturedProperties(3),
    getProperties(),
  ]);
  const cities = [...new Set(allProperties.map((property) => property.city))];
  const marqueeSource: PropertyMarqueeItem[] = allProperties.flatMap((property) =>
    property.images.map((image, index) => ({
      id: `${property.id}-${index}`,
      title: property.title,
      meta: `${purposeLabels[property.purpose]} · ${propertyTypeLabels[property.propertyType]}`,
      href: `/imoveis/${property.slug}`,
      imageUrl: image,
      imageAlt: property.title,
    })),
  );
  const marqueeItems = marqueeSource.length
    ? Array.from(
        { length: Math.max(16, marqueeSource.length) },
        (_, index): PropertyMarqueeItem => ({
          ...marqueeSource[index % marqueeSource.length],
          id: `${marqueeSource[index % marqueeSource.length].id}-${index}`,
        }),
      )
    : [];

  const realEstateAgentJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: broker.displayName,
    legalName: broker.legalName,
    url: siteUrl,
    telephone: [broker.phonePrimary, broker.phoneSecondary],
    email: broker.emails,
    address: {
      "@type": "PostalAddress",
      addressLocality: broker.address.city,
      addressRegion: broker.address.state,
      addressCountry: broker.address.country,
    },
    areaServed: broker.address.city,
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };

  return (
    <main id="conteudo">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(realEstateAgentJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="hero">
        <div className="hero__content shell">
          <div className="hero__copy">
            <p className="eyebrow">{broker.creci}</p>
            <h1>Imóveis escolhidos para decidir bem.</h1>
            <p>
              Compra, venda e locação com atendimento direto de Adão.
            </p>
            <div className="hero__actions">
              <Link
                href="/imoveis"
                className="button button--primary"
                data-track="view_property_list"
              >
                Ver imóveis
                <ArrowRight size={19} weight="bold" aria-hidden="true" />
              </Link>
              <a
                href={buildGeneralWhatsAppUrl()}
                className="button button--secondary"
                target="_blank"
                rel="noreferrer"
                data-track="whatsapp_click"
                data-destination="hero"
              >
                <WhatsappLogo size={19} weight="bold" aria-hidden="true" />
                Falar com Adão
              </a>
            </div>
          </div>
        </div>
        <div className="hero__media">
          <Image
            src="/images/hero-casa-conceitual.webp"
            alt="Casa contemporânea usada como imagem conceitual do site"
            fill
            priority
            sizes="(max-width: 767px) 100vw, 58vw"
          />
        </div>
      </section>

      <section className="search-band" aria-labelledby="search-title">
        <div className="shell">
          <div className="search-band__heading">
            <h2 id="search-title">Encontre por finalidade</h2>
            <p>Use os filtros essenciais e refine a busca no catálogo.</p>
          </div>
          <QuickSearch cities={cities} />
        </div>
      </section>

      <PropertyMarquee items={marqueeItems} />

      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <Reveal>
            <div className="section-heading section-heading--stacked">
              <h2 id="featured-title">Imóveis em destaque</h2>
              <p>
                Conteúdo demonstrativo para validar a experiência. Fotos, dados
                e valores serão substituídos pelos cadastros do Supabase.
              </p>
            </div>
          </Reveal>

          {featured.length ? (
            <div className="featured-properties">
              {featured.map((property, index) => (
                <Reveal
                  key={property.id}
                  className={index === 0 ? "featured-properties__lead" : ""}
                >
                  <PropertyCard
                    property={property}
                    priority={index === 0}
                    featured={index === 0}
                  />
                </Reveal>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <h3>Nenhum destaque no momento</h3>
              <p>Novos imóveis serão publicados aqui quando estiverem disponíveis.</p>
            </div>
          )}

          <Link href="/imoveis" className="text-link text-link--large">
            Ver catálogo completo
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section broker-section" aria-labelledby="broker-title">
        <div className="shell broker-grid">
          <Reveal>
            <figure className="broker-portrait">
              <div className="broker-portrait__image">
                <Image
                  src="/images/corretor-placeholder.webp"
                  alt="Modelo fictício usado temporariamente no lugar da foto profissional de Adão"
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                />
              </div>
              <figcaption>Foto provisória com modelo fictício</figcaption>
            </figure>
          </Reveal>

          <Reveal className="broker-copy">
            <p className="eyebrow">Quem vai acompanhar você</p>
            <h2 id="broker-title">Conversa direta com o corretor.</h2>
            <p className="broker-copy__lead">
              Adão de Souza Dourado atua em compra, venda e locação de imóveis,
              com atendimento próximo em cada etapa da negociação.
            </p>
            <dl className="broker-facts">
              <div>
                <dt>Registro</dt>
                <dd>{broker.creci}</dd>
              </div>
              <div>
                <dt>Base</dt>
                <dd>{broker.address.city}, {broker.address.state}</dd>
              </div>
              <div>
                <dt>Atuação</dt>
                <dd>Compra, venda e locação</dd>
              </div>
            </dl>
            <Link href="/sobre" className="button button--secondary">
              Conhecer Adão
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section services-section" aria-labelledby="services-title">
        <div className="shell">
          <Reveal>
            <div className="section-heading section-heading--stacked">
              <h2 id="services-title">Um atendimento para cada objetivo</h2>
              <p>O catálogo se organiza por finalidade e tipo de imóvel.</p>
            </div>
          </Reveal>
          <div className="services-list">
            {services.map((service) => {
              const Icon = service.icon;
              return (
                <Reveal key={service.title} className="service-item">
                  <Icon size={27} weight="duotone" aria-hidden="true" />
                  <h3>{service.title}</h3>
                  <p>{service.description}</p>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <section className="section catalog-paths" aria-labelledby="catalog-title">
        <div className="shell">
          <Reveal className="catalog-paths__intro">
            <h2 id="catalog-title">Entre pelo catálogo certo</h2>
            <p>
              Finalidade e tipo permanecem registrados na URL. Assim, a busca
              pode ser compartilhada e retomada depois.
            </p>
          </Reveal>
          <div className="catalog-paths__grid">
            <Link href="/imoveis?finalidade=sale" data-track="view_property_list">
              <span>Para comprar</span>
              <strong>Casas, apartamentos, terrenos e imóveis comerciais</strong>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
            <Link href="/imoveis?finalidade=rent" data-track="view_property_list">
              <span>Para alugar</span>
              <strong>Opções residenciais e comerciais para sua rotina</strong>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
            <Link href="/contato?assunto=venda" data-track="sell_property_lead">
              <span>Para anunciar</span>
              <strong>Converse sobre a venda ou locação do seu imóvel</strong>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </section>

      <section className="section local-section" aria-labelledby="local-title">
        <div className="shell local-grid">
          <Reveal className="local-copy">
            <MapPin size={32} weight="duotone" aria-hidden="true" />
            <h2 id="local-title">Base local, atendimento sob consulta.</h2>
            <p>{broker.serviceArea}</p>
            <address>
              {broker.address.city}, {broker.address.state}
            </address>
          </Reveal>
          <Reveal className="local-image">
            <Image
              src="/images/edificio-conceitual.webp"
              alt="Edifício residencial contemporâneo usado como imagem conceitual"
              fill
              sizes="(max-width: 767px) 100vw, 52vw"
            />
          </Reveal>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="shell faq-grid">
          <Reveal className="faq-intro">
            <h2 id="faq-title">Perguntas antes da primeira conversa</h2>
            <p>Respostas diretas sobre busca, anúncio e atendimento.</p>
          </Reveal>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="section contact-section" id="contato" aria-labelledby="contact-title">
        <div className="shell">
          <Reveal className="contact-intro">
            <p className="eyebrow">Vamos conversar</p>
            <h2 id="contact-title">Qual é o imóvel que faz sentido agora?</h2>
            <p>
              Conte o que você procura ou deseja anunciar. Adão responde pelos
              canais informados no site.
            </p>
            <a
              href={buildGeneralWhatsAppUrl()}
              className="button button--secondary"
              target="_blank"
              rel="noreferrer"
              data-track="whatsapp_click"
              data-destination="contact_section"
            >
              <WhatsappLogo size={19} weight="bold" aria-hidden="true" />
                Falar com Adão
            </a>
          </Reveal>
        </div>
      </section>
    </main>
  );
}
