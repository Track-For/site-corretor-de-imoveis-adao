import { WhatsappLogo } from "@phosphor-icons/react/dist/ssr";
import { buildGeneralWhatsAppUrl } from "@/lib/utils/whatsapp";

export function WhatsAppFab() {
  return (
    <a
      href={buildGeneralWhatsAppUrl()}
      className="whatsapp-fab"
      target="_blank"
      rel="noreferrer"
      aria-label="Fale conosco pelo WhatsApp"
      data-track="whatsapp_click"
      data-destination="floating_button"
    >
      <WhatsappLogo size={22} weight="fill" aria-hidden="true" />
      <span>Fale conosco</span>
    </a>
  );
}
