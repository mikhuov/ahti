# Technical guide: building the seltzer brand site

## Start here

### Setting up Sanity

1. Make a free account at sanity.io and create a project. Copy the project ID from
   sanity.io/manage.
2. In the project, open **API**:
   - Under **CORS origins**, add `http://localhost:5173` and tick "Allow credentials".
   - Under **Tokens**, create a token with **Viewer** rights and copy it.
3. Copy `studio/.env.example` to `studio/.env`. Fill in the project ID, and `production` as the
   dataset.
4. Copy `sveltekit-app/.env.example` to `sveltekit-app/.env`. Fill in the project ID, the
   dataset and the token.
5. From the repo root, run `npm install`, then `npm run dev`.
6. Open http://localhost:3333 and log in. That's the Studio. The site runs at
   http://localhost:5173.

Create a post in the Studio and publish it, and it shows up on the site. The **Presentation**
tab shows the site inside the Studio, and you can click any text to edit it.

### Svelte basics

Every folder in `sveltekit-app/src/routes/` is a URL: `routes/about/+page.svelte` is `/about`.
A folder in brackets, like `[slug]`, matches anything.

A page has two files. `+page.server.ts` runs a query:

```ts
export const load: PageServerLoad = async ({locals, params}) => {
  const initial = await locals.sanity.loadQuery(FLAVOR_QUERY, {slug: params.slug})
  return {query: FLAVOR_QUERY, params: {slug: params.slug}, options: {initial}}
}
```

`+page.svelte` shows the result. `useQuery` keeps it live while someone edits in the Studio:

```svelte
<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'

  const {data} = $props()
  const query = $derived(useQuery(data))
  const flavor = $derived($query.data)
</script>

{#if flavor}
  <h1>{flavor.name}</h1>
  {#each flavor.tastingNotes ?? [] as note (note)}
    <span>{note}</span>
  {/each}
{/if}

<style>
  h1 {
    font-size: 3rem; /* only affects this page */
  }
</style>
```

Components are just `.svelte` files you import. Put shared ones in `src/lib/` and import them
with `$lib/...`. `+layout.svelte` wraps every page, so the header and footer go there.

Bookmark svelte.dev/tutorial and sanity.io/docs.

---

## About this project

The repo is Sanity's official SvelteKit template (`sanity-io/sanity-template-sveltekit-clean`):

```
sveltekit-app/             the website
  src/hooks.server.ts      sets up loadQuery and preview mode (don't need to touch)
  src/lib/sanity/          client, image helper, queries
  src/routes/              pages
studio/                    Sanity Studio
  schemas/                 content types
```

The template ships with a `post` type, a post list and a post page. Use them as a pattern, then
replace them with the flavour pages below.

The template's code style is 2-space indent, no semicolons and spaces inside braces. The
examples here follow it, so `npm run format` won't rewrite them.

> The local branch `guide-scratch` has complete versions of every schema file in sections 2–5,
> built for an earlier setup. The schemas still work: copy them from `studio/schemaTypes/` there
> into `studio/schemas/` here. Ignore its SvelteKit code, which uses a different data-loading
> pattern.
>
> ```sh
> git show guide-scratch:studio/schemaTypes/documents/flavor.ts
> ```

**Contents**

1. [Connect Sanity from the command line](#1-connect-sanity-from-the-command-line-optional)
2. [Schema: reusable objects](#2-schema-reusable-objects)
3. [Schema: documents](#3-schema-documents)
4. [Schema: page builder](#4-schema-page-builder)
5. [Studio: sidebar and singletons](#5-studio-sidebar-and-singletons)
6. [Typed queries with TypeGen](#6-typed-queries-with-typegen)
7. [Frontend: fetching data](#7-frontend-fetching-data)
8. [Frontend: images and rich text](#8-frontend-images-and-rich-text)
9. [Frontend: rendering page-builder sections](#9-frontend-rendering-page-builder-sections)
10. [Frontend: flavour pages with per-flavour colours](#10-frontend-flavour-pages-with-per-flavour-colours)
11. [SEO and sitemap](#11-seo-and-sitemap)
12. [Deploying](#12-deploying)
13. [Day-to-day workflow](#13-day-to-day-workflow)
14. [Gotchas](#14-gotchas)

---

## 1. Connect Sanity from the command line (optional)

Same as "Setting up Sanity" above, without the website:

```sh
cd studio
npx sanity login
npx sanity projects create "ahti"        # prints the project ID
npx sanity dataset create production
npx sanity cors add http://localhost:5173 --credentials
```

You still need to create the read token on sanity.io/manage.

---

## 2. Schema: reusable objects

Objects are field groups you reuse across documents. Create them in `studio/schemas/objects/`.

**Image with required alt text and hotspot cropping** (`richImage.ts`). Use this everywhere
instead of plain `image`:

```ts
import {defineField, defineType} from 'sanity'

export const richImage = defineType({
  name: 'richImage',
  title: 'Image',
  type: 'image',
  options: {hotspot: true},
  fields: [
    defineField({name: 'alt', title: 'Alt text', type: 'string', validation: (rule) => rule.required()}),
  ],
})
```

**Structured nutrition facts** (`nutritionFacts.ts`). Use numbers, not free text, so the
nutrition table renders the same everywhere:

```ts
export const nutritionFacts = defineType({
  name: 'nutritionFacts',
  title: 'Nutrition facts',
  type: 'object',
  options: {columns: 2},
  fields: [
    defineField({name: 'servingSizeMl', title: 'Serving size (ml)', type: 'number'}),
    defineField({name: 'calories', title: 'Energy (kcal)', type: 'number'}),
    defineField({name: 'sugarG', title: 'Sugar (g)', type: 'number'}),
    defineField({name: 'sodiumMg', title: 'Sodium (mg)', type: 'number'}),
    // carbsG, caffeineMg …
  ],
})
```

**Link that points at a document or a URL** (`cta.ts`). Object-level validation makes sure one
of the two is filled in:

```ts
export const cta = defineType({
  name: 'cta',
  title: 'Link',
  type: 'object',
  fields: [
    defineField({name: 'label', type: 'string', validation: (rule) => rule.required()}),
    defineField({
      name: 'internal',
      type: 'reference',
      to: [{type: 'page'}, {type: 'flavor'}, {type: 'campaign'}, {type: 'aboutUs'}],
    }),
    defineField({name: 'external', type: 'url'}),
  ],
  validation: (rule) =>
    rule.custom((value: {internal?: unknown; external?: string} | undefined) =>
      !value || value.internal || value.external ? true : 'Add an internal or external link',
    ),
})
```

**SEO fields** (`seo.ts`): `title` (warn over 60 chars), `description` (warn over 160),
`image`, `noIndex`. Use `rule.max(60).warning('…')` so editors get a warning without being blocked.

---

## 3. Schema: documents

Create documents in `studio/schemas/documents/`. The main one is `flavor`.

### `flavor.ts` (condensed)

```ts
import {defineArrayMember, defineField, defineType} from 'sanity'

export const flavor = defineType({
  name: 'flavor',
  title: 'Flavour',
  type: 'document',
  // Tabs in the editor
  groups: [
    {name: 'content', title: 'Content', default: true},
    {name: 'product', title: 'Product info'},
    {name: 'availability', title: 'Availability'},
    {name: 'seo', title: 'SEO'},
  ],
  fields: [
    defineField({name: 'name', type: 'string', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'slug', type: 'slug', group: 'content', options: {source: 'name'}, validation: (r) => r.required()}),
    defineField({name: 'productLine', type: 'reference', to: [{type: 'productLine'}], group: 'content'}),
    defineField({name: 'tagline', type: 'string', group: 'content'}),
    defineField({name: 'description', type: 'array', of: [defineArrayMember({type: 'block'})], group: 'content'}),

    // Colour picker from @sanity/color-input, used to theme the flavour page
    defineField({
      name: 'colors',
      type: 'object',
      group: 'content',
      fields: [
        defineField({name: 'primary', type: 'color', validation: (r) => r.required()}),
        defineField({name: 'accent', type: 'color'}),
      ],
    }),

    defineField({name: 'canImage', type: 'richImage', group: 'content', validation: (r) => r.required()}),
    defineField({name: 'tastingNotes', type: 'array', of: [{type: 'string'}], options: {layout: 'tags'}, group: 'product'}),
    defineField({name: 'nutrition', type: 'nutritionFacts', group: 'product'}),

    defineField({
      name: 'status',
      type: 'string',
      group: 'availability',
      options: {
        list: [
          {title: 'Active', value: 'active'},
          {title: 'Coming soon', value: 'comingSoon'},
          {title: 'Retired', value: 'retired'},
        ],
        layout: 'radio',
      },
      initialValue: 'active',
    }),
    defineField({name: 'availableFrom', type: 'datetime', group: 'availability'}),
    defineField({
      name: 'availableUntil',
      type: 'datetime',
      group: 'availability',
      // Cross-field validation: end date can't be before start date
      validation: (rule) => rule.min(rule.valueOfField('availableFrom')),
    }),
    defineField({name: 'seo', type: 'seo', group: 'seo'}),
  ],
  preview: {select: {title: 'name', subtitle: 'tagline', media: 'canImage'}},
})
```

Install the colour picker plugin:

```sh
npm i -w studio @sanity/color-input
```

### Other documents

| File             | Key fields                                                                                  |
| ---------------- | ------------------------------------------------------------------------------------------- |
| `productLine.ts` | `title`, `slug`, `description`, `order` (number used for sorting)                           |
| `page.ts`        | `title`, `slug` (`home` is the front page), `pageBuilder`, `seo`                             |
| `campaign.ts`    | `title`, `slug`, `startsAt`, `endsAt`, `featuredFlavors` (refs), `pageBuilder`, `seo`       |
| `retailer.ts`    | `name`, `logo`, `type` (grocery/online/onPremise), `url`, `regions` (tags), `location` (`geopoint`), `flavors` (refs) |
| `post.ts`        | already in the template; add `relatedFlavors` (refs) and `seo`                               |
| `aboutUs.ts`     | singleton: `title`, `intro`, `heroImage`, `story` (blocks + images), `values[]`, `seo`       |
| `siteSettings.ts`| singleton: `brandName`, `logo`, `navigation` (`cta[]`), `announcement`, `socialLinks`, `footerText`, default `seo` |

**Reference direction rule:** store each relationship on **one** side only. The flavour points
to its product line, and a retailer points to the flavours it stocks. Query the reverse with
`references()` (see §7). Don't keep a second list on the other side, because the two lists
will drift apart.

### Register everything

`studio/schemas/index.ts`:

```ts
export const schemaTypes = [
  // objects
  cta, nutritionFacts, richImage, seo, blockContent,
  // page builder
  pageBuilder, hero, flavorCarousel, storyBlock,
  // documents
  siteSettings, aboutUs, flavor, productLine, page, campaign, retailer, post,
]
```

---

## 4. Schema: page builder

A page is an ordered array of section objects. Editors add, remove and reorder sections, and each
section type maps to one Svelte component.

`studio/schemas/sections/pageBuilder.ts`:

```ts
import {defineArrayMember, defineType} from 'sanity'

export const pageBuilder = defineType({
  name: 'pageBuilder',
  title: 'Sections',
  type: 'array',
  of: [
    defineArrayMember({type: 'hero'}),
    defineArrayMember({type: 'flavorCarousel'}),
    defineArrayMember({type: 'storyBlock'}),
  ],
})
```

A section, `sections/flavorCarousel.ts`:

```ts
export const flavorCarousel = defineType({
  name: 'flavorCarousel',
  title: 'Flavour carousel',
  type: 'object',
  fields: [
    defineField({name: 'heading', type: 'string'}),
    defineField({
      name: 'flavors',
      type: 'array',
      of: [defineArrayMember({type: 'reference', to: [{type: 'flavor'}]})],
      validation: (rule) => rule.min(1).unique(),
    }),
  ],
  // How the section appears in the list inside the editor
  preview: {
    select: {title: 'heading'},
    prepare: ({title}) => ({title: title || 'Flavour carousel', subtitle: 'Flavour carousel'}),
  },
})
```

**To add a new section type:**
1. Create `studio/schemas/sections/<name>.ts`.
2. Add it to `pageBuilder.of` and to `schemaTypes`.
3. Add a GROQ projection if it has references (§7).
4. Create `sveltekit-app/src/lib/components/sections/<Name>.svelte`.
5. Add a branch in `SectionRenderer.svelte` (§9).
6. Run `npm run typegen -w studio`.

---

## 5. Studio: sidebar and singletons

Singletons are documents that should exist exactly once (`siteSettings`, `aboutUs`). To make
them singletons, pin them to a fixed document ID, then hide the "create", "duplicate" and
"delete" options for them.

`studio/structure.ts`:

```ts
import type {StructureResolver} from 'sanity/structure'

export const SINGLETONS = ['siteSettings', 'aboutUs']

export const structure: StructureResolver = (S) =>
  S.list()
    .title('Content')
    .items([
      S.listItem()
        .title('Site settings')
        .id('siteSettings')
        .child(S.document().schemaType('siteSettings').documentId('siteSettings')),
      S.listItem()
        .title('About us')
        .id('aboutUs')
        .child(S.document().schemaType('aboutUs').documentId('aboutUs')),
      S.divider(),
      S.documentTypeListItem('flavor').title('Flavours'),
      S.documentTypeListItem('productLine').title('Product lines'),
      S.divider(),
      S.documentTypeListItem('page').title('Pages'),
      S.documentTypeListItem('campaign').title('Campaigns'),
      S.documentTypeListItem('post').title('Posts'),
      S.divider(),
      S.documentTypeListItem('retailer').title('Retailers'),
    ])
```

In `studio/sanity.config.ts`, keep the template's `presentationTool` and add the rest:

```ts
import {colorInput} from '@sanity/color-input'
import {SINGLETONS, structure} from './structure'

export default defineConfig({
  // …projectId, dataset
  plugins: [
    structureTool({structure}),
    presentationTool({/* keep the template's settings */}),
    visionTool(),
    colorInput(),
  ],
  schema: {
    types: schemaTypes,
    templates: (templates) => templates.filter(({schemaType}) => !SINGLETONS.includes(schemaType)),
  },
  document: {
    actions: (actions, {schemaType}) =>
      SINGLETONS.includes(schemaType)
        ? actions.filter(({action}) => action && ['publish', 'discardChanges', 'restore'].includes(action))
        : actions,
  },
})
```

---

## 6. Typed queries with TypeGen

The template writes TypeScript interfaces for query results by hand (see `Post` in
`queries.ts`). That gets painful fast. TypeGen generates them from the schema and your queries
instead.

Add a `typegen` block to `studio/sanity.cli.ts`:

```ts
export default defineCliConfig({
  api: {/* … */},
  typegen: {
    path: '../sveltekit-app/src/**/*.ts',   // where to look for defineQuery()
    schema: 'schema.json',
    generates: '../sveltekit-app/src/lib/sanity/types.ts',
  },
})
```

Add this script to `studio/package.json`:

```json
"typegen": "sanity schema extract --enforce-required-fields --force && sanity typegen generate"
```

Then:
- Add `schema.json` to `studio/.gitignore`.
- Commit `sveltekit-app/src/lib/sanity/types.ts`, and add it to `.prettierignore` and the
  ESLint ignores.
- Write queries with `defineQuery` instead of the `groq` tag. TypeGen only picks up
  `defineQuery`.

**Run `npm run typegen -w studio` after every schema or query change.** For each query it
generates a `<NAME>_RESULT` type, for example `FLAVOR_QUERY_RESULT`.

---

## 7. Frontend: fetching data

Keep all queries in `sveltekit-app/src/lib/sanity/queries.ts`:

```ts
import {defineQuery} from 'groq'

export const FLAVORS_QUERY = defineQuery(`*[
  _type == "flavor" && status != "retired" && defined(slug.current)
] | order(productLine->order asc, name asc){
  _id,
  name,
  "slug": slug.current,
  tagline,
  status,
  isLimitedEdition,
  canImage,
  "primaryColor": colors.primary.hex,
  "productLine": productLine->{title, "slug": slug.current}
}`)

export const FLAVOR_QUERY = defineQuery(`*[_type == "flavor" && slug.current == $slug][0]{
  ...,
  "primaryColor": colors.primary.hex,
  "accentColor": colors.accent.hex,
  "productLine": productLine->{title, "slug": slug.current},
  // Reverse lookup: every retailer that references this flavour
  "retailers": *[_type == "retailer" && references(^._id)] | order(name asc){_id, name, url}
}`)
```

GROQ techniques used here:

| Need                              | GROQ                                                                 |
| --------------------------------- | -------------------------------------------------------------------- |
| Follow a reference                | `productLine->title`                                                 |
| Follow an array of references     | `flavors[]->{name, "slug": slug.current}`                            |
| Reverse lookup                    | `*[_type == "retailer" && references(^._id)]`                        |
| Rename / flatten                  | `"slug": slug.current`, `"primaryColor": colors.primary.hex`         |
| Per-type projection in page builder | `pageBuilder[]{..., _type == "flavorCarousel" => {flavors[]->{…}}}` |
| Build a URL from a link           | `select(internal->_type == "flavor" => "/flavors/" + internal->slug.current, external)` |
| Optional filter parameter         | `(!defined($flavor) \|\| $flavor in flavors[]->slug.current)`         |

Test queries in the Studio's **Vision** tab before putting them in code.

### Loading a page

Every page follows the same pattern as the template's post page. The server load runs the
query, and the page reads it with `useQuery`.

`sveltekit-app/src/routes/flavors/[slug]/+page.server.ts`:

```ts
import {error} from '@sveltejs/kit'
import {FLAVOR_QUERY} from '$lib/sanity/queries'
import type {FLAVOR_QUERY_RESULT} from '$lib/sanity/types'
import type {PageServerLoad} from './$types'

export const load: PageServerLoad = async ({locals, params}) => {
  const {loadQuery} = locals.sanity
  const initial = await loadQuery<FLAVOR_QUERY_RESULT>(FLAVOR_QUERY, {slug: params.slug})

  if (!initial.data) error(404, 'Flavour not found')

  return {
    query: FLAVOR_QUERY,
    params: {slug: params.slug},
    options: {initial},
    seo: initial.data.seo ?? {title: initial.data.name},
  }
}
```

`sveltekit-app/src/routes/flavors/[slug]/+page.svelte`:

```svelte
<script lang="ts">
  import {useQuery} from '@sanity/sveltekit'
  import type {PageProps} from './$types'

  const {data}: PageProps = $props()
  const query = $derived(useQuery(data))
  const flavor = $derived($query.data)
</script>

{#if flavor}
  <h1>{flavor.name}</h1>
{/if}
```

**Global data** (navigation, footer, announcement) goes in the template's
`routes/+layout.server.ts`, next to `previewEnabled`. Layout data doesn't update live in
preview. That's fine for settings, because they rarely change.

```ts
export const load: LayoutServerLoad = async ({locals, setHeaders}) => {
  const {loadQuery, previewEnabled} = locals.sanity

  // Never cache preview responses: they contain draft content
  if (!previewEnabled) {
    setHeaders({'cache-control': 'public, max-age=60, s-maxage=600, stale-while-revalidate=86400'})
  }

  const settings = await loadQuery<SETTINGS_QUERY_RESULT>(SETTINGS_QUERY)
  return {previewEnabled, settings: settings.data}
}
```

### Route map

```
sveltekit-app/src/routes/
├── +layout.server.ts          siteSettings + previewEnabled (from the template)
├── +page.server.ts            page with slug "home" (replaces the template's post list)
├── [...slug]/                 any other `page` document
├── flavors/                   FLAVORS_QUERY
│   └── [slug]/                FLAVOR_QUERY
├── c/[slug]/                  CAMPAIGN_QUERY (404 outside startsAt/endsAt)
├── about/                     ABOUT_QUERY
├── where-to-buy/              RETAILERS_QUERY, filtered by ?flavor=
├── post/[slug]/               from the template
└── sitemap.xml/+server.ts     SITEMAP_QUERY
```

Specific routes like `/flavors` always win over the `[...slug]` catch-all. `hooks.server.ts`
also adds `/preview/enable` and `/preview/disable`, so don't create pages with those slugs.

---

## 8. Frontend: images and rich text

The template already has `@sanity/image-url` and `@portabletext/svelte`, plus a `urlFor()`
helper in `src/lib/sanity/image.ts`.

**Responsive image component**, `sveltekit-app/src/lib/components/SanityImage.svelte`. It
generates a `srcset` and respects the editor's hotspot/crop:

```svelte
<script lang="ts">
  import type {Image} from '@sanity/types'
  import {urlFor} from '$lib/sanity/image'

  type Props = {
    image: Image & {alt?: string | null}
    width: number
    height?: number
    sizes?: string
    eager?: boolean
  }

  const {image, width, height, sizes = '100vw', eager = false}: Props = $props()

  const WIDTHS = [320, 640, 960, 1280, 1920, 2560]

  function src(w: number) {
    const img = urlFor(image).width(w).auto('format')
    return (height ? img.height(Math.round((w * height) / width)) : img).url()
  }

  const srcset = $derived(
    WIDTHS.filter((w) => w <= width * 2)
      .map((w) => `${src(w)} ${w}w`)
      .join(', '),
  )
</script>

<img
  src={src(width)}
  {srcset}
  {sizes}
  {width}
  {height}
  alt={image.alt ?? ''}
  loading={eager ? 'eager' : 'lazy'}
  fetchpriority={eager ? 'high' : 'auto'}
/>
```

Usage: `<SanityImage image={flavor.canImage} width={600} height={1000} sizes="40vw" eager />`.
Set `eager` only on the image at the top of the page (the LCP image).

**Rich text (Portable Text):**

```svelte
<PortableText value={flavor.description} components={{}} />
```

To render custom blocks, such as images inside the About story, pass `components`:

```svelte
<PortableText value={about.story} components={{types: {richImage: RichImage}}} />
```

The template uses `@portabletext/svelte` v3, where custom components get their data in a
`portableText` prop:

```svelte
<!-- src/lib/components/portable-text/RichImage.svelte -->
<script lang="ts">
  import type {CustomBlockComponentProps} from '@portabletext/svelte'
  import SanityImage from '$lib/components/SanityImage.svelte'
  import type {RichImage} from '$lib/sanity/types'

  const {portableText}: {portableText: CustomBlockComponentProps<RichImage>} = $props()
</script>

<figure><SanityImage image={portableText.value} width={1200} /></figure>
```

---

## 9. Frontend: rendering page-builder sections

`sveltekit-app/src/lib/components/SectionRenderer.svelte`. Checking `section._type` in each
`{#if}` branch narrows the TypeScript type, so every component gets exactly the right props:

```svelte
<script lang="ts">
  import {dev} from '$app/environment'
  import type {PAGE_QUERY_RESULT} from '$lib/sanity/types'
  import FlavorCarousel from './sections/FlavorCarousel.svelte'
  import Hero from './sections/Hero.svelte'
  import StoryBlock from './sections/StoryBlock.svelte'

  type Sections = NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>

  const {sections}: {sections: Sections | null | undefined} = $props()
</script>

{#each sections ?? [] as section (section._key)}
  {#if section._type === 'hero'}
    <Hero {section} />
  {:else if section._type === 'flavorCarousel'}
    <FlavorCarousel {section} />
  {:else if section._type === 'storyBlock'}
    <StoryBlock {section} />
  {:else if dev}
    <p>No component for section type "{(section as {_type: string})._type}"</p>
  {/if}
{/each}
```

A section component takes its prop type straight from the generated query result:

```svelte
<!-- src/lib/components/sections/FlavorCarousel.svelte -->
<script lang="ts">
  import {resolve} from '$app/paths'
  import {stegaClean} from '@sanity/sveltekit'
  import SanityImage from '$lib/components/SanityImage.svelte'
  import type {PAGE_QUERY_RESULT} from '$lib/sanity/types'

  type Section = Extract<
    NonNullable<NonNullable<PAGE_QUERY_RESULT>['pageBuilder']>[number],
    {_type: 'flavorCarousel'}
  >

  const {section}: {section: Section} = $props()
</script>

<section>
  {#if section.heading}<h2>{section.heading}</h2>{/if}
  <ul>
    {#each section.flavors as flavor (flavor._id)}
      <li style:--flavor-primary={stegaClean(flavor.primaryColor)}>
        <a href={resolve('/flavors/[slug]', {slug: flavor.slug})}>
          <SanityImage image={flavor.canImage} width={300} height={500} sizes="300px" />
          {flavor.name}
        </a>
      </li>
    {/each}
  </ul>
</section>
```

The home page then reads the page with `useQuery` (§7) and renders:

```svelte
{#if page}
  <SectionRenderer sections={page.pageBuilder} />
{/if}
```

---

## 10. Frontend: flavour pages with per-flavour colours

Pass the CMS colours to CSS custom properties with `style:`. The CSS then themes the page
without any per-flavour code.

Wrap them in `stegaClean()`. In preview mode, Sanity hides invisible characters inside text
values so the Studio can tell which field is which. That's what makes click-to-edit work, but
it also turns `#ff6600` into invalid CSS.

```svelte
<script lang="ts">
  import {stegaClean} from '@sanity/sveltekit'
  // …useQuery setup from §7
  const primary = $derived(stegaClean(flavor?.primaryColor))
  const accent = $derived(stegaClean(flavor?.accentColor) ?? primary)
</script>

{#if flavor}
  <article class="flavor" style:--flavor-primary={primary} style:--flavor-accent={accent}>
    <h1>{flavor.name}</h1>
    <p class="tagline">{flavor.tagline}</p>
    …
  </article>
{/if}

<style>
  .flavor {
    background: color-mix(in oklab, var(--flavor-primary) 15%, white);
  }
  h1 {
    color: var(--flavor-primary);
  }
  .tagline {
    color: var(--flavor-accent);
  }
</style>
```

Render nutrition as a real `<table>` with `<th scope="row">`, which is better for screen readers
and SEO:

```svelte
{#if flavor.nutrition}
  <table>
    <caption>Per {flavor.nutrition.servingSizeMl} ml</caption>
    <tbody>
      <tr><th scope="row">Energy</th><td>{flavor.nutrition.calories} kcal</td></tr>
      <tr><th scope="row">Sugar</th><td>{flavor.nutrition.sugarG} g</td></tr>
      <tr><th scope="row">Sodium</th><td>{flavor.nutrition.sodiumMg} mg</td></tr>
    </tbody>
  </table>
{/if}
```

---

## 11. SEO and sitemap

**Per-page meta:** every `load` returns a `seo` object next to the query (see §7). The root
layout renders it with `page.data.seo`, falling back to the defaults in `siteSettings`:

```svelte
<!-- routes/+layout.svelte, inside the template's PreviewMode/VisualEditing wrappers -->
<Seo seo={page.data.seo} defaults={data.settings?.seo} brandName={data.settings?.brandName} />
```

```svelte
<!-- src/lib/components/Seo.svelte -->
<script lang="ts">
  import {page} from '$app/state'
  import {stegaClean} from '@sanity/sveltekit'
  import {urlFor} from '$lib/sanity/image'
  import type {Seo} from '$lib/sanity/types'

  type Props = {seo?: Seo | null; defaults?: Seo | null; brandName?: string | null}
  const {seo, defaults, brandName}: Props = $props()

  // Meta tags aren't clickable, so strip the preview markers
  const title = $derived(
    stegaClean(seo?.title ? `${seo.title} | ${brandName}` : (defaults?.title ?? brandName ?? '')),
  )
  const description = $derived(stegaClean(seo?.description ?? defaults?.description))
  const image = $derived(seo?.image ?? defaults?.image)
</script>

<svelte:head>
  <title>{title}</title>
  {#if description}<meta name="description" content={description} />{/if}
  {#if seo?.noIndex}<meta name="robots" content="noindex" />{/if}
  <link rel="canonical" href={page.url.origin + page.url.pathname} />
  <meta property="og:title" content={title} />
  {#if image?.asset}
    <meta property="og:image" content={urlFor(image).width(1200).height(630).url()} />
  {/if}
</svelte:head>
```

**Sitemap:** `routes/sitemap.xml/+server.ts`. It doesn't need live preview, so it uses the
plain client:

```ts
export const SITEMAP_QUERY = defineQuery(`*[
  _type in ["page", "flavor", "campaign"] && defined(slug.current) && seo.noIndex != true
]{
  _updatedAt,
  "path": select(
    _type == "flavor" => "/flavors/" + slug.current,
    _type == "campaign" => "/c/" + slug.current,
    slug.current == "home" => "/",
    "/" + slug.current
  )
}`)
```

```ts
import {client} from '$lib/sanity/client'
import {SITEMAP_QUERY} from '$lib/sanity/queries'
import type {SITEMAP_QUERY_RESULT} from '$lib/sanity/types'
import type {RequestHandler} from './$types'

export const GET: RequestHandler = async ({url}) => {
  const docs = await client.fetch<SITEMAP_QUERY_RESULT>(SITEMAP_QUERY, {}, {stega: false})
  const urls = docs.map(
    (doc) => `<url><loc>${url.origin}${doc.path}</loc><lastmod>${doc._updatedAt}</lastmod></url>`,
  )
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.join('')}</urlset>`,
    {headers: {'content-type': 'application/xml'}},
  )
}
```

---

## 12. Deploying

**Studio.** Sanity hosts it for free at `<name>.sanity.studio`:

```sh
npm run deploy -w studio
```

**Web app (Vercel example):**

```sh
npm i -D -w sveltekit-app @sveltejs/adapter-vercel
```

Swap the adapter in `sveltekit-app/svelte.config.js`:

```js
import adapter from '@sveltejs/adapter-vercel'
```

- In Vercel, set the **Root Directory** to `sveltekit-app` and add all the variables from
  `sveltekit-app/.env`. Set `PUBLIC_SANITY_STUDIO_URL` to the deployed Studio URL.
- In the Studio's env (or `studio/.env` before deploying), set `SANITY_STUDIO_PREVIEW_URL` to
  the live site so the Presentation tab shows production.
- Allow the production domain (run in `studio/`):
  `npx sanity cors add https://your-domain.com --credentials`

**Content updates:** published content appears within about 10 minutes, because of the
`s-maxage=600` cache header (§7). No rebuild is needed. For instant updates, add a Sanity webhook
(Project → API → Webhooks) that calls a purge hook on your host.

---

## 13. Day-to-day workflow

| Task                           | Command / action                                                  |
| ------------------------------ | ----------------------------------------------------------------- |
| Run everything                 | `npm run dev`                                                     |
| After schema or query changes  | `npm run typegen -w studio`                                       |
| Check the site                 | `npm run check -w sveltekit-app` and `npm run lint -w sveltekit-app` |
| Format everything              | `npm run format`                                                  |
| Try a query                    | Studio → Vision tab                                               |
| Preview drafts on the site     | Studio → Presentation tab                                         |
| Rename or remove a field that has data | `npx sanity migrations create` (in `studio/`), then run it |
| Back up content                | `npx sanity dataset export production backup.tar.gz`              |
| Safe place for schema experiments | `npx sanity dataset create development`, then point both `.env` files at it |

---

## 14. Gotchas

- **`stegaClean()` for anything that isn't displayed text.** In preview, strings carry
  invisible markers. Clean them before using a value in CSS, in comparisons
  (`stegaClean(flavor.status) === 'comingSoon'`), in URLs you build by hand, or in meta tags.
- **Don't cache preview responses.** Only set `cache-control` when `previewEnabled` is false
  (§7). Otherwise a CDN can serve draft content to the public.
- **The read token is secret.** It lives in `SANITY_API_READ_TOKEN`, which has no `PUBLIC_`
  prefix, so SvelteKit keeps it on the server. Never rename it to `PUBLIC_…`.
- **Line endings on Windows:** `.gitattributes` has `* text=auto`, so Git checks files out
  with CRLF line endings and `prettier --check` can fail on a fresh clone. Fix: change the line
  to `* text=auto eol=lf`.
- **Portable Text versions:** the template uses v3, where custom components receive a
  `portableText` prop. If you upgrade to v4, components receive `value` directly.
- **Old-style components in the template.** `Card.svelte` uses `export let post`, which is the
  Svelte 4 syntax. It still works, but write new components with `$props()`.
- **Keep brand copy out of components.** If marketing might want to change a piece of text,
  put it in a schema field.
