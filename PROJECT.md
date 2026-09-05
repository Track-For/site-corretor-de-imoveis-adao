# Adão Corretor de Imóveis

Site público e catálogo imobiliário em Next.js, React e TypeScript. A interface
consome um contrato de repositório e não depende diretamente do Supabase.

## Desenvolvimento

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Build de produção

```bash
npm run build
npm start
```

## Fonte de dados

Por padrão, `PROPERTY_DATA_SOURCE=local` usa registros demonstrativos de
`lib/data/mock-properties.ts`. Eles são marcados visualmente como demonstração.

Para conectar o Supabase:

1. Crie um projeto no Supabase.
2. Execute `supabase/schema.sql` no SQL Editor.
3. Crie um bucket público para as fotos e salve apenas URLs no banco.
4. Copie `.env.example` para `.env.local`.
5. Preencha URL e chaves.
6. Defina `PROPERTY_DATA_SOURCE=supabase`.

O `next.config.ts` autoriza imagens remotas apenas no caminho público de
Storage do projeto definido em `NEXT_PUBLIC_SUPABASE_URL`.

O cliente administra os registros pelo painel do Supabase. Não há rota `/admin`
nem login no site. A service role é usada apenas pela rota de leads no servidor
e nunca deve receber o prefixo `NEXT_PUBLIC_`.

## Estrutura principal

- `app`: rotas públicas, metadata, sitemap, robots e API de leads
- `components`: navegação, formulários, galeria e cards
- `lib/domain`: contratos de dados
- `lib/repositories`: implementações local e Supabase
- `supabase/schema.sql`: tabelas, índices e políticas RLS
- `public/llms.txt`: resumo para mecanismos generativos

## Conteúdo provisório

As fotos em `public/images` foram geradas como ativos conceituais. A foto de
perfil usa um modelo fictício e não representa Adão. Substitua esses arquivos
pelos materiais reais antes da publicação final.
