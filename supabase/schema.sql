-- Execute este arquivo no SQL Editor do Supabase quando o projeto for criado.
-- O painel do próprio Supabase será usado para administrar o catálogo.
-- Senha: CorretorAdao
-- Este script é reexecutável: apaga qualquer schema anterior antes de recriar.
-- Atenção: apaga também os dados existentes em properties/property_images/leads.

drop table if exists public.property_images cascade;
drop table if exists public.leads cascade;
drop table if exists public.properties cascade;
drop function if exists public.set_updated_at cascade;
drop type if exists public.property_purpose cascade;
drop type if exists public.property_type cascade;
drop type if exists public.property_status cascade;

create extension if not exists "pgcrypto";

create type public.property_purpose as enum ('sale', 'rent');
create type public.property_type as enum ('apartment', 'house', 'commercial', 'land', 'rural');
create type public.property_status as enum ('draft', 'available', 'reserved', 'sold', 'rented', 'inactive');

-- Tabela única do catálogo: o cliente cadastra os imóveis direto pelo
-- Table Editor do Supabase, então as colunas ficam reduzidas ao essencial.
create table public.properties (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  purpose public.property_purpose not null,
  property_type public.property_type not null,
  status public.property_status not null default 'draft',
  price numeric(14, 2) not null check (price >= 0),
  city text not null,
  -- Lista simples de links das fotos, na ordem de exibição.
  -- As imagens em si ficam no Storage do Supabase; aqui só entram as URLs.
  images text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index properties_public_catalog_idx
  on public.properties (status, purpose, property_type, city);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  new.updated_at = now();
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
  status in ('available', 'reserved', 'sold', 'rented')
);

-- Não existe política pública de escrita. Cadastros e edições são feitos no
-- painel do Supabase (Table Editor), pelo cliente.
