# raybydays.com

Personal travel & vlog site for Ray ("Raybydays Dispatch"). Solo-owned, low maintenance.

## Stack

- **Single static page**: `index.html` — all HTML, CSS and JS inline. No build step, no dependencies.
- **GSAP 3.12.5** + ScrollTrigger from cdnjs for scroll animations
- **Google Fonts**: Instrument Serif (display), Manrope (body/UI), JetBrains Mono (labels)
- **Vercel** hosting — static, config in `vercel.json` (no framework, no build, output `.`)

## Deploy

Push to `main` — Vercel is connected to `github.com/raybydays/raybydays` and auto-deploys production.

Preview locally with `python3 -m http.server 3000` from the project root.

(`vercel --prod` also still works for a direct upload, but git push is the normal path.)

## Visual direction

Dark, cinematic, film-grain. Tokens in `:root` of `index.html`:

- ink `#0b0f14`, ink-2 `#111820`, dusk `#1a2430`
- paper `#f2ece1`, paper-dim `#b9b2a6`, paper-faint `#7c766c`
- amber `#e0662f`, amber-lift `#f4a06a`, sky `#7fa3b8`

## Page sections

Nav → hero → statement → anatomy ("How a day becomes…") → route → film → entries ("Recent") → quotes ("Lines I kept") → subscribe CTA → footer.

## Conventions

- Every image has alt text; visible focus; `prefers-reduced-motion` honored.

## History

Previous Next.js 15 + MDX version lives on branch `nextjs-backup`. Its design docs remain in `docs/superpowers/`.
