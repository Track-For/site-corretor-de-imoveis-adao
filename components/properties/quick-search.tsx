import { MagnifyingGlass } from "@phosphor-icons/react/dist/ssr";

export function QuickSearch({ cities }: { cities: string[] }) {
  return (
    <form action="/imoveis" method="get" className="quick-search">
      <div className="field">
        <label htmlFor="home-purpose">O que você procura?</label>
        <select id="home-purpose" name="finalidade" defaultValue="">
          <option value="">Comprar ou alugar</option>
          <option value="sale">Comprar</option>
          <option value="rent">Alugar</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="home-type">Tipo</label>
        <select id="home-type" name="tipo" defaultValue="">
          <option value="">Todos os imóveis</option>
          <option value="apartment">Apartamento</option>
          <option value="house">Casa</option>
          <option value="commercial">Comercial</option>
          <option value="land">Terreno</option>
          <option value="rural">Rural</option>
        </select>
      </div>

      <div className="field">
        <label htmlFor="home-city">Cidade</label>
        <select id="home-city" name="cidade" defaultValue="">
          <option value="">Todas as cidades</option>
          {cities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="button button--primary quick-search__button"
        data-track="search_property"
      >
        <MagnifyingGlass size={20} weight="bold" aria-hidden="true" />
        Buscar imóveis
      </button>
    </form>
  );
}
