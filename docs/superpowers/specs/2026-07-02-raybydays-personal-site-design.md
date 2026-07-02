# raybydays.com — Personal Travel & Vlog Site

**Date:** 2026-07-02
**Owner:** Ray
**Status:** Design approved (visual style + architecture)

## Purpose

A personal site at raybydays.com: an intro/about hub plus an ongoing feed
documenting travel and vlogs. Solo-owned, dev-authored, low maintenance.

## Visual Direction (approved)

Bold/modern layout with a warm palette — "Option C layout + Option B colors"
from brainstorming mockups.

- **Canvas:** warm cream (`#fdf6ee`), ink text (`#2e241f`), muted (`#7d6a5f`)
- **Accents:** peach (`#ffd9b0`), sunset orange (`#e8703a`), rose (`#ff6f91`);
  orange→rose gradient on the hero headline and wordmark
- **Feel:** big display type, cinematic featured hero, rounded cards with warm
  hover lift, generous spacing
- **Type:** Fraunces (warm display serif, big headlines) + Inter (body/UI)
- Reference mockup: `.superpowers/brainstorm/*/content/style-v2.html`

## Stack

- **Framework:** Next.js (App Router) + TypeScript
- **Styling:** Tailwind CSS with palette tokens above as CSS variables / theme
- **Content:** MDX files in the repo (no CMS, no DB)
- **Hosting:** Vercel (auto-deploy on push to `main`)
- **Version control:** GitHub
- **Video:** YouTube embeds via a lightweight lite-youtube facade

## Content Model

One MDX file per entry in `content/posts/<slug>.mdx`. Frontmatter:

```yaml
title: string          # "Slow mornings in Arashiyama"
date: YYYY-MM-DD        # sort key, displayed
place: string          # "Kyoto, Japan"
type: "travel" | "vlog"
cover: string          # path/URL to cover image
youtube: string        # YouTube video id (optional; drives vlog embed)
excerpt: string        # 1-line feed summary
```

Body: markdown/MDX — paragraphs, images, occasional embeds. Publishing flow:
add a file → `git commit` → `git push` → Vercel deploys.

Posts are read at build time (filesystem), parsed for frontmatter, sorted by
date desc. Static generation (SSG) — no runtime data fetching.

## Pages / Routes

| Route        | Purpose |
|--------------|---------|
| `/`          | Hero (badge + big gradient headline + intro), featured latest vlog (cinematic block), "Recent days" mixed feed grid |
| `/[slug]`    | Post detail: cover, title/date/place, body, YouTube embed if `type: vlog` |
| `/travels`   | Feed filtered to `type: travel` |
| `/vlogs`     | Feed filtered to `type: vlog` |
| `/about`     | Intro/bio, photo, links (YouTube, Instagram, email) |

Shared: top nav (wordmark + pill links), footer (copyright + social links).

## Components (well-bounded units)

- `PostCard` — feed card: cover, type chip, date/place, title, excerpt. Input: post meta. No internal data fetching.
- `FeaturedVlog` — cinematic hero block for latest vlog: cover + play + caption.
- `LiteYouTube` — click-to-load YouTube facade. Input: video id. Handles reduced-motion / a11y.
- `Nav`, `Footer` — layout chrome.
- `Feed` — grid wrapper mapping posts → `PostCard`. Input: post list.
- `lib/posts.ts` — read/parse MDX from `content/posts`, return typed `Post[]`. Single source of content truth; pages depend on this interface only.

## Content Pipeline

- MDX read + parsed in `lib/posts.ts` (gray-matter for frontmatter; next-mdx-remote or `@next/mdx` for body).
- Type: `Post = { slug, title, date, place, type, cover, youtube?, excerpt, content }`.
- Helpers: `getAllPosts()`, `getPost(slug)`, `getPostsByType(type)`.

## Non-Functional

- **Performance:** SSG, `next/image` (responsive + blur placeholder), lite-youtube facade, minimal JS.
- **SEO:** per-page metadata, Open Graph tags, per-post OG, `sitemap.xml`, `robots.txt`, RSS feed at `/feed.xml`.
- **Accessibility:** semantic HTML, alt text on all images, keyboard-navigable, visible focus, `prefers-reduced-motion` respected, WCAG AA contrast (verify orange-on-cream for small text; darken if needed).
- **Responsive:** mobile-first; feed 1→2→3 columns; hero type scales down.

## Deployment

1. GitHub repo `raybydays` (or similar), push `main`.
2. Vercel project linked to repo → auto-deploy on push; preview deploys on PRs.
3. Add custom domain `raybydays.com` in Vercel; set DNS (A/CNAME per Vercel) at registrar.
4. `www` → apex redirect (or vice versa) configured in Vercel.

## Out of Scope (YAGNI)

No CMS, no database, no comments, no auth, no newsletter/signup, no search,
no analytics beyond Vercel's built-in (optional). Revisit only on real need.

## Success Criteria

- Site live at https://raybydays.com, HTTPS, custom domain resolved.
- Home shows hero + featured vlog + mixed feed in the approved warm/bold style.
- Adding a post = commit one MDX file; it appears in feed + gets its own page.
- Vlog posts embed YouTube; travel posts render photos + text.
- Lighthouse: performance & accessibility ≥ 90 on mobile.
