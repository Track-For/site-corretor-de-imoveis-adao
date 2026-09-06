-- Execute este arquivo no SQL Editor do Supabase quando o projeto for criado.
-- O painel do próprio Supabase será usado para administrar o catálogo.
-- Senha: CorretorAdao
-- Este script é reexecutável: apaga qualquer schema anterior antes de recriar.
-- Atenção: apaga também os dados existentes em properties/property_images/leads.

drop table if exists public.property_images cascade;
drop table if exists public.leads cascade;
drop table if exists public.properties cascade;
drop function if exists public.set_updated_at cascade;
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
  slug text not null unique,
  titulo text not null,
  descricao text not null,
  finalidade public.finalidade_enum not null,
  tipo_imovel public.tipo_imovel_enum not null,
  status public.status_enum not null default 'rascunho',
  preco numeric(14, 2) not null check (preco >= 0),
  cidade text not null,
  -- Lista simples de links das fotos, na ordem de exibição.
  -- As imagens em si ficam no Storage do Supabase; aqui só entram as URLs.
  imagens text[] not null default '{}',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create index properties_public_catalog_idx
  on public.properties (status, finalidade, tipo_imovel, cidade);

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
