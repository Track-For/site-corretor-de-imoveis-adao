import type { Metadata } from "next";
import {
  Envelope,
  MapPin,
  Phone,
  WhatsappLogo,
} from "@phosphor-icons/react/dist/ssr";
import { broker } from "@/lib/config/broker";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";

export const metadata: Metadata = {
  title: "Contato",
  description: `Fale com Adão pelo WhatsApp, telefone ou e-mail. ${broker.creci}.`,
  alternates: { canonical: "/contato" },
};

export default function ContactPage() {
  return (
    <main id="conteudo" className="page-main">
      <section className="page-hero page-hero--contact">
        <div className="shell">
          <p className="eyebrow">Contato direto</p>
          <h1>Vamos falar sobre imóveis.</h1>
          <p>
            Escolha o canal mais conveniente. Para uma resposta rápida, use o WhatsApp.
          </p>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="contact-options">
            <a
              href={buildGeneralWhatsAppUrl()}
              target="_blank"
              rel="noreferrer"
              data-track="whatsapp_click"
              data-destination="contact_page"
            >
              <WhatsappLogo size={26} weight="duotone" aria-hidden="true" />
              <span>WhatsApp</span>
              <strong>{broker.phonePrimary}</strong>
            </a>
            <a href={`tel:${broker.phoneSecondary.replace(/\D/g, "")}`}>
              <Phone size={26} weight="duotone" aria-hidden="true" />
              <span>Telefone alternativo</span>
              <strong>{broker.phoneSecondary}</strong>
            </a>
            {broker.emails.map((email) => (
              <a href={`mailto:${email}`} key={email}>
                <Envelope size={26} weight="duotone" aria-hidden="true" />
                <span>E-mail</span>
                <strong>{email}</strong>
              </a>
            ))}
            <div className="contact-address">
              <MapPin size={26} weight="duotone" aria-hidden="true" />
              <span>Base de atendimento</span>
              <address>
                {broker.address.city}, {broker.address.state}
              </address>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
