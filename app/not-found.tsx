import Link from "next/link";
import { ArrowLeft } from "@phosphor-icons/react/dist/ssr";

export default function NotFound() {
  return (
    <main id="conteudo" className="page-main">
      <div className="shell error-page">
        <p className="eyebrow">Página não encontrada</p>
        <h1>Este endereço não está disponível.</h1>
        <p>O imóvel pode ter sido arquivado ou o link pode estar incorreto.</p>
        <Link href="/imoveis" className="button button--primary">
          <ArrowLeft size={18} aria-hidden="true" />
          Ver imóveis
        </Link>
      </div>
    </main>
  );
}
