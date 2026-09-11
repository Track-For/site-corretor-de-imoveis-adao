# Guia de cadastro de imóveis pelo Supabase

Este guia é para quem vai cadastrar e editar os imóveis direto pelo painel
do Supabase (Table Editor), sem precisar de nenhum sistema extra.

## Onde cadastrar

1. Acesse o [supabase.com](https://supabase.com/dashboard) e entre no projeto do site.
2. No menu à esquerda, clique em **Table Editor**.
3. Escolha a tabela **properties**.
4. Para adicionar um imóvel novo, clique em **Insert** → **Insert row**.
   Para editar um já existente, clique na linha e depois no campo que quer mudar.

## Campos obrigatórios

Esses campos precisam estar preenchidos, senão o Supabase não deixa salvar:

| Campo | O que é |
|---|---|
| `titulo` | Título curto do imóvel. Texto livre. |
| `descricao` | Descrição completa do imóvel. Texto livre. |
| `finalidade` | `venda` ou `aluguel` (aparece como lista pra escolher). |
| `tipo_imovel` | `apartamento`, `casa`, `comercial`, `terreno` ou `rural` (lista pra escolher). |
| `preco` | Valor do imóvel. Ver regra de formato abaixo. |
| `cidade` | Cidade do imóvel. Texto livre. |

`slug` não é mais obrigatório — ver abaixo.

## `slug`: gerado automaticamente

O `slug` é a parte da URL que identifica o imóvel
(`seusite.com/imoveis/vila-alzira`). **Deixe o campo em branco** ao cadastrar:
ele é gerado sozinho a partir do `titulo` (minúsculo, sem acento, espaços
viram hífen). Se o resultado já existir em outro imóvel, é salvo com um
número no final (`-2`, `-3`...) para continuar único.

| `titulo` | `slug` gerado |
|---|---|
| `Vila Alzira` | `vila-alzira` |
| `Apartamento 2 Quartos - Centro` | `apartamento-2-quartos-centro` |

Só preencha o `slug` na mão se quiser uma URL diferente do título — nesse
caso, qualquer texto digitado também é normalizado automaticamente
(maiúscula, acento e símbolo são convertidos, nunca dá erro de formato).

⚠️ Editar o `titulo` de um imóvel já cadastrado **não muda** o slug salvo —
isso evita quebrar um link já compartilhado. Para gerar um slug novo a
partir do título atual, apague o conteúdo do campo `slug` e salve de novo.

### Como conferir se a geração automática está ativa

Depois de rodar a migração `2026-09-11-slug-automatico.sql`, confirme no
**SQL Editor** do projeto:

```sql
select tgname from pg_trigger where tgrelid = 'public.properties'::regclass;
select proname from pg_proc where proname in ('generate_slug', 'properties_set_slug');
```

Deve aparecer o trigger `properties_set_slug` e as duas funções. Ou teste na
prática: edite um imóvel existente, apague o `slug`, salve, e veja se ele
reaparece preenchido sozinho a partir do `titulo`.

## `preco`: regras de formato

Use **ponto** como separador decimal, não vírgula — é assim que o banco de
dados entende número, mesmo o site mostrando o preço com vírgula depois
(padrão brasileiro).

| Escreveu no Supabase | Aparece no site |
|---|---|
| `450000` | R$ 450.000 |
| `450000.00` | R$ 450.000 |
| `450000.50` | R$ 450.000,50 |

Não use ponto como separador de milhar (`450.000` seria interpretado como
"450 vírgula zero zero zero", ou seja, R$ 450). Não use vírgula em nenhuma
posição.

## `status`

Campo opcional, mas **é o que decide se o imóvel aparece no site**:

| Valor | O que faz |
|---|---|
| `disponivel` | Aparece no catálogo normalmente. |
| `reservado` | Aparece no catálogo, marcado como reservado. |
| `vendido` | Aparece no catálogo, marcado como vendido. |
| `alugado` | Aparece no catálogo, marcado como alugado. |
| `rascunho` | **Não aparece no site.** Fica só salvo, escondido. |
| `inativo` | **Não aparece no site.** Usado pra arquivar sem apagar. |

Se você deixar o campo `status` em branco ao cadastrar, ele entra como
`rascunho` por padrão — ou seja, **o imóvel fica invisível no site até você
mudar o status manualmente**. Sempre confira esse campo depois de cadastrar.

## Fotos (`imagem_1` a `imagem_5`)

Cada imóvel tem 5 campos de foto, na ordem em que aparecem no site.
`imagem_1` é a foto de capa (a que aparece primeiro no catálogo).

As fotos em si **não vão dentro da tabela** — só a URL delas. O arquivo fica
guardado no **Storage** do Supabase.

### Passo a passo pra subir uma foto e pegar a URL

1. No menu à esquerda do Supabase, clique em **Storage**.
2. Abra o bucket **`property-images`**.
3. Clique em **Upload file** (ou arraste a foto para dentro da área de
   arquivos) e escolha a foto no seu computador.
4. Espere o upload terminar — o arquivo aparece na lista.
5. Clique no arquivo que acabou de subir para abrir o painel de detalhes.
6. Clique em **Copy URL** (ou no ícone de link/três pontinhos → **Get URL** /
   **Copy URL**, dependendo da versão do painel). Isso copia a URL pública
   do arquivo.
7. Volte no **Table Editor**, na tabela **properties**, e cole essa URL no
   campo `imagem_1` (capa), `imagem_2`, etc.
8. Repita para cada foto do imóvel.

Pode deixar em branco os campos de foto que não tiver (não precisa preencher
os 5). Só não cole ali nada que não seja o link de uma foto.

## Vídeo (`video_url`)

Mesma lógica das fotos, mas usando o bucket **`property-videos`**:

1. **Storage** → abra o bucket **`property-videos`**.
2. **Upload file** e escolha o arquivo `.mp4` do vídeo.
3. Depois do upload, clique no arquivo e em **Copy URL**.
4. Cole a URL no campo `video_url` do imóvel, no Table Editor.

Deixe `video_url` em branco se o imóvel não tiver vídeo.

⚠️ Atenção: esse campo é só para vídeo (arquivo `.mp4`). Se colar aqui o link
de uma foto por engano, o site vai tentar tocar a foto como vídeo e vai
aparecer quebrado.

## Como excluir um imóvel

1. **Table Editor** → tabela **properties**.
2. Marque o checkbox à esquerda da linha do imóvel que quer remover (pode
   marcar mais de um de uma vez).
3. Clique no ícone de lixeira (**Delete rows**) que aparece no topo da
   tabela.
4. Confirme a exclusão.

⚠️ Isso só apaga o registro da tabela — não apaga as fotos/vídeo desse
imóvel no **Storage**. Se quiser liberar espaço, apague os arquivos
correspondentes direto nos buckets `property-images` e `property-videos`.
Se preferir só tirar o imóvel do site sem excluir nada, mude o `status` para
`inativo` em vez de apagar a linha.

## Erros comuns (o que fazer se der erro ao salvar)

| Erro / sintoma | Causa provável | Como corrigir |
|---|---|---|
| Dois imóveis com títulos parecidos e a URL de um ficou com `-2` no final | Colisão de slug gerado automaticamente | Normal, não precisa corrigir — se quiser uma URL diferente, edite o `slug` na mão |
| Imóvel não aparece no catálogo | `status` está como `rascunho` ou `inativo` | Mude o `status` para `disponivel` (ou outro valor da lista pública) |
| Preço aparece errado no site | Usou vírgula ou ponto de milhar no `preco` | Reescreva usando só ponto como separador decimal (ex.: `450000.00`) |
| Vídeo aparece quebrado na página | `video_url` está com o link de uma foto | Cole o link correto do arquivo de vídeo, ou deixe o campo em branco |
| "column ... violates not-null constraint" | Um dos campos obrigatórios ficou em branco | Preencha `titulo`, `descricao`, `finalidade`, `tipo_imovel`, `preco` e `cidade` |

## Checklist rápido pra cada imóvel novo

1. `titulo` e `descricao` preenchidos
2. `finalidade` e `tipo_imovel` escolhidos na lista
3. `preco` com ponto (não vírgula) se tiver centavos
4. `cidade` preenchida
5. `slug` em branco (gera sozinho) — só preencha se quiser uma URL customizada
6. `status` definido como `disponivel` (senão fica invisível)
7. Fotos coladas em `imagem_1` a `imagem_5` (pelo menos a capa)
8. `video_url` só se realmente tiver um vídeo desse imóvel
