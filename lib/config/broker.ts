export const broker = {
  legalName: "Adão de Souza Dourado",
  displayName: "Dourado Imóveis",
  firstName: "Adão",
  creci: "CRECI-GO 8627",
  phonePrimary: "+55 62 99256-7575",
  phoneSecondary: "+55 62 99426-9612",
  whatsappPrimary: "5562992567575",
  emails: ["adaodourado24@gmail.com", "viniciusbinha92@gmail.com"],
  address: {
    city: "Aparecida de Goiânia",
    state: "GO",
    country: "BR",
  },
  serviceArea:
    "Base em Aparecida de Goiânia, com atendimento para outras regiões sob consulta",
} as const;

export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
  "https://example.com";
