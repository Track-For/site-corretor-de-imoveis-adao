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
import { HomeExperience } from "@/components/home/home-experience";
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
      "Seleção objetiva de imóveis de acordo com a sua rotina, orçamento e momento de vida",
    icon: Key,
  },
  {
    title: "Venda",
    description:
      "Posicionamento comercial, apresentação do imóvel e acompanhamento da negociação",
    icon: Handshake,
  },
  {
    title: "Locação",
    description:
      "Apoio para encontrar ou anunciar imóveis residenciais e comerciais para aluguel",
    icon: Buildings,
  },
  {
    title: "Imóveis diversos",
    description:
      "Casas, apartamentos, terrenos, imóveis rurais e espaços comerciais em catálogos separados",
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
    property.images.filter((image) => image.trim().length > 0).map((image, index) => ({
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

      <HomeExperience>
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero__media" data-parallax-media>
          <Image
            src="/images/hero-video-poster.webp"
            alt="Residência contemporânea cercada por paisagismo"
            fill
            priority
            sizes="100vw"
            className="hero__poster"
          />
          <video
            className="hero__video"
            muted
            playsInline
            preload="auto"
            poster="/images/hero-video-poster.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/videos/hero-imoveis.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__content shell">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">
              <span aria-hidden="true" /> Curadoria imobiliária em Goiás
            </p>
            <h1 id="hero-title">
              <span className="hero__title-line">O imóvel certo para</span>
              <span className="hero__title-line">o seu próximo <em>capítulo</em></span>
            </h1>
            <p className="hero__description">
              Comprar, vender ou alugar com clareza, repertório local e
              atendimento direto
            </p>
          </div>
          <div className="hero__story" aria-hidden="true">
            <div className="hero__chapter hero__chapter--curation">
              <div className="hero__chapter-meta">
                <i />
                <span>Curadoria com propósito</span>
              </div>
              <p className="hero__chapter-title">
                <span>Um olhar atento</span>
                <span>revela o lugar</span>
                <span><em>certo</em></span>
              </p>
              <p className="hero__chapter-description">
                Cada escolha começa entendendo sua rotina, seus planos e o que
                realmente importa para você
              </p>
            </div>
            <div className="hero__chapter hero__chapter--confidence">
              <div className="hero__chapter-meta">
                <i />
                <span>Da escolha às chaves</span>
              </div>
              <p className="hero__chapter-title">
                <span>Decisões seguras</span>
                <span>começam com uma</span>
                <span>conversa <em>clara</em></span>
              </p>
              <p className="hero__chapter-description">
                Presença em cada etapa para transformar possibilidades em um
                endereço que faça sentido
              </p>
            </div>
          </div>
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
          <div className="hero__aside" aria-hidden="true">
            <span>{broker.address.city}</span>
            <strong>Escolhas com intenção</strong>
            <small>{broker.creci}</small>
          </div>
        </div>
      </section>

      <section className="search-band" aria-labelledby="search-title">
        <div className="shell">
          <div className="search-band__heading">
            <h2 id="search-title">Comece pelo que importa</h2>
            <p>Escolha os critérios principais. O catálogo faz o restante.</p>
          </div>
          <QuickSearch cities={cities} />
        </div>
      </section>

      <PropertyMarquee items={marqueeItems} />

      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <Reveal>
            <div className="section-heading section-heading--stacked">
              <p className="eyebrow">Seleção em destaque</p>
              <div className="section-heading__rule" data-draw-line aria-hidden="true" />
              <h2 id="featured-title">Espaços que merecem ser vistos com calma</h2>
              <p>
                Uma curadoria de imóveis para diferentes rotinas, momentos e
                formas de viver
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
            Explorar todos os imóveis
            <ArrowRight size={20} aria-hidden="true" />
          </Link>
        </div>
      </section>

      <section className="section broker-section" aria-labelledby="broker-title">
        <div className="shell broker-grid">
          <Reveal>
            <figure className="broker-portrait">
              <div className="broker-portrait__image" data-parallax-media>
                <Image
                  src="/images/Imagem Adão.jpg"
                  alt="Retrato profissional do corretor Adão de Souza Dourado"
                  fill
                  sizes="(max-width: 767px) 100vw, 42vw"
                />
              </div>
              <div className="broker-portrait__detail" data-parallax-media>
                <Image
                  src="/images/apartamento-interior-conceitual.webp"
                  alt="Interior de apartamento contemporâneo"
                  fill
                  sizes="(max-width: 767px) 42vw, 18vw"
                />
              </div>
            </figure>
          </Reveal>

          <Reveal className="broker-copy">
            <div className="section-heading__rule" data-draw-line aria-hidden="true" />
            <h2 id="broker-title">Uma escolha importante pede atenção de verdade</h2>
            <p className="broker-copy__lead">
              Adão de Souza Dourado acompanha compras, vendas e locações com
              proximidade, informação clara e disponibilidade para conversar
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
              Conheça o atendimento
              <ArrowRight size={19} aria-hidden="true" />
            </Link>
          </Reveal>
        </div>
      </section>

      <section className="section services-section" aria-labelledby="services-title">
        <div className="shell">
          <Reveal>
            <div className="section-heading section-heading--stacked">
              <div className="section-heading__rule" data-draw-line aria-hidden="true" />
              <h2 id="services-title">Estratégia para cada movimento imobiliário</h2>
              <p>Do primeiro filtro à negociação, cada etapa tem um propósito</p>
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
        <div className="catalog-paths__media" data-parallax-media aria-hidden="true">
          <Image
            src="/images/edificio-conceitual.webp"
            alt=""
            fill
            sizes="100vw"
          />
        </div>
        <div className="shell catalog-paths__content">
          <Reveal className="catalog-paths__intro">
            <p className="eyebrow">Encontre o seu caminho</p>
            <div className="section-heading__rule" data-draw-line aria-hidden="true" />
            <h2 id="catalog-title">Três formas de começar</h2>
            <p>
              Escolha a intenção que melhor descreve o seu momento. A conversa
              continua a partir daí
            </p>
          </Reveal>
          <div className="catalog-paths__grid">
            <Link href="/imoveis?finalidade=sale" data-track="view_property_list" data-scroll-reveal>
              <span>Para comprar</span>
              <strong>Casas, apartamentos, terrenos e imóveis comerciais</strong>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
            <Link href="/imoveis?finalidade=rent" data-track="view_property_list" data-scroll-reveal>
              <span>Para alugar</span>
              <strong>Opções residenciais e comerciais para sua rotina</strong>
              <ArrowRight size={24} aria-hidden="true" />
            </Link>
            <Link href="/contato?assunto=venda" data-track="sell_property_lead" data-scroll-reveal>
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
            <MapPin size={28} weight="duotone" aria-hidden="true" />
            <h2 id="local-title">Perto o bastante para entender cada detalhe</h2>
            <p>{broker.serviceArea}</p>
            <address>
              {broker.address.city}, {broker.address.state}
            </address>
          </Reveal>
          <Reveal className="local-image">
            <div className="local-image__media" data-parallax-media>
              <Image
                src="/images/casa-piscina-conceitual.webp"
                alt="Casa contemporânea com piscina e jardim"
                fill
                sizes="(max-width: 767px) 100vw, 52vw"
              />
            </div>
          </Reveal>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="shell faq-grid">
          <Reveal className="faq-intro">
            <h2 id="faq-title">Perguntas que ajudam a dar o primeiro passo</h2>
            <p>Respostas objetivas sobre busca, anúncio e atendimento</p>
          </Reveal>
          <div className="faq-list">
            {faqs.map((item) => (
              <details key={item.question} data-scroll-reveal>
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
            <h2 id="contact-title">Seu próximo endereço pode começar aqui</h2>
            <p>
              Conte o que você procura ou o que deseja anunciar. Adão responde
              pessoalmente e ajuda a organizar os próximos passos.
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
      </HomeExperience>
    </main>
  );
}
