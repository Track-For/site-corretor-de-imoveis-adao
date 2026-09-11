-- Migração: troca a coluna "imagens" (array text[]) por 5 colunas de texto
-- simples (imagem_1 .. imagem_5), para o cliente colar cada link direto no
-- Table Editor do Supabase, sem precisar digitar a sintaxe de array
-- (ex.: ["url1","url2"]).
--
-- Esta migração é NÃO destrutiva: preserva os dados já cadastrados,
-- copiando cada posição do array para o campo correspondente.
--
-- Rode este script uma única vez no SQL Editor do projeto em produção.

alter table public.properties
  add column if not exists imagem_1 text,
  add column if not exists imagem_2 text,
  add column if not exists imagem_3 text,
  add column if not exists imagem_4 text,
  add column if not exists imagem_5 text;

update public.properties
set
  imagem_1 = nullif(trim(imagens[1]), ''),
  imagem_2 = nullif(trim(imagens[2]), ''),
  imagem_3 = nullif(trim(imagens[3]), ''),
  imagem_4 = nullif(trim(imagens[4]), ''),
  imagem_5 = nullif(trim(imagens[5]), '')
where imagens is not null;

alter table public.properties
  drop column if exists imagens;
