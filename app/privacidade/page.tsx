import type { Metadata } from "next";
import { broker } from "@/lib/config/broker";

export const metadata: Metadata = {
  title: "Política de privacidade",
  description: "Informações sobre o tratamento de dados enviados pelo site.",
  alternates: { canonical: "/privacidade" },
};

export default function PrivacyPage() {
  return (
    <main id="conteudo" className="page-main">
      <article className="shell legal-page">
        <h1>Política de privacidade</h1>
        <p>Última atualização: 5 de setembro de 2026.</p>

        <h2>Dados de contato</h2>
        <p>
          O site pode coletar nome, telefone, e-mail e mensagem quando você
          decide enviar um contato. Não solicitamos documentos pessoais pelo
          formulário público.
        </p>

        <h2>Finalidade</h2>
        <p>
          As informações são utilizadas para responder à solicitação, apresentar
          imóveis, organizar visitas ou conversar sobre a divulgação de um imóvel.
        </p>

        <h2>Armazenamento</h2>
        <p>
          O formulário permanecerá indisponível até que uma camada segura de
          armazenamento seja configurada. Contatos feitos por WhatsApp, telefone
          ou e-mail seguem as políticas dos respectivos serviços.
        </p>

        <h2>Seus direitos</h2>
        <p>
          Você pode solicitar acesso, correção ou exclusão dos dados enviados
          por meio dos canais de contato publicados neste site.
        </p>

        <h2>Responsável pelo atendimento</h2>
        <p>{broker.displayName}, {broker.creci}.</p>
        <p>E-mail: {broker.emails[0]}</p>
      </article>
    </main>
  );
}
