# Homepage Editorial Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redo the raybydays.com homepage as a photo-led editorial design (sunrise/summit/hiking mood, warm palette kept) with Emil Kowalski's motion/interaction principles applied throughout, replacing the current `ScrollHero`-based hero.

**Architecture:** Static Next.js App Router page (`app/page.tsx`) composed of four presentational sections (`Hero`, `FeaturedVlog`, `Feed`/`PostCard`, `AboutTeaser`, `Footer`). No new data layer — all sections consume `PostMeta`/`Post` from the existing `lib/posts.ts`. Motion is CSS-first (transitions, `@keyframes`, `clip-path`) with one small client component (`Feed`) using `IntersectionObserver` for scroll-triggered entrance; no animation library is introduced.

**Tech Stack:** Next.js 15 (App Router), TypeScript, Tailwind CSS v4, Vitest + Testing Library, `next/image`.

## Global Constraints

- Only `transform`, `opacity`, and `clip-path` are animated — never `width`/`height`/`padding`/`margin`.
- No `ease-in` on any UI animation. Custom easing tokens: `--ease-out: cubic-bezier(0.23, 1, 0.32, 1)`, `--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1)`.
- Durations: hover/press 150–200ms; entrance/stagger 300–400ms. Nothing exceeds 400ms.
- `prefers-reduced-motion: reduce` must keep opacity fades but strip all `translateY`/`scale`/`clip-path` movement.
- Existing palette tokens (`--bg`, `--ink`, `--muted`, `--peach`, `--orange`, `--rose`, `--card`, `--line`) in `app/globals.css` are unchanged — only additive tokens/classes.
- `images.unsplash.com` is the only external image host already allowlisted in `next.config.ts` — reuse it for the placeholder hero photo.
- Homepage only (`app/page.tsx` and the components it renders). Do not touch `travels/`, `vlogs/`, `about/`, or post-detail pages, beyond `PostCard`/`Feed` being shared components.
- Keep `components/PostCard.test.tsx` passing without modification (accessible name, link `href`, image alt text must stay stable).

---

### Task 1: Motion tokens + remove ScrollHero

**Files:**
- Modify: `app/globals.css` (full file, 26 lines currently)
- Modify: `app/page.tsx:1-33`
- Delete: `components/ScrollHero.tsx`
- Delete: `components/ui/scroll-expansion-hero.tsx` (and the now-empty `components/ui/` directory)
- Modify: `package.json` (remove `motion`, `@phosphor-icons/react` from `dependencies`)

**Interfaces:**
- Produces: CSS custom properties `--ease-out`, `--ease-in-out` and utility classes `.fade-up`, `.fade-up-delay-1`, `.fade-up-delay-2`, `.press`, `.feed-row`, `.accent-bar`, `.thumb-hover`, `.sweep-link` — consumed by Tasks 2–5.
- Consumes: nothing new. `app/page.tsx` still imports `Hero` from `@/components/Hero` (existing export, rebuilt in Task 2).

- [ ] **Step 1: Replace `app/globals.css` with the version including motion tokens**

```css
@import "tailwindcss";
@plugin "@tailwindcss/typography";

:root {
  --bg:#fdf6ee; --ink:#2e241f; --muted:#7d6a5f;
  --peach:#ffd9b0; --orange:#e8703a; --rose:#ff6f91;
  --card:#fffaf3; --line:#f0e2d2;
  --ease-out: cubic-bezier(0.23, 1, 0.32, 1);
  --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
}
@theme inline {
  --color-bg: var(--bg); --color-ink: var(--ink); --color-muted: var(--muted);
  --color-peach: var(--peach); --color-orange: var(--orange); --color-rose: var(--rose);
  --color-card: var(--card); --color-line: var(--line);
  --font-sans: var(--font-inter); --font-display: var(--font-fraunces);
}

@keyframes marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.animate-marquee {
  animation: marquee 32s linear infinite;
}

@keyframes fade-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}
@keyframes fade-reduced {
  from { opacity: 0; }
  to { opacity: 1; }
}

.fade-up {
  opacity: 0;
  animation: fade-up 350ms var(--ease-out) forwards;
}
.fade-up-delay-1 { animation-delay: 60ms; }
.fade-up-delay-2 { animation-delay: 120ms; }

.press {
  transition: transform 150ms var(--ease-out);
}
.press:active {
  transform: scale(0.97);
}

.feed-row {
  opacity: 0;
  transform: translateY(8px);
}
[data-in-view] .feed-row {
  animation: fade-up 350ms var(--ease-out) forwards;
  animation-delay: calc(var(--i, 0) * 40ms);
}

.accent-bar {
  clip-path: inset(0 0 0 100%);
  transition: clip-path 150ms var(--ease-out);
}

.thumb-hover {
  transition: transform 200ms var(--ease-out);
}

.sweep-link {
  position: relative;
  text-decoration: none;
}
.sweep-link::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: -2px;
  height: 1px;
  width: 100%;
  background: var(--orange);
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 150ms var(--ease-out);
}

@media (hover: hover) and (pointer: fine) {
  .feed-row:hover .accent-bar { clip-path: inset(0 0 0 0); }
  .vlog-link:hover .thumb-hover { transform: scale(1.02); }
  .sweep-link:hover::after { transform: scaleX(1); }
}

@media (prefers-reduced-motion: reduce) {
  .animate-marquee { animation: none; }
  .fade-up { animation: fade-reduced 350ms ease forwards; }
  [data-in-view] .feed-row {
    animation: fade-reduced 350ms ease forwards;
    animation-delay: calc(var(--i, 0) * 40ms);
    transform: none;
  }
  .thumb-hover { transition: none; }
}
```

- [ ] **Step 2: Delete the ScrollHero files**

```bash
rm components/ScrollHero.tsx
rm -r components/ui
```

- [ ] **Step 3: Swap `ScrollHero` for `Hero` in `app/page.tsx`**

```tsx
import { getAllPosts, getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";
import { FeaturedVlog } from "@/components/FeaturedVlog";
import { Hero } from "@/components/Hero";
import { AboutTeaser } from "@/components/AboutTeaser";

export default function Home() {
  const posts = getAllPosts();
  const featured = getPostsByType("vlog")[0];
  return (
    <main>
      <Hero currentPlace="Singapore" />

      {featured && <FeaturedVlog post={featured} />}

      <section id="feed" className="bg-ink">
        <div className="mx-auto max-w-5xl px-7 py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2
              className="font-display font-normal uppercase text-bg/40"
              style={{ letterSpacing: "0.22em", fontSize: "15px" }}
            >
              Recent days
            </h2>
          </div>
          <Feed posts={posts} theme="dark" />
        </div>
      </section>

      <AboutTeaser />
    </main>
  );
}
```

- [ ] **Step 4: Remove unused deps from `package.json` and reinstall**

Edit `package.json` `dependencies` block to remove the `"@phosphor-icons/react": "^2.1.10",` and `"motion": "^12.42.2",` lines (they were only used by the deleted `components/ui/scroll-expansion-hero.tsx`), then run:

```bash
npm install
```

Expected: `package-lock.json` updates to drop the two packages; no other dependency changes.

- [ ] **Step 5: Verify build and existing tests still pass**

Run: `npm run build && npm test`
Expected: build succeeds (no missing `ScrollHero`/`motion`/`@phosphor-icons` import errors), all existing tests pass.

- [ ] **Step 6: Commit**

```bash
git add app/globals.css app/page.tsx package.json package-lock.json
git rm components/ScrollHero.tsx
git rm -r components/ui
git commit -m "refactor: drop ScrollHero, add motion tokens to globals.css"
```

---

### Task 2: Rebuild Hero as a photo-led editorial hero

**Files:**
- Modify: `components/Hero.tsx:1-40` (full rewrite)
- Create: `components/Hero.test.tsx`

**Interfaces:**
- Consumes: `.fade-up`, `.fade-up-delay-1`, `.fade-up-delay-2`, `.animate-marquee` from `app/globals.css` (Task 1).
- Produces: `Hero({ currentPlace: string })` — same signature as before, still imported by `app/page.tsx` (Task 1, Step 3) as `import { Hero } from "@/components/Hero"`.

- [ ] **Step 1: Write the failing test**

```tsx
import { render, screen } from "@testing-library/react";
import { Hero } from "./Hero";

it("renders the current place, subhead copy, and hero photo alt text", () => {
  render(<Hero currentPlace="Singapore" />);
  expect(screen.getByRole("heading", { name: /Currently in Singapore/i })).toBeInTheDocument();
  expect(screen.getByText(/summits worth the climb/i)).toBeInTheDocument();
  expect(screen.getByRole("img", { name: /sunrise/i })).toBeInTheDocument();
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Hero.test.tsx`
Expected: FAIL — current `Hero.tsx` renders "Days on the road, in order." not "Currently in Singapore", and has no `img` role.

- [ ] **Step 3: Rewrite `components/Hero.tsx`**

```tsx
import Image from "next/image";

const PLACES = ["Lisbon", "Porto", "São Miguel", "Fes", "Imlil", "Chefchaouen", "Seville", "Tangier"];
const HERO_IMAGE = "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1920&q=75";

export function Hero({ currentPlace }: { currentPlace: string }) {
  const ticker = [...PLACES, ...PLACES];
  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div className="relative min-h-[85vh]">
        <Image
          src={HERO_IMAGE}
          alt="Sunrise light over a mountain summit"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(46,36,31,0.92) 0%, rgba(46,36,31,0.4) 45%, rgba(46,36,31,0.05) 75%)",
          }}
          aria-hidden
        />
        <div className="relative z-10 mx-auto flex min-h-[85vh] max-w-5xl flex-col justify-end px-7 pb-6 pt-20">
          <p className="fade-up text-xs font-semibold uppercase tracking-[0.12em] text-bg/80">
            A travel journal by Ray
          </p>
          <h1
            className="fade-up fade-up-delay-1 mt-5 font-display font-medium leading-[0.95] tracking-tight"
            style={{ fontSize: "clamp(64px, 9vw, 120px)" }}
          >
            Currently in{" "}
            <span
              className="bg-clip-text italic font-light text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #ffd9b0, #e8703a, #ff6f91)" }}
            >
              {currentPlace}
            </span>
          </h1>
          <p
            className="fade-up fade-up-delay-2 mt-5 max-w-md text-bg/70"
            style={{ fontSize: "16px", lineHeight: 1.6 }}
          >
            Slow mornings, long drives, and the summits worth the climb.
          </p>
        </div>
      </div>
      <div className="relative z-10 overflow-hidden border-t border-white/[0.06] bg-ink py-3">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {ticker.map((place, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-sm italic tracking-wide text-bg/40">
              {place}
              <span aria-hidden className="text-orange/60">+</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Hero.test.tsx`
Expected: PASS

- [ ] **Step 5: Commit**

```bash
git add components/Hero.tsx components/Hero.test.tsx
git commit -m "feat: rebuild Hero as photo-led sunrise/summit editorial hero"
```

---

### Task 3: FeaturedVlog asymmetric layout + hover/press states

**Files:**
- Modify: `components/FeaturedVlog.tsx:1-31` (full rewrite)

**Interfaces:**
- Consumes: `PostMeta` from `@/lib/posts` (unchanged), `.thumb-hover`, `.press` from `app/globals.css` (Task 1).
- Produces: `FeaturedVlog({ post: PostMeta })` — same signature, still imported by `app/page.tsx`.

- [ ] **Step 1: Rewrite `components/FeaturedVlog.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function FeaturedVlog({ post }: { post: PostMeta }) {
  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto grid max-w-5xl gap-10 px-7 py-20 sm:grid-cols-[1fr_1.4fr] sm:items-center">
        <div>
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.12em] text-muted">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
            Latest vlog
          </p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight sm:text-5xl">
            {post.title}
          </h2>
          <p className="mt-4 max-w-md text-muted">{post.excerpt}</p>
          <span className="mt-6 inline-flex items-center rounded-full bg-peach px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.1em] text-ink">
            {post.place}
          </span>
        </div>
        <Link
          href={`/${post.slug}`}
          className="vlog-link group relative block overflow-hidden rounded-2xl bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
        >
          <div className="overflow-hidden">
            <Image
              src={post.cover}
              alt={post.title}
              width={1400}
              height={840}
              priority
              className="thumb-hover h-72 w-full object-cover"
            />
          </div>
          <span className="press absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <span aria-hidden>▶</span> Watch
          </span>
        </Link>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/FeaturedVlog.tsx
git commit -m "feat: asymmetric FeaturedVlog layout with thumbnail hover and press states"
```

---

### Task 4: PostCard/Feed row hover treatment + scroll-triggered stagger entrance

**Files:**
- Modify: `components/PostCard.tsx:1-59` (full rewrite)
- Modify: `components/Feed.tsx:1-12` (full rewrite)

**Interfaces:**
- Consumes: `.feed-row`, `.accent-bar` from `app/globals.css` (Task 1); `PostMeta` from `@/lib/posts`.
- Produces: `Feed({ posts: PostMeta[], theme?: "light" | "dark" })` and `PostCard({ post: PostMeta, index?: number, theme?: "light" | "dark" })` — same signatures as before, consumed by `app/page.tsx` and (unchanged) `travels`/`vlogs` pages.

- [ ] **Step 1: Confirm the existing test still describes the required contract**

`components/PostCard.test.tsx` already asserts: heading name, place text, excerpt text, type chip text, link `href`, image accessible name. No changes needed to this test file — the rewrite below must keep all of these intact.

- [ ] **Step 2: Rewrite `components/PostCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { CSSProperties } from "react";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post, index = 0, theme = "light" }: { post: PostMeta; index?: number; theme?: "light" | "dark" }) {
  const chip = post.type === "vlog" ? "Vlog" : "Travel";
  const dark = theme === "dark";
  return (
    <Link
      href={`/${post.slug}`}
      className={`feed-row group relative grid items-center border-t py-8 pl-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${
        dark ? "border-white/[0.06]" : "border-line"
      }`}
      style={{ gridTemplateColumns: "64px 300px 1fr auto", gap: "40px", "--i": index } as CSSProperties}
    >
      <span aria-hidden className="accent-bar absolute left-0 top-0 h-full w-[2px] bg-orange" />
      <span
        className={`font-display italic font-light transition-colors duration-150 ${
          dark ? "text-bg/30 group-hover:text-bg/70" : "text-muted/50 group-hover:text-muted"
        }`}
        style={{ fontSize: "22px" }}
      >
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative shrink-0 overflow-hidden" style={{ width: 300, height: 150, borderRadius: 10 }}>
        <Image src={post.cover} alt={post.title} width={300} height={150} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0">
        <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-orange">
          {post.place} — {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {chip}
        </div>
        <h3
          className={`mt-2 font-display font-normal tracking-[-0.02em] transition-colors duration-150 ${
            dark ? "text-bg group-hover:text-peach" : "text-ink group-hover:text-orange"
          }`}
          style={{ fontSize: "32px", lineHeight: 1.08 }}
        >
          {post.title}
        </h3>
        <p
          className={`mt-2 ${dark ? "text-bg/50" : "text-muted"}`}
          style={{
            fontSize: "14px",
            lineHeight: 1.6,
            maxWidth: "56ch",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
          }}
        >
          {post.excerpt}
        </p>
      </div>
      <span
        className="shrink-0 text-orange transition-transform duration-150 group-hover:translate-x-1"
        style={{ fontSize: "20px", paddingRight: 8 }}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
```

- [ ] **Step 3: Rewrite `components/Feed.tsx` as a client component with scroll-triggered entrance**

```tsx
"use client";
import { useEffect, useRef, useState } from "react";
import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./PostCard";

export function Feed({ posts, theme = "light" }: { posts: PostMeta[]; theme?: "light" | "dark" }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  if (posts.length === 0)
    return <p className={theme === "dark" ? "text-bg/50" : "text-muted"}>Nothing here yet.</p>;

  return (
    <div ref={ref} data-in-view={inView || undefined}>
      {posts.map((p, i) => (
        <PostCard key={p.slug} post={p} index={i} theme={theme} />
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Run the existing PostCard test to confirm the contract held**

Run: `npx vitest run components/PostCard.test.tsx`
Expected: PASS (heading, place, excerpt, chip, link href, image alt all still present).

- [ ] **Step 5: Run full test suite and build**

Run: `npm test && npm run build`
Expected: all tests pass, build succeeds.

- [ ] **Step 6: Commit**

```bash
git add components/PostCard.tsx components/Feed.tsx
git commit -m "feat: add row hover accent and scroll-triggered stagger entrance to Feed"
```

---

### Task 5: AboutTeaser polish

**Files:**
- Modify: `components/AboutTeaser.tsx:1-58` (full rewrite)

**Interfaces:**
- Consumes: `site` from `@/lib/site` (unchanged), `.sweep-link`, `.press` from `app/globals.css` (Task 1).
- Produces: `AboutTeaser()` — same signature, still imported by `app/page.tsx`.

- [ ] **Step 1: Rewrite `components/AboutTeaser.tsx`**

```tsx
import { site } from "@/lib/site";

export function AboutTeaser() {
  return (
    <section className="bg-bg">
      <div
        className="mx-auto grid max-w-5xl items-center"
        style={{ gridTemplateColumns: "220px 1fr", gap: "72px", padding: "128px 48px" }}
      >
        <div
          className="shrink-0 rounded-full bg-peach"
          style={{ width: 220, height: 220, transform: "rotate(-2deg)" }}
          aria-hidden
        />
        <div>
          <h2
            className="font-display italic text-ink"
            style={{ fontSize: "clamp(32px, 4vw, 40px)", lineHeight: 1.2, fontWeight: 500 }}
          >
            I travel slow, film what I can,{" "}
            <span
              className="bg-clip-text italic text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #e8703a, #ff6f91)" }}
            >
              and write the rest down.
            </span>
          </h2>
          <p className="mt-6 text-muted" style={{ fontSize: "16px", lineHeight: 1.75, maxWidth: "56ch" }}>
            Based in Singapore, wandering everywhere else. This is a running log of the places I&apos;ve
            slept, the food I&apos;ve chased, and the small moments that made the trip.
          </p>
          <a href="/about" className="sweep-link press mt-6 inline-block text-sm font-semibold text-ink">
            Read more →
          </a>
          <div className="mt-6 flex gap-6">
            {[
              { label: "YouTube", href: site.youtube },
              { label: "Instagram", href: site.instagram },
              { label: "RSS", href: site.rss },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="press font-semibold uppercase text-ink transition-colors duration-150 hover:text-orange"
                style={{
                  fontSize: "12.5px",
                  letterSpacing: "0.1em",
                  borderBottom: "1.5px solid #ffd9b0",
                  paddingBottom: 3,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/AboutTeaser.tsx
git commit -m "feat: add read-more sweep link and portrait tilt to AboutTeaser"
```

---

### Task 6: Footer hover polish

**Files:**
- Modify: `components/Footer.tsx:1-31` (full rewrite)

**Interfaces:**
- Consumes: `site` from `@/lib/site` (unchanged), `.press` from `app/globals.css` (Task 1).
- Produces: `Footer()` — same signature, still imported wherever it currently is (layout or homepage).

- [ ] **Step 1: Rewrite `components/Footer.tsx`**

```tsx
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8" style={{ padding: "56px 48px" }}>
        <h2
          className="bg-clip-text font-display font-normal text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #e8703a, #ff6f91)",
            fontSize: "clamp(48px, 7vw, 96px)",
            letterSpacing: "-0.03em",
          }}
        >
          raybydays
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span style={{ fontSize: "12px", letterSpacing: "0.06em", color: "rgba(253,246,238,0.45)" }}>
            © {new Date().getFullYear()} Ray — made on the road
          </span>
          <span className="flex gap-6" style={{ fontSize: "12px", letterSpacing: "0.06em", color: "rgba(253,246,238,0.6)" }}>
            <a href={site.youtube} className="press transition-colors duration-150 hover:text-peach">
              YouTube
            </a>
            <a href={site.instagram} className="press transition-colors duration-150 hover:text-peach">
              Instagram
            </a>
            <a href={site.rss} className="press transition-colors duration-150 hover:text-peach">
              RSS
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Verify build**

Run: `npm run build`
Expected: succeeds, no type errors.

- [ ] **Step 3: Commit**

```bash
git add components/Footer.tsx
git commit -m "feat: add press feedback and explicit color transition to Footer links"
```

---

### Task 7: Full verification pass

**Files:** none (verification only)

**Interfaces:** none.

- [ ] **Step 1: Run the full test suite**

Run: `npm test`
Expected: all tests pass, including `components/Hero.test.tsx` and `components/PostCard.test.tsx`.

- [ ] **Step 2: Run lint**

Run: `npm run lint`
Expected: no errors.

- [ ] **Step 3: Run production build**

Run: `npm run build`
Expected: succeeds with no type or import errors, no reference to `ScrollHero`, `motion`, or `@phosphor-icons/react` remains.

- [ ] **Step 4: Start dev server and visually verify in a browser**

Run: `npm run dev`, then open `http://localhost:3000` and confirm:
- Hero shows the sunrise/summit placeholder photo with "Currently in Singapore" headline and the marquee ticker at the bottom edge.
- Featured vlog section shows the asymmetric 58/42 layout with the place pill.
- Feed rows fade in with stagger on first scroll into view; hovering a row shows the left accent bar and title/number color shift (desktop only).
- About teaser shows the tilted portrait circle and "Read more →" sweep-underline link.
- Footer shows the gradient wordmark and press-feedback social links.
- Toggle OS-level "reduce motion" and confirm entrances still fade in (opacity only, no slide/scale).

- [ ] **Step 5: Stop the dev server**

No commit needed for this task — it's verification only. If any issue is found, fix it in the relevant task's files and repeat Steps 1–4 before considering the plan complete.
