"use client";

export default function PropertiesError({ reset }: { reset: () => void }) {
  return (
    <main id="conteudo" className="page-main">
      <div className="shell error-page">
        <p className="eyebrow">Não foi possível carregar o catálogo</p>
        <h1>Os imóveis estão temporariamente indisponíveis.</h1>
        <p>Tente novamente. Se o problema continuar, fale diretamente com Adão.</p>
        <button type="button" className="button button--primary" onClick={reset}>
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
