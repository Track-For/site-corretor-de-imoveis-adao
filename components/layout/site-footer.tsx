import Image from "next/image";
import Link from "next/link";
import { broker } from "@/lib/config/broker";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="shell footer-grid">
        <div>
          <Link href="/" className="footer-brand" aria-label="Dourado Imóveis - página inicial">
            <Image
              src="/images/Logo_Adão-removebg-preview.png"
              alt="Dourado Imóveis"
              width={500}
              height={500}
              sizes="112px"
            />
          </Link>
          <strong className="footer-broker">Adão de Souza Dourado</strong>
          <p>{broker.creci}</p>
          <p>{broker.serviceArea}</p>
        </div>

        <div>
          <h2>Navegação</h2>
          <Link href="/imoveis">Imóveis</Link>
          <Link href="/sobre">Sobre</Link>
          <Link href="/servicos">Serviços</Link>
          <Link href="/contato">Contato</Link>
        </div>

        <div>
          <h2>Contato</h2>
          <a href={`tel:${broker.phonePrimary.replace(/\D/g, "")}`}>
            {broker.phonePrimary}
          </a>
          <a href={`tel:${broker.phoneSecondary.replace(/\D/g, "")}`}>
            {broker.phoneSecondary}
          </a>
          {broker.emails.map((email) => (
            <a key={email} href={`mailto:${email}`}>
              {email}
            </a>
          ))}
        </div>

        <div>
          <h2>Atendimento</h2>
          <p>
            {broker.address.city}, {broker.address.state}
          </p>
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            data-track="whatsapp_click"
            data-destination="footer"
          >
            Falar conosco
          </a>
        </div>
      </div>

      <div className="shell footer-bottom">
        <p>
          © {new Date().getFullYear()} Adão Corretor de Imóveis. Todos os
          direitos reservados.
        </p>
        <Link href="/privacidade">Privacidade</Link>
      </div>
    </footer>
  );
}
