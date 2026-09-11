-- Execute este arquivo no SQL Editor do Supabase quando o projeto for criado.
-- O painel do próprio Supabase será usado para administrar o catálogo.
-- Senha: CorretorAdao
-- Este script é reexecutável: apaga qualquer schema anterior antes de recriar.
-- Atenção: apaga também os dados existentes em properties/property_images/leads.

drop table if exists public.property_images cascade;
drop table if exists public.leads cascade;
drop table if exists public.properties cascade;
drop function if exists public.set_updated_at cascade;
drop function if exists public.properties_set_slug cascade;
drop function if exists public.generate_slug cascade;
drop type if exists public.finalidade_enum cascade;
drop type if exists public.tipo_imovel_enum cascade;
drop type if exists public.status_enum cascade;

create extension if not exists "pgcrypto";

create type public.finalidade_enum as enum ('venda', 'aluguel');
create type public.tipo_imovel_enum as enum ('apartamento', 'casa', 'comercial', 'terreno', 'rural');
create type public.status_enum as enum ('rascunho', 'disponivel', 'reservado', 'vendido', 'alugado', 'inativo');

-- Tabela única do catálogo: o cliente cadastra os imóveis direto pelo
-- Table Editor do Supabase, então os nomes de coluna e as opções dos
-- campos de seleção ficam em português.
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  -- Gerado automaticamente a partir do "titulo" pelo trigger
  -- properties_set_slug (ver abaixo). Deixe em branco para gerar; só
  -- preencha na mão se quiser uma URL diferente do título.
  slug text unique,
  titulo text not null,
  descricao text not null,
  finalidade public.finalidade_enum not null,
  tipo_imovel public.tipo_imovel_enum not null,
  status public.status_enum not null default 'rascunho',
  preco numeric(14, 2) not null check (preco >= 0),
  cidade text not null,
  -- Links das fotos, um por campo, na ordem de exibição. Cole a URL de
  -- cada foto direto no campo (imagem_1 é a capa). Deixe em branco os
  -- campos sem foto. As imagens em si ficam no Storage do Supabase; aqui
  -- só entram as URLs.
  imagem_1 text,
  imagem_2 text,
  imagem_3 text,
  imagem_4 text,
  imagem_5 text,
  -- Link público (Storage do Supabase) do vídeo de apresentação do imóvel.
  video_url text,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index properties_public_catalog_idx
  on public.properties (status, finalidade, tipo_imovel, cidade);

-- Normaliza um texto para o formato de slug (minúsculas, números e hífen).
-- Troca os acentos comuns do português antes de remover o resto dos símbolos.
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

-- Preenche o "slug" sozinho quando o cadastro é feito pelo Table Editor:
-- se o campo ficar em branco, gera a partir do "titulo"; se vier
-- preenchido, só normaliza o texto digitado. Garante unicidade adicionando
-- "-2", "-3" etc. em caso de colisão. Editar o "titulo" depois não altera
-- o slug já salvo (evita quebrar links publicados) — para trocar o slug,
-- é só apagar o campo e salvar de novo.
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

create trigger properties_set_slug
before insert or update on public.properties
for each row execute function public.properties_set_slug();

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger properties_set_updated_at
before update on public.properties
for each row execute function public.set_updated_at();

alter table public.properties enable row level security;

create policy "Public can read published properties"
on public.properties
for select
to anon, authenticated
using (
  status in ('disponivel', 'reservado', 'vendido', 'alugado')
);

-- Não existe política pública de escrita. Cadastros e edições são feitos no
-- painel do Supabase (Table Editor), pelo cliente.
