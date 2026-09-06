import Link from "next/link";
import type { PropertyFilters as Filters } from "@/lib/domain/property";

export function PropertyFilters({
  filters,
  cities,
}: {
  filters: Filters;
  cities: string[];
}) {
  return (
    <form action="/imoveis" method="get" className="property-filters">
      <div className="property-filters__grid">
        <div className="field">
          <label htmlFor="purpose">Finalidade</label>
          <select id="purpose" name="finalidade" defaultValue={filters.purpose || ""}>
            <option value="">Todas</option>
            <option value="sale">Comprar</option>
            <option value="rent">Alugar</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="type">Tipo</label>
          <select id="type" name="tipo" defaultValue={filters.propertyType || ""}>
            <option value="">Todos</option>
            <option value="apartment">Apartamento</option>
            <option value="house">Casa</option>
            <option value="commercial">Comercial</option>
            <option value="land">Terreno</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div className="field">
          <label htmlFor="city">Cidade</label>
          <select id="city" name="cidade" defaultValue={filters.city || ""}>
            <option value="">Todas</option>
            {cities.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="min-price">Preço mínimo</label>
          <input
            id="min-price"
            name="precoMin"
            inputMode="numeric"
            type="number"
            min="0"
            step="100"
            defaultValue={filters.minPrice}
            placeholder="R$ 0"
          />
        </div>

        <div className="field">
          <label htmlFor="max-price">Preço máximo</label>
          <input
            id="max-price"
            name="precoMax"
            inputMode="numeric"
            type="number"
            min="0"
            step="100"
            defaultValue={filters.maxPrice}
            placeholder="Sem limite"
          />
        </div>

        <div className="field">
          <label htmlFor="status">Status</label>
          <select id="status" name="status" defaultValue={filters.status || ""}>
            <option value="">Publicados</option>
            <option value="available">Disponível</option>
            <option value="reserved">Reservado</option>
            <option value="sold">Vendido</option>
            <option value="rented">Alugado</option>
          </select>
        </div>
      </div>

      <div className="property-filters__actions">
        <button type="submit" className="button button--primary" data-track="filter_property">
          Aplicar filtros
        </button>
        <Link href="/imoveis" className="text-link">
          Limpar filtros
        </Link>
      </div>
    </form>
  );
}
