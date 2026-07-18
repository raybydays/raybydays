# Homepage Editorial Redesign — Design Spec

Date: 2026-07-18
Status: Approved, ready for implementation planning

## Context

Current homepage (`app/page.tsx`) uses `ScrollHero` (an uncommitted scroll-expansion hero built from a third-party component) → `FeaturedVlog` → dark numbered `Feed` → `AboutTeaser`. It follows a prior "Home v3" spec (`docs/superpowers/specs/2026-07-02-raybydays-personal-site-design.md`) with a warm palette (cream/ink/peach/orange/rose, Fraunces + Inter).

Feedback: homepage feels generic/templated and lacks polish/motion. This spec redoes the homepage applying Emil Kowalski's design-engineering principles (intentional easing/timing, restrained accent color, origin-aware interactions, performance-safe animation) while pushing the visual identity toward a **hiking / sunrise / summit / travel** feel — which the existing peach→orange→rose gradient already suits.

Direction chosen: **Refined Editorial** — confident Fraunces typography, asymmetric layouts, restrained gradient accent, paced light/dark section rhythm. Not a full palette rewrite; the sunrise-gradient identity is kept and leaned into via imagery.

`ScrollHero` and its dependency (`components/ui/scroll-expansion-hero.tsx`, `motion`, `@phosphor-icons/react`) are dropped in favor of a static photo-led hero.

## Sections

### 1. Hero

- Full-bleed (or near-full-bleed) photo — sunrise/summit/trail shot. Placeholder image for now; real asset to be swapped in later.
- Dark gradient overlay on the bottom third only, for text legibility — not a flat scrim over the whole image.
- Headline: current place name, Fraunces, clamp(80px, ~10vw, 120px), white/cream (not ink — must read over photo). Peach→orange→rose gradient applied to the place name or a thin accent line only, echoing the sunrise in the photo — not the whole headline.
- Subhead: one short line, muted white/cream, Inter, editorial voice (drawn from Ray's established voice — warm, authentic, no emoji).
- Location marquee (existing `animate-marquee` keyframe) restyled as a thin, semi-transparent ticker strip at the very bottom edge of the hero — reads like a trail marker/GPS ticker rather than competing with the headline.
- Entrance: headline + subhead fade + `translateY(8px)`, staggered ~60ms apart, `ease-out`, 300–400ms, first paint only. Image itself does not fade (avoids flash).

### 2. Featured Vlog

- Two-column asymmetric layout: thumbnail ~58%, text ~42% (not 50/50).
- Thumbnail via existing `LiteYouTube` facade. Hover: `scale(1.02)` on the image only, `ease-out` 200ms, gated `(hover: hover) and (pointer: fine)`. Play icon gets `:active { scale(0.97) }` press feedback.
- Eyebrow label ("Featured" / "Latest vlog"): small tracked-caps, muted, with an orange accent dot or underline (ties to hero accent without repeating full gradient).
- Title: Fraunces 40–56px. Excerpt: Inter/muted. Place name: small pill tag (peach bg, ink text) — passport-stamp feel.
- No card-level shadow/lift. Editorial layouts read flatter than app-UI cards — motion lives in the thumbnail and pill, not a floating-card illusion.

### 3. Feed (numbered post list, dark section)

- Retains `bg-ink` dark section — contrast beat against the light hero/about sections; paces the page.
- Eyebrow "Recent days": tracked caps + small 1px orange underline (24px wide).
- Each row: number (01, 02…) Fraunces, `text-bg/40`; place + date small caps; title larger Fraunces; hairline row divider (~8% white on dark).
- Hover (gated `(hover: hover) and (pointer: fine)`): title brightens to white/peach, number opacity 40%→70%, left-border accent (orange, 2px) sweeps in via `clip-path: inset(0 0 0 100%)` → `inset(0 0 0 0)`, 150ms ease-out. No scale on rows — lists shouldn't jump.
- Cover thumbnail (if present): small, 64–80px square, rounded-sm, left of the number — keeps list feel, not card-grid feel.
- List entrance: stagger fade + `translateY(8px)`, 40ms between rows, triggered once via `IntersectionObserver` on first scroll into view.

### 4. About Teaser + Footer

- About Teaser on light `bg` canvas: 1–2 sentence personal line, Fraunces italic/medium, 32–40px, left-aligned (not centered). Generous vertical padding.
- "Read more →" link: underline sweep left-to-right on hover (150ms), not a default underline snap.
- Optional trail/portrait photo thumbnail, offset and slightly rotated (-2deg) for a handmade/journal feel vs. a perfectly aligned grid.
- Footer: dark (`ink`) bg, bookending the dark feed section — gives the page a light→dark→light→dark cadence. Large gradient wordmark ("raybydays", peach→orange→rose, Fraunces) stays dominant. Social/nav links: small tracked caps, muted → full ink/white on hover via opacity/color only (150ms ease), no underline.

## Global motion/interaction rules

- Easing tokens added to `app/globals.css`:
  - `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`
  - `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`
  - Never `ease-in` on UI animation.
- Durations: hover/press 150–200ms; entrance stagger items 300–400ms; scroll-reveal 400ms max. Nothing on this page exceeds 400ms.
- Press feedback: every clickable element (nav links, play button, "read more", footer links) gets `:active { transform: scale(0.97) }` at 150ms — excludes plain text.
- Entrance animations use `@starting-style` where supported, falling back to the codebase's existing `data-mounted` pattern. First paint / first scroll-into-view only — never replay on re-render.
- `transform-origin` on any future popover-like element anchors to its trigger (none planned on homepage currently).
- `prefers-reduced-motion: reduce`: disable marquee (already handled via existing `.animate-marquee` media query), disable stagger/`translateY` entrances (fall back to opacity-only fade), disable hover scale on thumbnails (color-only feedback remains).
- Only `transform`, `opacity`, and `clip-path` are animated — no `width`/`height`/`padding`/`margin` transitions.
- All hover-only effects gated behind `(hover: hover) and (pointer: fine)`.

## Out of scope

- Travels/vlogs/about/post-detail pages — homepage only, per this task.
- Real hero photography — placeholder used for now.
- Palette overhaul — kept the existing warm/sunrise tokens; no new color values introduced.
- Nav component changes beyond what's needed for footer hover consistency.

## Files affected

- `app/page.tsx` — restructure hero usage, section order unchanged.
- `components/Hero.tsx` — rebuilt for photo-led editorial hero (replaces current implementation).
- `components/ScrollHero.tsx`, `components/ui/scroll-expansion-hero.tsx` — deleted.
- `components/FeaturedVlog.tsx` — asymmetric layout, hover/press states.
- `components/PostCard.tsx`, `components/Feed.tsx` — row hover/entrance treatment.
- `components/AboutTeaser.tsx` — layout + link underline sweep.
- `components/Footer.tsx` — hover treatment on links (wordmark mostly unchanged).
- `app/globals.css` — add easing tokens, remove any now-unused animation utilities tied to `ScrollHero`.
- `package.json` — remove `motion`, `@phosphor-icons/react` if unused elsewhere after `ScrollHero` removal.
