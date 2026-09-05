export default function PropertiesLoading() {
  return (
    <main id="conteudo" className="page-main" aria-busy="true">
      <div className="shell loading-page">
        <div className="skeleton skeleton--title" />
        <div className="skeleton skeleton--filters" />
        <div className="loading-grid">
          <div className="skeleton skeleton--card" />
          <div className="skeleton skeleton--card" />
        </div>
        <span className="sr-only">Carregando imóveis</span>
      </div>
    </main>
  );
}
