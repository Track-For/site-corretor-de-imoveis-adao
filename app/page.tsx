import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  MapPin,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { HomeExperience } from "@/components/home/home-experience";
import { Reveal } from "@/components/motion/reveal";
import { PropertyCard } from "@/components/properties/property-card";
import { QuickSearch } from "@/components/properties/quick-search";
import { broker, siteUrl } from "@/lib/config/broker";
import {
  getFeaturedProperties,
  getProperties,
} from "@/lib/repositories/properties";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";

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
  const realEstateAgentJsonLd = {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: broker.displayName,
    legalName: broker.legalName,
    url: siteUrl,
    telephone: [broker.phonePrimary, broker.phoneSecondary],
    email: broker.emails,
    sameAs: [broker.instagramUrl],
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
            src="/images/hero-video-poster-otimizado.webp"
            alt="Residência contemporânea cercada por paisagismo"
            fill
            preload
            sizes="100vw"
            className="hero__poster"
          />
          <video
            className="hero__video"
            muted
            playsInline
            loop
            preload="none"
            poster="/images/hero-video-poster-otimizado.webp"
            aria-hidden="true"
            tabIndex={-1}
          >
            <source src="/videos/hero-imoveis-otimizado.mp4" type="video/mp4" />
          </video>
        </div>
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__content shell">
          <div className="hero__copy">
            <p className="eyebrow hero__eyebrow">
              <span aria-hidden="true" /> Dourado Imóveis · Goiás
            </p>
            <h1 id="hero-title">
              <span className="hero__title-line">O imóvel certo para</span>
              <span className="hero__title-line">o seu próximo <em>capítulo</em></span>
            </h1>
            <p className="hero__description">
              Imóveis em Aparecida de Goiânia e região. Uma seleção cuidadosa,
              com Adão ao seu lado em cada decisão.
            </p>
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
              Converse com Adão
            </a>
          </div>
          <div className="hero__aside" aria-hidden="true">
            <span>{broker.address.city}</span>
            <strong>Atendimento direto com Adão</strong>
            <small>{broker.creci}</small>
          </div>
        </div>
      </section>

      <div className="home-content">
      <section className="search-band" aria-labelledby="search-title">
        <div className="shell">
          <div className="search-band__heading">
            <h2 id="search-title">Encontre o seu lugar</h2>
            <p>O próximo capítulo começa com uma boa escolha.</p>
          </div>
          <QuickSearch cities={cities} />
        </div>
      </section>
      <div className="home-signature shell">
        <span>Compra, venda e locação</span>
        <span>Atendimento pessoal</span>
        <span>{broker.creci}</span>
      </div>

      <section className="section featured-section" aria-labelledby="featured-title">
        <div className="shell">
          <Reveal>
            <div className="section-heading section-heading--stacked">
              <p className="eyebrow">Seleção em destaque</p>
              <div className="section-heading__rule" data-draw-line aria-hidden="true" />
              <h2 id="featured-title">Imóveis em destaque</h2>
              <p>
                Conheça a seleção e descubra o que combina com você.
              </p>
            </div>
          </Reveal>

          {featured.length ? (
            <div
              className={`featured-properties${
                featured.length < 3 ? " featured-properties--sparse" : ""
              }`}
            >
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
              <figcaption>Adão de Souza Dourado · {broker.creci}</figcaption>
            </figure>
          </Reveal>

          <Reveal className="broker-copy">
            <p className="eyebrow">Conheça o seu corretor</p>
            <h2 id="broker-title">Seu imóvel. Seus planos. Atenção de verdade.</h2>
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

      <section className="section home-paths" aria-labelledby="catalog-title">
        <div className="shell">
          <div className="home-paths__heading">
            <div><p className="eyebrow">Para cada momento</p><h2 id="catalog-title">Qual é o seu próximo passo?</h2></div>
            <p>Da primeira conversa à negociação, um atendimento próximo para seguir com segurança.</p>
          </div>
          <div className="home-paths__grid">
            {[
              { number: "01", title: "Quero comprar", description: "Encontre um imóvel que faça sentido para sua vida e seus planos.", href: "/imoveis?finalidade=sale", action: "Explorar imóveis" },
              { number: "02", title: "Quero alugar", description: "Conheça as opções disponíveis para o seu próximo endereço.", href: "/imoveis?finalidade=rent", action: "Ver opções de locação" },
              { number: "03", title: "Quero anunciar", description: "Apresente seu imóvel com cuidado e tenha apoio em cada etapa da negociação.", href: "/contato?assunto=venda", action: "Conversar sobre meu imóvel" },
            ].map((item) => (
              <Link key={item.number} href={item.href} className="home-path" data-track={item.number === "03" ? "sell_property_lead" : "view_property_list"}>
                <span className="home-path__number">{item.number}</span>
                <h3>{item.title}</h3><p>{item.description}</p>
                <span className="home-path__action">{item.action}<ArrowRight size={20} aria-hidden="true" /></span>
              </Link>
            ))}
          </div>
          <div className="home-area"><MapPin size={22} aria-hidden="true" /><p>{broker.serviceArea}.</p></div>
        </div>
      </section>

      <section className="section faq-section" aria-labelledby="faq-title">
        <div className="shell faq-grid">
          <Reveal className="faq-intro">
            <h2 id="faq-title">Antes do próximo passo</h2>
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
            <h2 id="contact-title">Vamos encontrar o seu próximo endereço?</h2>
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
              Converse com Adão
            </a>
          </Reveal>
        </div>
      </section>
      </div>
      </HomeExperience>
    </main>
  );
}
