-- Migração: gera o "slug" automaticamente a partir do "titulo" quando o
-- campo é deixado em branco no cadastro, em vez de exigir que o cliente
-- digite um slug válido na mão pelo Table Editor.
--
-- Comportamento:
-- - slug em branco -> gerado a partir do titulo (minúsculas, hífen).
-- - slug preenchido -> só normalizado (mesma regra), não é rejeitado.
-- - colisão de slug -> recebe sufixo "-2", "-3" etc.
-- - editar o titulo depois NÃO recalcula o slug já salvo (não quebra links
--   publicados). Para trocar o slug de um imóvel existente, apague o campo
--   e salve de novo.
--
-- Rode este script uma única vez no SQL Editor do projeto em produção,
-- depois de já ter rodado a migração 2026-09-11-slug-formato-valido.sql.

create or replace function public.generate_slug(input text)
returns text
language sql
immutable
as $$
  select trim(both '-' from regexp_replace(
    translate(
      lower(input),
      'áàãâäéèêëíìîïóòõôöúùûüçñ',
      'aaaaaeeeeiiiiooooouuuucn'
    ),
    '[^a-z0-9]+', '-', 'g'
  ))
$$;

create or replace function public.properties_set_slug()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
declare
  base_slug text;
  candidate text;
  suffix int := 1;
begin
  if new.slug is null or trim(new.slug) = '' then
    base_slug := public.generate_slug(new.titulo);
  else
    base_slug := public.generate_slug(new.slug);
  end if;

  if base_slug = '' then
    base_slug := 'imovel';
  end if;

  candidate := base_slug;
  while exists (
    select 1 from public.properties
    where slug = candidate and id is distinct from new.id
  ) loop
    suffix := suffix + 1;
    candidate := base_slug || '-' || suffix;
  end loop;

  new.slug := candidate;
  return new;
end;
$$;

drop trigger if exists properties_set_slug on public.properties;

create trigger properties_set_slug
before insert or update on public.properties
for each row execute function public.properties_set_slug();

-- Permite deixar o campo em branco no Table Editor (o trigger acima
-- preenche antes de gravar, então nunca fica null de verdade).
alter table public.properties alter column slug drop not null;
