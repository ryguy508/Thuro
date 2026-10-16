# Thuro Pest Control

Marketing site and (soon) checkout/customer portal for Thuro Pest Control, served from
`thuroexteriors.com/pest-control/`. Built with [Astro](https://astro.build) (static, fast, SEO-friendly).

## Commands

```bash
npm install
npm run dev      # http://localhost:4321/pest-control/
npm run build    # outputs to dist/
npm run preview
```

## Where things live

| Path | What it is |
|---|---|
| `src/pages/index.astro` | Home page |
| `src/pages/pests/[slug].astro` | One page per pest, generated from `src/data/pests.ts` |
| `src/pages/locations/[slug].astro` | One page per town, generated from `src/data/towns.ts` |
| `src/components/EstimateCard.astro` | ZIP check, then simple estimate form |
| `src/data/site.ts` | Phone, service ZIP codes, license number |
| `src/styles/global.css` | Brand tokens (`--ink #101010`, `--gold #af995b`) and all styles |

Add a pest or town by adding an entry to its data file; the page, links, and sitemap update automatically.

## Subfolder hosting

`astro.config.mjs` sets `base: '/pest-control'`, so every link and asset works under
`thuroexteriors.com/pest-control/`. Routing that path to this site while the rest of the domain stays on
GoHighLevel is done with Cloudflare (DNS + a Worker route). Until then, preview it at its own URL.

## Preview deploys (Cloudflare)

The Cloudflare Workers project `thuro` builds the `claude/affectionate-brown-ej61hd` branch with
`npm run build` and `npx wrangler deploy` (see `wrangler.jsonc`). The build writes to `dist/pest-control/`,
so the preview is served at `<project>.workers.dev/pest-control/`. Every push to the branch redeploys.

## Leads and GoHighLevel

The estimate flow posts to a Cloudflare Worker route (`/pest-control/api/lead`, code in `worker/`), which
creates the contact, custom fields, tags, note, and opportunity in GoHighLevel. Setup steps, the custom
field list, and the tags are in [docs/ghl-setup.md](docs/ghl-setup.md). `npm test` runs the Worker tests.

## Before launch checklist

- Confirm the pest list and what the quarterly plan includes (`src/data/pests.ts`, home page `planIncludes`)
- Confirm service ZIP codes (`src/data/site.ts`)
- Add SC pest control license number (`src/data/site.ts`)
- Add real photos, reviews, and pricing language
- Expand each location page with unique local content
- Connect GoHighLevel (docs/ghl-setup.md): token, custom fields, Cloudflare secrets, workflows
