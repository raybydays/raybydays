# raybydays.com

Personal travel & vlog site for Ray. Intro/about hub + an ongoing feed of travel posts and vlogs. Solo-owned, dev-authored, low maintenance.

## Stack

- **Next.js 15** (App Router, TypeScript) — static generation (SSG), no runtime data fetching
- **Tailwind CSS v4** — warm-palette design tokens as CSS variables
- **MDX** content files in `content/posts/` — no CMS, no DB
- **Vercel** hosting (auto-deploy on push to `main`), **GitHub** version control
- **next/font** — Fraunces (display headlines) + Inter (body/UI)
- YouTube via a click-to-load facade (`LiteYouTube`)

## Visual direction

Bold/modern layout + warm palette. Big display type, cinematic featured hero, rounded cards with warm hover lift.

- Canvas cream `#fdf6ee`, ink `#2e241f`, muted `#7d6a5f`
- Accents: peach `#ffd9b0`, orange `#e8703a`, rose `#ff6f91`
- Headline/wordmark gradient: `linear-gradient(90deg, #e8703a, #ff6f91)`
- **Contrast rule:** orange on cream only for large headings/gradient — body text uses ink/muted (WCAG AA).
- Reference mockup: `.superpowers/brainstorm/*/content/style-v2.html`

## Content model

One MDX file per entry: `content/posts/<slug>.mdx`. Frontmatter:

```yaml
title, date (YYYY-MM-DD), place, type (travel|vlog), cover, youtube (optional), excerpt
```

Publishing flow: add a file → `git commit` → `git push` → Vercel deploys. Posts read at build time by `lib/posts.ts`, sorted date desc.

## Structure

- `lib/posts.ts` — single content source of truth. `getAllPosts()`, `getPostsByType(type)`, `getPost(slug)`. Types: `PostType`, `PostMeta`, `Post`.
- `lib/site.ts` — site config (social links, url).
- `components/` — `PostCard`, `Feed`, `FeaturedVlog`, `LiteYouTube`, `Nav`, `Footer`.
- `app/` — `page.tsx` (home: hero + featured vlog + feed), `[slug]/page.tsx` (post detail), `travels/`, `vlogs/`, `about/`, `sitemap.ts`, `robots.ts`, `feed.xml/route.ts`.

## Routes

`/` · `/[slug]` · `/travels` · `/vlogs` · `/about`

## Commands

- `npm run dev` — dev server
- `npm run build` — production build (verify before commit)
- `npm test` — Vitest (content lib + component tests)
- `npm run lint`

## Conventions

- TDD: failing test → minimal impl → pass → commit. Atomic commits per feature.
- Every image has alt text; visible focus; `prefers-reduced-motion` honored.
- SSG only — no runtime fetching, no DB, no CMS.

## Out of scope (YAGNI)

No CMS, DB, comments, auth, newsletter, search. Revisit only on real need.

## Docs

- Design spec: `docs/superpowers/specs/2026-07-02-raybydays-personal-site-design.md`
- Implementation plan: `docs/superpowers/plans/2026-07-02-raybydays-personal-site.md`
