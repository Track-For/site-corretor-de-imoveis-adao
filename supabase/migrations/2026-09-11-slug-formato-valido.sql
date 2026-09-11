-- Migração: garante que "slug" sempre siga o formato de URL (minúsculas,
-- números e hífen, sem espaço/maiúscula/símbolo), já que o cliente cadastra
-- os imóveis direto pelo Table Editor do Supabase, sem validação de formulário.
--
-- 1) Normaliza os slugs já cadastrados que não seguem o formato (minúsculas,
--    símbolos/espaços viram hífen, sem hífen duplicado ou nas pontas).
-- 2) Adiciona uma constraint que passa a rejeitar qualquer slug fora do
--    formato daqui em diante.
--
-- Rode este script uma única vez no SQL Editor do projeto em produção.

update public.properties
set slug = trim(both '-' from regexp_replace(lower(slug), '[^a-z0-9]+', '-', 'g'))
where slug !~ '^[a-z0-9]+(-[a-z0-9]+)*$';

alter table public.properties
  add constraint properties_slug_format
  check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$');
