# Locale content files

English and Arabic content are kept in parallel JSON files. For locale `sa_ar`, the app loads the `.ar.json` variant when it exists.

## Naming convention

| English | Arabic |
|---------|--------|
| `filename.json` | `filename.ar.json` |

## Files by page / feature

| File | Used on |
|------|---------|
| `content.json` / `content.ar.json` | Header nav, article pages, sidebar, more-to-read |
| `homepage.json` / `homepage.ar.json` | Homepage hero, section titles, CTA labels |
| `blogList.json` / `blogList.ar.json` | Kitchen blog listing + homepage blog cards |
| `faq.json` / `faq.ar.json` | FAQ page |
| `footer.json` / `footer.ar.json` | Site footer (all pages) |
| `eCatalogue.json` / `eCatalogue.ar.json` | E-Catalogue page |
| `installationGuides.json` / `installationGuides.ar.json` | Installation guides page header + category labels |
| `builtInProducts.json` / `builtInProducts.ar.json` | Built-in products page hero + category tab names |
| `products.json` / `products.ar.json` | Product names (installation guides + built-in products) |
| `recProducts.json` / `recProducts.ar.json` | Homepage recommended products |
| `kitchenLayouts.json` / `kitchenLayouts.ar.json` | Homepage interactive kitchen layouts |

## Blog articles (optional per slug)

- `blogs/{slug}.json` — English-only article override
- `blogs/{slug}.ar.json` — Arabic-only article override (create when needed)

If no blog file exists for a slug, the main article falls back to `content.json` / `content.ar.json`.

## Loader API

```js
import { loadLocaleJson, getContent, loadBlogContent } from '@/lib/locale';

const data = await loadLocaleJson(locale, 'faq');
const content = await getContent(locale); // same as loadLocaleJson(locale, 'content')
```

## Updating copy

1. Edit the English file (e.g. `faq.json`).
2. Mirror changes in the matching Arabic file (e.g. `faq.ar.json`).
3. Run the dev server and switch EN/AR in the header to verify.

To refresh Arabic product/layout strings from English after bulk edits, run:

```bash
node scripts/translate-ar-data.mjs
```

Then review and refine `products.ar.json` and `kitchenLayouts.ar.json` manually.
