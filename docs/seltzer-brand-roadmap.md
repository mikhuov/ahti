# Roadmap: A seltzer brand site on SvelteKit + Sanity

This guide explains how to grow this starter (`web/` SvelteKit + `studio/` Sanity) into a brand
site for a seltzer water brand. The marketing team should be able to change most of the site
without a developer.

---

## 1. Guiding principles

1. **Editors own the content, developers own the design system.** Model content as structured
   data (flavours, campaigns, retailers), not as free-form pages full of styling. Editors choose
   *what* appears, and Svelte components decide *how* it looks.
2. **Build pages from sections.** Most brand pages are a stack of sections: hero, product carousel,
   story block, where-to-buy, social feed. Give editors a `pageBuilder` array of section types so
   they can make landing pages for campaigns without new code.
3. **Keep references, don't copy.** A flavour is defined once and referenced from pages, campaigns
   and retailers. Change the can image in one place and it updates everywhere.
4. **Make pages fast and static where possible.** Brand sites are read-heavy. Prerender most
   routes, revalidate them on publish, and use the Sanity image CDN for all imagery.

---

## 2. Content model (Sanity schema)

Put each type in its own file under `studio/schemaTypes/`. Suggested set:

### Core documents

| Type            | Purpose                                        | Key fields                                                                                                                                                                                                 |
| --------------- | ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `siteSettings`  | Singleton for global config                    | brand name, logo, default SEO, social links, navigation, footer, announcement bar                                                                                                                         |
| `flavor`        | One seltzer flavour / SKU family               | name, slug, tagline, description (Portable Text), **brand colour(s)** (colour picker for per-flavour theming), can image, lifestyle images, tasting notes, ingredients, nutrition facts object, pack sizes, `isLimitedEdition`, `availableFrom/Until`, `status` (active / coming soon / retired) |
| `productLine`   | Groups flavours (e.g. "Classic", "Botanicals", "Caffeinated") | title, slug, description, flavours (refs, ordered)                                                                                                                                        |
| `page`          | Generic editor-built pages                     | title, slug, SEO, `pageBuilder` (array of sections)                                                                                                                                                         |
| `campaign`      | Seasonal / launch campaigns                    | title, slug, dates, hero, featured flavours (refs), `pageBuilder`, SEO                                                                                                                                      |
| `retailer`      | Where-to-buy entries                           | name, logo, type (grocery / online / on-premise), URL, regions, stocked flavours (refs)                                                                                                                     |
| `post`          | News / journal (already stubbed)               | title, slug, publishedAt, author, cover image, body, related flavours                                                                                                                                       |
| `aboutUs`       | Brand story                                    | question, answer,                                                                                                                                    |

### Reusable objects

- `seo`: meta title, description, OG image, `noIndex`
- `nutritionFacts`: serving size, calories, sodium, sugar, caffeine, etc. Keep these as structured
  numbers, not free text, so they render the same everywhere.
- `cta`: label plus an internal reference or external URL
- `richImage`: image with required alt text, hotspot/crop enabled

### Page-builder sections (`pageBuilder` members)

`hero`, `flavorCarousel` (refs to flavours), `featureGrid`, `storyBlock` (image + text),
`recipeGrid`, `retailerLocator`, `testimonialStrip`, `newsletterSignup`, `faqBlock`,
`instagramFeed`, `videoBlock`.

Each section maps 1:1 to a Svelte component in `web/src/lib/components/sections/`, and a
`<SectionRenderer>` picks the component from `_type`.

### Studio setup

- Use **Structure Builder** (`structureTool({ structure })`) to make `siteSettings` a singleton
  and to group the sidebar into *Products*, *Marketing*, *Where to buy* and *Journal*.
- Turn on **image hotspots** so can shots crop well on every breakpoint.
- Add **validation** for required alt text, slug uniqueness and campaign date ranges.
- Consider plugins: `@sanity/color-input` (flavour colours), `sanity-plugin-media` (asset library),
  `@sanity/document-internationalization` (if the brand goes multi-market).

---

## 3. Frontend architecture (SvelteKit)

### Routes

```
/                         → home (siteSettings + a "home" page doc)
/flavors                  → all flavours, filter by productLine
/flavors/[slug]           → flavour detail (themed by flavour colour)
/where-to-buy             → retailer list/map, filter by flavour & region
/c/[slug]                 → campaign landing pages
/[...slug]                → catch-all for editor-built `page` docs
```

### Data layer

- Keep GROQ queries in `web/src/lib/server/queries.ts`, one exported query per use case.
- Generate TypeScript types from the schema with **Sanity TypeGen**
  (`npx sanity schema extract && npx sanity typegen generate`) so query results are fully typed.
- Load data in `+page.server.ts` / `+layout.server.ts` and load `siteSettings` once in the
  root layout.
- Use **`@sanity/image-url`** for responsive `srcset`s from the Sanity image CDN.
- Render rich text with **`@portabletext/svelte`**.

### Visual editing & previews

- Add **`@sanity/svelte-loader`** and **`@sanity/visual-editing`** so editors get live preview
  and click-to-edit overlays in Sanity's **Presentation tool**. This matters a lot for a brand
  team building campaign pages.
- Store a read token (`SANITY_API_READ_TOKEN`) in a server-only env var for draft previews.

### Brand/theming

- Put design tokens (type scale, spacing, core palette) in CSS custom properties in `app.css`.
- On flavour pages, set `--flavor-primary` / `--flavor-accent` from the flavour's colour field
  so every flavour page gets its own look without extra code.
- Motion (fizz/bubble effects, can rotation) should respect `prefers-reduced-motion`.

---

## 4. Brand-specific features worth planning for

| Feature                       | CMS side                                           | App side                                                          |
| ----------------------------- | -------------------------------------------------- | ----------------------------------------------------------------- |
| **Flavour finder / quiz**     | `quiz` doc with questions → weighted flavour refs  | Svelte component, result links to flavour page                    |
| **Store locator**             | `retailer` docs with geo points/regions            | Map (MapLibre/Leaflet) + filter by flavour                        |
| **Limited drops / countdown** | `availableFrom/Until` on flavour/campaign           | Countdown component, auto-hide when expired                      |
| **Nutrition & allergens**     | Structured `nutritionFacts` object                  | Accessible nutrition table, JSON-LD `Product` schema              |
| **Newsletter / drops alert**  | Section with copy + list ID                         | Form action → email provider (Klaviyo, Mailchimp)                |
| **E-commerce (optional)**     | Flavours hold a Shopify product ID/handle           | Shopify Storefront API for price/stock/cart; Sanity for storytelling |
| **Age / region gating**       | Only if you add alcoholic variants (hard seltzer)   | Gate in `hooks.server.ts`, per-market content                     |
| **Multi-market / i18n**       | Document internationalization plugin                | Locale-prefixed routes (`/fi`, `/en`) or Paraglide                |

---

## 5. SEO, performance & accessibility

- Generate `<title>`, meta and OG tags from the `seo` object, falling back to `siteSettings`.
- Add **JSON-LD**: `Organization` on every page, `Product` on flavour pages, `Recipe` on recipes.
- Generate `sitemap.xml` and `robots.txt` dynamically from Sanity slugs.
- Prerender static routes (`export const prerender = true`) and use a **Sanity webhook →
  deploy hook** (or ISR on Vercel/Netlify) to rebuild on publish.
- Budget: LCP < 2.5s on mobile. Serve hero can images as AVIF/WebP from the Sanity CDN
  with explicit width and height.
- Require alt text in the schema. Check colour contrast against each flavour's colours.

---

## 6. Suggested milestones

1. **Foundation**
   - Connect a real Sanity project (`.env` files, CORS origin)
   - `siteSettings` singleton, navigation, footer, base layout, design tokens
   - Deploy the Studio (`npm run deploy -w studio`) and the web app (choose an adapter: Vercel,
     Netlify or Node)
2. **Products**
   - `flavor`, `productLine`, `nutritionFacts` schemas
   - `/flavors` and `/flavors/[slug]` with per-flavour theming
   - TypeGen + image-url + Portable Text wired up
3. **Page builder**
   - `page` + first 5–6 sections, `<SectionRenderer>`, catch-all route
   - Home page built entirely in the CMS
4. **Editor experience**
   - Presentation tool + visual editing + draft preview
   - Structure Builder sidebar, validation and helpful field descriptions
5. **Engagement**
   - Where-to-buy, newsletter, campaigns
   - SEO/JSON-LD, sitemap, analytics (Plausible/GA4), consent banner
6. **Growth (optional)**
   - Shopify integration, flavour quiz, i18n, A/B-testable hero variants

---

## 7. Working conventions

- **Schema changes go through code review.** The schema lives in git (`studio/schemaTypes`).
  Use Sanity **migrations** (`npx sanity migration create`) when renaming or removing fields
  that already have content.
- **Datasets:** use `production` for live content and a `development` dataset for schema
  experiments. Switch between them with `SANITY_STUDIO_DATASET` / `PUBLIC_SANITY_DATASET`.
- **Seed content:** keep a small NDJSON export (`npx sanity dataset export`) so new
  developers can import realistic flavours locally.
- **Don't hardcode brand copy in components.** If marketing might want to change it, it
  belongs in Sanity.
