-- Execute este arquivo no SQL Editor do Supabase quando o projeto for criado.
-- O painel do próprio Supabase será usado para administrar o catálogo.

create extension if not exists "pgcrypto";

create type public.property_purpose as enum ('sale', 'rent');
create type public.property_type as enum ('apartment', 'house', 'commercial', 'land', 'rural');
create type public.property_status as enum ('draft', 'available', 'reserved', 'sold', 'rented', 'inactive');

create table public.properties (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  slug text not null unique,
  title text not null,
  description text not null,
  purpose public.property_purpose not null,
  property_type public.property_type not null,
  status public.property_status not null default 'draft',
  price numeric(14, 2) not null check (price >= 0),
  condominium_fee numeric(12, 2) check (condominium_fee >= 0),
  iptu numeric(12, 2) check (iptu >= 0),
  bedrooms integer check (bedrooms >= 0),
  suites integer check (suites >= 0),
  bathrooms integer check (bathrooms >= 0),
  parking_spaces integer check (parking_spaces >= 0),
  area numeric(10, 2) check (area >= 0),
  built_area numeric(10, 2) check (built_area >= 0),
  furnished boolean not null default false,
  is_development boolean not null default false,
  featured boolean not null default false,
  is_active boolean not null default true,
  is_demo boolean not null default false,
  city text not null,
  neighborhood text,
  state char(2) not null,
  approximate_address text not null,
  latitude double precision,
  longitude double precision,
  amenities text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.property_images (
  id uuid primary key default gen_random_uuid(),
  property_id uuid not null references public.properties(id) on delete cascade,
  url text not null,
  alt text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table public.leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text not null,
  email text,
  message text not null,
  property_id uuid references public.properties(id) on delete set null,
  source text not null default 'contact',
  created_at timestamptz not null default now()
);

create index properties_public_catalog_idx
  on public.properties (is_active, status, purpose, property_type, city);
create index properties_featured_idx
  on public.properties (featured, created_at desc)
  where is_active = true;
create index property_images_property_order_idx
  on public.property_images (property_id, sort_order);

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
alter table public.property_images enable row level security;
alter table public.leads enable row level security;

create policy "Public can read published properties"
on public.properties
for select
to anon, authenticated
using (
  is_active = true
  and status in ('available', 'reserved', 'sold', 'rented')
);

create policy "Public can read images from published properties"
on public.property_images
for select
to anon, authenticated
using (
  exists (
    select 1
    from public.properties
    where properties.id = property_images.property_id
      and properties.is_active = true
      and properties.status in ('available', 'reserved', 'sold', 'rented')
  )
);

-- Não existe política pública de escrita. Cadastros e edições são feitos no
-- painel do Supabase. A API de leads usa a service role somente no servidor.
