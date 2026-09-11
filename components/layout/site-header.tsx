"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { List, WhatsappLogo, X } from "@phosphor-icons/react";
import { useState } from "react";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";

const navigation = [
  { href: "/imoveis", label: "Imóveis" },
  { href: "/imoveis?finalidade=sale", label: "Comprar" },
  { href: "/imoveis?finalidade=rent", label: "Alugar" },
  { href: "/sobre", label: "Sobre" },
  { href: "/servicos", label: "Serviços" },
  { href: "/contato", label: "Contato" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="site-header">
      <div className="site-header__inner shell">
        <Link href="/" className="brand" onClick={() => setOpen(false)}>
          <span className="brand__logo">
            <Image
              src="/images/Logo_Adão-removebg-preview.png"
              alt="Dourado Imóveis"
              width={512}
              height={512}
              priority
              sizes="64px"
            />
          </span>
        </Link>

        <nav className="desktop-nav" aria-label="Navegação principal">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={pathname === item.href ? "is-active" : undefined}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <a
          href={buildGeneralWhatsAppUrl()}
          className="header-contact"
          target="_blank"
          rel="noreferrer"
          data-track="whatsapp_click"
          data-destination="header"
        >
          <WhatsappLogo size={18} weight="bold" aria-hidden="true" />
          Falar conosco
        </a>

        <button
          className="menu-button"
          type="button"
          onClick={() => setOpen((value) => !value)}
          aria-expanded={open}
          aria-controls="mobile-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X size={24} /> : <List size={24} />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`mobile-nav ${open ? "is-open" : ""}`}
        aria-label="Navegação móvel"
      >
        <div className="shell">
          {navigation.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
            >
              {item.label}
            </Link>
          ))}
          <a
            href={buildGeneralWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            data-track="whatsapp_click"
            data-destination="mobile_menu"
          >
            Falar conosco
          </a>
        </div>
      </nav>
    </header>
  );
}
