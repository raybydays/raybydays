# Static hero video card (replaces scroll-jack hero)

## Problem

The in-progress `ScrollHero.tsx` / `components/ui/scroll-expansion-hero.tsx` hijacked wheel and touch scroll to grow a video card from a small thumbnail to full screen. This caused:

- Title text overlapping the video, unreadable via `mix-blend-difference` over a busy video frame
- Scroll-jacking on mobile fighting native momentum scroll
- A large amount of hand-rolled pixel/vw math to keep title, media box, and text in sync

Decision: drop the scroll-driven expand concept entirely in favor of a static hero.

## Design

`components/ui/scroll-expansion-hero.tsx` is deleted (only consumer is `ScrollHero.tsx`). `ScrollHero.tsx` becomes a self-contained, static hero section:

1. **Backdrop**: full-bleed photo from the featured vlog's own `cover` image, `object-cover`, dimmed with `bg-ink/30` overlay. No scroll-linked opacity.
2. **Title**: `"Days on the road, in order."`, centered above the video card, `drop-shadow` for legibility (no blend modes).
3. **Video card**: the existing `LiteYouTube` facade (click-to-load thumbnail + play button — matches the convention already used elsewhere on the site per `CLAUDE.md`), fixed size (`max-w-2xl`, `aspect-video`), identical layout on mobile and desktop. No scroll-driven resizing.
4. **Motion** (via `motion/react`, already a dependency):
   - Card wrapped in `motion.div`: entrance `initial={{ opacity: 0, scale: 0.95 }}` → `animate={{ opacity: 1, scale: 1 }}`, `transition={{ type: "spring", duration: 0.5, bounce: 0.2 }}`.
   - `whileHover={{ scale: 1.02 }}`, `whileTap={{ scale: 0.97 }}` on the card for press feedback (transform-only, hardware accelerated).
   - `children` (subtext + CTA) fade in with a short stagger delay after the card.
5. Respects `prefers-reduced-motion` via `useReducedMotion` — when reduced, skip the entrance animation (render in final state).

## Out of scope

- Porting the marquee ticker from the old `Hero.tsx` (separate, optional follow-up).
- Any change to `LiteYouTube` itself.

## Testing

- Component test: `ScrollHero.tsx` renders title, backdrop image, and a `LiteYouTube` play button for the featured vlog's youtube id; returns `null` when no featured vlog/youtube id exists.
- Manual: visual check at desktop and mobile (390px) widths before commit.
