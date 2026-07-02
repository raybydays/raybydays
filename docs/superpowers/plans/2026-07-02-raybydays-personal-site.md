# raybydays.com Personal Site Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build and deploy a personal travel/vlog site at raybydays.com — a warm/bold homepage with a hero, featured vlog, and mixed feed, backed by MDX files, hosted on Vercel with GitHub version control.

**Architecture:** Next.js App Router (SSG). Posts are MDX files in `content/posts/`, read and parsed at build time by `lib/posts.ts` into a typed `Post[]`. Pages consume that interface only. Styling via Tailwind with warm-palette design tokens. YouTube via a click-to-load facade.

**Tech Stack:** Next.js 15 (App Router, TypeScript), Tailwind CSS v4, `gray-matter` (frontmatter), `next-mdx-remote` (MDX body), `next/image`, `next/font` (Fraunces + Inter), Vercel hosting.

## Global Constraints

- **Palette (CSS variables):** bg `#fdf6ee`, ink `#2e241f`, muted `#7d6a5f`, peach `#ffd9b0`, orange `#e8703a`, rose `#ff6f91`, card `#fffaf3`, line `#f0e2d2`. Headline/wordmark gradient: `linear-gradient(90deg, #e8703a, #ff6f91)`.
- **Fonts:** Fraunces (display headlines), Inter (body/UI), via `next/font/google`.
- **Rendering:** static generation only — no runtime data fetching, no DB, no CMS.
- **Post frontmatter fields:** `title`, `date` (YYYY-MM-DD), `place`, `type` (`travel`|`vlog`), `cover`, `youtube` (optional), `excerpt`.
- **Accessibility:** every image has alt text; visible focus; `prefers-reduced-motion` honored; WCAG AA contrast.
- **Node:** 20+. Package manager: npm.

---

### Task 1: Scaffold Next.js app with Tailwind, fonts, and palette tokens

**Files:**
- Create: project via `create-next-app` (generates `package.json`, `tsconfig.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, etc.)
- Modify: `app/globals.css` (palette tokens), `app/layout.tsx` (fonts + metadata)
- Create: `app/page.tsx` (temporary placeholder)

**Interfaces:**
- Produces: CSS variables `--bg`, `--ink`, `--muted`, `--peach`, `--orange`, `--rose`, `--card`, `--line` on `:root`; Tailwind theme colors `bg`, `ink`, `muted`, `peach`, `orange`, `rose`, `card`, `line`; font CSS variables `--font-fraunces`, `--font-inter`.

- [ ] **Step 1: Scaffold the app**

Run in the project root (`/Users/raymondchew/Documents/raybydays.com`), which already has a git repo and `.gitignore`:
```bash
npx create-next-app@latest . --typescript --tailwind --app --eslint --no-src-dir --import-alias "@/*" --use-npm
```
Accept overwrite prompts if asked (keep existing `.gitignore` / git). Expected: app scaffolds, `npm install` runs.

- [ ] **Step 2: Verify dev server boots**

Run: `npm run dev` then in another shell `curl -sI http://localhost:3000 | head -1`
Expected: `HTTP/1.1 200 OK`. Stop the dev server after.

- [ ] **Step 3: Add fonts in `app/layout.tsx`**

Replace the font setup with Fraunces + Inter:
```tsx
import { Fraunces, Inter } from "next/font/google";

const fraunces = Fraunces({ subsets: ["latin"], variable: "--font-fraunces", display: "swap" });
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
```
Apply to `<html>`: `<html lang="en" className={`${fraunces.variable} ${inter.variable}`}>`. Set `<body className="font-sans bg-bg text-ink antialiased">`.

Set metadata:
```tsx
export const metadata = {
  metadataBase: new URL("https://raybydays.com"),
  title: { default: "raybydays", template: "%s · raybydays" },
  description: "Travel stories and cinematic vlogs, by the day.",
};
```

- [ ] **Step 4: Define palette + font mapping in `app/globals.css`**

After the `@import "tailwindcss";` line add:
```css
:root {
  --bg:#fdf6ee; --ink:#2e241f; --muted:#7d6a5f;
  --peach:#ffd9b0; --orange:#e8703a; --rose:#ff6f91;
  --card:#fffaf3; --line:#f0e2d2;
}
@theme inline {
  --color-bg: var(--bg); --color-ink: var(--ink); --color-muted: var(--muted);
  --color-peach: var(--peach); --color-orange: var(--orange); --color-rose: var(--rose);
  --color-card: var(--card); --color-line: var(--line);
  --font-sans: var(--font-inter); --font-display: var(--font-fraunces);
}
```

- [ ] **Step 5: Temporary home placeholder in `app/page.tsx`**

```tsx
export default function Home() {
  return (
    <main className="mx-auto max-w-5xl px-7 py-20">
      <h1 className="font-display text-6xl">ray<span className="bg-gradient-to-r from-orange to-rose bg-clip-text text-transparent">bydays</span></h1>
      <p className="mt-4 text-muted">Coming soon.</p>
    </main>
  );
}
```

- [ ] **Step 6: Verify build + styling**

Run: `npm run build`
Expected: build succeeds, no type errors. Then `npm run dev` and confirm the gradient wordmark renders on cream background.

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js app with warm palette and fonts"
```

---

### Task 2: Content library — read and parse MDX posts

**Files:**
- Create: `lib/posts.ts`
- Create: `content/posts/kyoto-slow-mornings.mdx`, `content/posts/portuguese-coast.mdx` (sample content — one travel, one vlog)
- Create: `lib/posts.test.ts`
- Modify: `package.json` (add test script + deps)

**Interfaces:**
- Produces:
  ```ts
  export type PostType = "travel" | "vlog";
  export interface PostMeta {
    slug: string; title: string; date: string; place: string;
    type: PostType; cover: string; youtube?: string; excerpt: string;
  }
  export interface Post extends PostMeta { content: string; } // raw MDX body
  export function getAllPosts(): PostMeta[];        // sorted date desc
  export function getPostsByType(t: PostType): PostMeta[];
  export function getPost(slug: string): Post | null;
  ```

- [ ] **Step 1: Install deps**

```bash
npm install gray-matter next-mdx-remote
npm install -D vitest
```
Add to `package.json` scripts: `"test": "vitest run"`.

- [ ] **Step 2: Add sample posts**

`content/posts/kyoto-slow-mornings.mdx`:
```mdx
---
title: "Slow mornings in Arashiyama"
date: "2026-06-15"
place: "Kyoto, Japan"
type: "travel"
cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1400&q=75"
excerpt: "Bamboo, mist, and the quietest streets I've walked."
---

The alarm went off at five. Worth it — the bamboo grove was empty and silver
with mist.

Some mornings you just walk and let the city wake up around you.
```

`content/posts/portuguese-coast.mdx`:
```mdx
---
title: "Three days along the Portuguese coast"
date: "2026-06-28"
place: "Lisbon, Portugal"
type: "vlog"
cover: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1400&q=75"
youtube: "dQw4w9WgXcQ"
excerpt: "A slow evening, a camera, and too many pastries."
---

Rented a little van and followed the coast south. Full film above — notes below.
```

- [ ] **Step 3: Write the failing test**

`lib/posts.test.ts`:
```ts
import { describe, it, expect } from "vitest";
import { getAllPosts, getPost, getPostsByType } from "./posts";

describe("posts", () => {
  it("returns all posts sorted by date descending", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });
  it("parses frontmatter fields", () => {
    const p = getPost("kyoto-slow-mornings");
    expect(p).not.toBeNull();
    expect(p!.title).toBe("Slow mornings in Arashiyama");
    expect(p!.type).toBe("travel");
    expect(p!.place).toBe("Kyoto, Japan");
    expect(p!.content).toContain("bamboo grove");
  });
  it("exposes youtube id for vlogs", () => {
    expect(getPost("portuguese-coast")!.youtube).toBe("dQw4w9WgXcQ");
  });
  it("filters by type", () => {
    expect(getPostsByType("vlog").every(p => p.type === "vlog")).toBe(true);
    expect(getPostsByType("travel").every(p => p.type === "travel")).toBe(true);
  });
  it("returns null for missing slug", () => {
    expect(getPost("nope")).toBeNull();
  });
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — `./posts` has no such exports / module.

- [ ] **Step 5: Implement `lib/posts.ts`**

```ts
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostType = "travel" | "vlog";
export interface PostMeta {
  slug: string; title: string; date: string; place: string;
  type: PostType; cover: string; youtube?: string; excerpt: string;
}
export interface Post extends PostMeta { content: string; }

const DIR = path.join(process.cwd(), "content", "posts");

function readSlug(slug: string): Post | null {
  const file = path.join(DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title),
    date: String(data.date),
    place: String(data.place),
    type: data.type as PostType,
    cover: String(data.cover),
    youtube: data.youtube ? String(data.youtube) : undefined,
    excerpt: String(data.excerpt),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith(".mdx"))
    .map(f => readSlug(f.replace(/\.mdx$/, ""))!)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...meta }) => meta);
}

export function getPostsByType(t: PostType): PostMeta[] {
  return getAllPosts().filter(p => p.type === t);
}

export function getPost(slug: string): Post | null {
  return readSlug(slug);
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npm test`
Expected: PASS (5 tests).

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: MDX content library with tests and sample posts"
```

---

### Task 3: PostCard and Feed components

**Files:**
- Create: `components/PostCard.tsx`
- Create: `components/Feed.tsx`
- Modify: `next.config.ts` (allow Unsplash remote images)
- Create: `components/PostCard.test.tsx`
- Modify: `package.json` / add `vitest.config.ts` + jsdom for component tests

**Interfaces:**
- Consumes: `PostMeta` from `lib/posts.ts`.
- Produces:
  ```tsx
  export function PostCard({ post }: { post: PostMeta }): JSX.Element;
  export function Feed({ posts }: { posts: PostMeta[] }): JSX.Element;
  ```

- [ ] **Step 1: Allow Unsplash images in `next.config.ts`**

```ts
import type { NextConfig } from "next";
const nextConfig: NextConfig = {
  images: { remotePatterns: [{ protocol: "https", hostname: "images.unsplash.com" }] },
};
export default nextConfig;
```

- [ ] **Step 2: Install component-test tooling**

```bash
npm install -D @testing-library/react @testing-library/jest-dom jsdom @vitejs/plugin-react
```
Create `vitest.config.ts`:
```ts
import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
export default defineConfig({
  plugins: [react()],
  test: { environment: "jsdom", globals: true, setupFiles: ["./vitest.setup.ts"] },
});
```
Create `vitest.setup.ts`:
```ts
import "@testing-library/jest-dom/vitest";
```

- [ ] **Step 3: Write the failing test**

`components/PostCard.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/posts";

const post: PostMeta = {
  slug: "kyoto-slow-mornings", title: "Slow mornings in Arashiyama",
  date: "2026-06-15", place: "Kyoto, Japan", type: "travel",
  cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
  excerpt: "Bamboo, mist, and the quietest streets I've walked.",
};

it("renders title, place, excerpt, type chip, and links to the post", () => {
  render(<PostCard post={post} />);
  expect(screen.getByRole("heading", { name: /Slow mornings/i })).toBeInTheDocument();
  expect(screen.getByText(/Kyoto, Japan/)).toBeInTheDocument();
  expect(screen.getByText(/quietest streets/)).toBeInTheDocument();
  expect(screen.getByText(/travel/i)).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/kyoto-slow-mornings");
  expect(screen.getByRole("img")).toHaveAccessibleName(/Slow mornings/i);
});
```

- [ ] **Step 4: Run test to verify it fails**

Run: `npm test`
Expected: FAIL — cannot find `./PostCard`.

- [ ] **Step 5: Implement `components/PostCard.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  const chip = post.type === "vlog" ? "🎬 Vlog" : "📸 Travel";
  return (
    <Link href={`/${post.slug}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-card transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(200,110,50,0.16)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
      <div className="relative">
        <Image src={post.cover} alt={post.title} width={800} height={480}
          className="h-48 w-full object-cover" />
        <span className="absolute left-3 top-3 rounded-full bg-white/95 px-2.5 py-1 text-xs font-bold text-orange">{chip}</span>
      </div>
      <div className="p-4">
        <div className="text-xs uppercase tracking-wide text-muted">
          {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {post.place}
        </div>
        <h3 className="mt-1.5 text-lg font-semibold tracking-tight">{post.title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">{post.excerpt}</p>
      </div>
    </Link>
  );
}
```

- [ ] **Step 6: Implement `components/Feed.tsx`**

```tsx
import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./PostCard";

export function Feed({ posts }: { posts: PostMeta[] }) {
  if (posts.length === 0) return <p className="text-muted">Nothing here yet.</p>;
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {posts.map(p => <PostCard key={p.slug} post={p} />)}
    </div>
  );
}
```

- [ ] **Step 7: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: PostCard and Feed components with image config"
```

---

### Task 4: Nav, Footer, and layout chrome

**Files:**
- Create: `components/Nav.tsx`, `components/Footer.tsx`
- Modify: `app/layout.tsx` (wrap children with Nav + Footer)
- Create: `lib/site.ts` (site config: social links)

**Interfaces:**
- Produces: `export const site = { youtube, instagram, email }` in `lib/site.ts`; `<Nav />`, `<Footer />` components.

- [ ] **Step 1: Add `lib/site.ts`**

```ts
export const site = {
  name: "raybydays",
  url: "https://raybydays.com",
  youtube: "https://youtube.com/@raybydays",
  instagram: "https://instagram.com/raybydays",
  email: "hello@raybydays.com",
};
```

- [ ] **Step 2: Implement `components/Nav.tsx`**

```tsx
import Link from "next/link";

const links = [
  { href: "/travels", label: "Travels" },
  { href: "/vlogs", label: "Vlogs" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-7 py-6">
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        ray<span className="bg-gradient-to-r from-orange to-rose bg-clip-text text-transparent">bydays</span>
      </Link>
      <div className="flex gap-2">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
```

- [ ] **Step 3: Implement `components/Footer.tsx`**

```tsx
import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-5xl items-center justify-between border-t border-line px-7 py-8 text-sm text-muted">
      <span>© {new Date().getFullYear()} Ray · raybydays.com</span>
      <span className="flex gap-4">
        <a href={site.youtube} className="hover:text-ink">YouTube</a>
        <a href={site.instagram} className="hover:text-ink">Instagram</a>
        <a href={`mailto:${site.email}`} className="hover:text-ink">Email</a>
      </span>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into `app/layout.tsx`**

Wrap the body children:
```tsx
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/Footer";
// inside <body>:
<Nav />
{children}
<Footer />
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: succeeds. `npm run dev` — nav wordmark + pill links and footer render on every page.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: nav, footer, and site config"
```

---

### Task 5: Home page — hero, featured vlog, feed

**Files:**
- Create: `components/FeaturedVlog.tsx`
- Modify: `app/page.tsx` (real homepage)

**Interfaces:**
- Consumes: `getAllPosts`, `getPostsByType` from `lib/posts.ts`; `Feed`, `PostCard`.
- Produces: `export function FeaturedVlog({ post }: { post: PostMeta }): JSX.Element` (links to the vlog's detail page).

- [ ] **Step 1: Implement `components/FeaturedVlog.tsx`**

```tsx
import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function FeaturedVlog({ post }: { post: PostMeta }) {
  return (
    <Link href={`/${post.slug}`}
      className="relative block overflow-hidden rounded-3xl shadow-[0_20px_50px_rgba(200,110,50,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
      <Image src={post.cover} alt={post.title} width={1400} height={840} priority
        className="h-[420px] w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink/75 to-transparent" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-orange">▶</span>
      <div className="absolute bottom-6 left-6 text-white">
        <div className="text-xs uppercase tracking-widest opacity-90">Latest vlog · {post.place}</div>
        <div className="mt-1 text-2xl font-extrabold tracking-tight">{post.title}</div>
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: Implement `app/page.tsx`**

```tsx
import { getAllPosts, getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";
import { FeaturedVlog } from "@/components/FeaturedVlog";

export default function Home() {
  const posts = getAllPosts();
  const featured = getPostsByType("vlog")[0];
  return (
    <main className="mx-auto max-w-5xl px-7">
      <section className="py-12">
        <span className="inline-block rounded-full bg-peach px-4 py-1.5 text-sm font-semibold text-[#8a4b1e]">✈ Currently in Lisbon</span>
        <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          The good days,<br />
          <span className="bg-gradient-to-r from-orange to-rose bg-clip-text text-transparent">by the day.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          Hey, I&apos;m Ray. Travel stories, everyday adventures and cinematic vlogs from wherever I land. Come along.
        </p>
      </section>

      {featured && <FeaturedVlog post={featured} />}

      <section className="py-4">
        <div className="mb-4 mt-12 flex items-baseline justify-between">
          <h2 className="text-3xl font-extrabold tracking-tight">Recent days</h2>
        </div>
        <Feed posts={posts} />
      </section>
    </main>
  );
}
```

- [ ] **Step 3: Verify build + visual**

Run: `npm run build && npm run dev`
Expected: home shows hero, cinematic featured vlog, mixed feed. Matches the approved `style-v2.html` look.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat: homepage with hero, featured vlog, and feed"
```

---

### Task 6: Post detail page with MDX rendering and YouTube facade

**Files:**
- Create: `components/LiteYouTube.tsx`
- Create: `components/LiteYouTube.test.tsx`
- Create: `app/[slug]/page.tsx`

**Interfaces:**
- Consumes: `getAllPosts`, `getPost` from `lib/posts.ts`; `next-mdx-remote/rsc`.
- Produces: `export function LiteYouTube({ id, title }: { id: string; title: string }): JSX.Element` — renders a click-to-load facade (button with a play affordance; on click swaps in the YouTube iframe).

- [ ] **Step 1: Write the failing test**

`components/LiteYouTube.test.tsx`:
```tsx
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LiteYouTube } from "./LiteYouTube";

it("shows a play facade first, then loads the iframe on click", async () => {
  render(<LiteYouTube id="dQw4w9WgXcQ" title="Coast vlog" />);
  const btn = screen.getByRole("button", { name: /play/i });
  expect(screen.queryByTitle("Coast vlog")).not.toBeInTheDocument();
  await userEvent.click(btn);
  const frame = await screen.findByTitle("Coast vlog");
  expect(frame).toHaveAttribute("src", expect.stringContaining("dQw4w9WgXcQ"));
});
```

- [ ] **Step 2: Install user-event, run test to verify it fails**

```bash
npm install -D @testing-library/user-event
npm test
```
Expected: FAIL — cannot find `./LiteYouTube`.

- [ ] **Step 3: Implement `components/LiteYouTube.tsx`**

```tsx
"use client";
import { useState } from "react";
import Image from "next/image";

export function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl">
        <iframe title={title} className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    );
  }
  return (
    <button onClick={() => setPlay(true)} aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
      <Image src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" fill className="object-cover" />
      <span className="absolute inset-0 bg-ink/20 transition group-hover:bg-ink/10" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-orange">▶</span>
    </button>
  );
}
```
Add `i.ytimg.com` to `next.config.ts` `remotePatterns`.

- [ ] **Step 4: Run test to verify it passes**

Run: `npm test`
Expected: PASS.

- [ ] **Step 5: Implement `app/[slug]/page.tsx`**

```tsx
import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import { LiteYouTube } from "@/components/LiteYouTube";

export function generateStaticParams() {
  return getAllPosts().map(p => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.cover] },
  };
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = getPost(params.slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-7 py-10">
      <div className="text-sm uppercase tracking-wide text-muted">
        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.place}
      </div>
      <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">{post.title}</h1>
      <div className="mt-6">
        {post.type === "vlog" && post.youtube
          ? <LiteYouTube id={post.youtube} title={post.title} />
          : <Image src={post.cover} alt={post.title} width={1400} height={840} priority className="rounded-2xl" />}
      </div>
      <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
```

- [ ] **Step 6: Add typography plugin**

```bash
npm install -D @tailwindcss/typography
```
In `app/globals.css` add after the tailwind import: `@plugin "@tailwindcss/typography";`

- [ ] **Step 7: Verify build**

Run: `npm run build`
Expected: static params generate both post pages; build succeeds. `npm run dev` — visit `/portuguese-coast` (vlog facade) and `/kyoto-slow-mornings` (photo + text).

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: post detail pages with MDX and YouTube facade"
```

---

### Task 7: Filtered feeds and About page

**Files:**
- Create: `app/travels/page.tsx`, `app/vlogs/page.tsx`, `app/about/page.tsx`
- Create: `app/not-found.tsx`

**Interfaces:**
- Consumes: `getPostsByType`; `Feed`; `site`.

- [ ] **Step 1: `app/travels/page.tsx`**

```tsx
import { getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";
export const metadata = { title: "Travels" };
export default function Travels() {
  return (
    <main className="mx-auto max-w-5xl px-7 py-10">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">Travels</h1>
      <p className="mb-8 mt-3 text-muted">Photo stories from the road.</p>
      <Feed posts={getPostsByType("travel")} />
    </main>
  );
}
```

- [ ] **Step 2: `app/vlogs/page.tsx`**

Same shape as travels, with `getPostsByType("vlog")`, `metadata.title = "Vlogs"`, heading "Vlogs", subtitle "Cinematic films from everywhere I land."

- [ ] **Step 3: `app/about/page.tsx`**

```tsx
import { site } from "@/lib/site";
export const metadata = { title: "About" };
export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-7 py-12">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">Hey, I&apos;m Ray.</h1>
      <div className="prose prose-lg mt-6 text-muted">
        <p>I travel and make videos, and this is where I keep the good days. Some are photo stories, some are films.</p>
        <p>Find me on <a href={site.youtube}>YouTube</a>, <a href={site.instagram}>Instagram</a>, or say hi at <a href={`mailto:${site.email}`}>{site.email}</a>.</p>
      </div>
    </main>
  );
}
```

- [ ] **Step 4: `app/not-found.tsx`**

```tsx
import Link from "next/link";
export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-7 py-24 text-center">
      <h1 className="font-display text-6xl font-extrabold">Lost the trail.</h1>
      <p className="mt-4 text-muted">That page wandered off.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-orange px-6 py-3 font-semibold text-white">Back home</Link>
    </main>
  );
}
```

- [ ] **Step 5: Verify build**

Run: `npm run build`
Expected: `/travels`, `/vlogs`, `/about` all static. `npm run dev` — nav links work, filters correct.

- [ ] **Step 6: Commit**

```bash
git add -A
git commit -m "feat: travels, vlogs, about, and 404 pages"
```

---

### Task 8: SEO — sitemap, robots, RSS feed

**Files:**
- Create: `app/sitemap.ts`, `app/robots.ts`, `app/feed.xml/route.ts`

**Interfaces:**
- Consumes: `getAllPosts`; `site`.

- [ ] **Step 1: `app/robots.ts`**

```ts
import type { MetadataRoute } from "next";
import { site } from "@/lib/site";
export default function robots(): MetadataRoute.Robots {
  return { rules: { userAgent: "*", allow: "/" }, sitemap: `${site.url}/sitemap.xml` };
}
```

- [ ] **Step 2: `app/sitemap.ts`**

```ts
import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/travels", "/vlogs", "/about"].map(r => ({ url: `${site.url}${r}`, lastModified: new Date() }));
  const posts = getAllPosts().map(p => ({ url: `${site.url}/${p.slug}`, lastModified: new Date(p.date) }));
  return [...routes, ...posts];
}
```

- [ ] **Step 3: `app/feed.xml/route.ts`**

```ts
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";
export const dynamic = "force-static";
export function GET() {
  const items = getAllPosts().map(p => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site.url}/${p.slug}</link>
      <guid>${site.url}/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>raybydays</title>
  <link>${site.url}</link>
  <description>Travel stories and cinematic vlogs, by the day.</description>
  ${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}
function escapeXml(s: string) {
  return s.replace(/[<>&'"]/g, c => ({ "<":"&lt;", ">":"&gt;", "&":"&amp;", "'":"&apos;", '"':"&quot;" }[c]!));
}
```

- [ ] **Step 4: Verify build**

Run: `npm run build && npm run dev`
Expected: `curl -s localhost:3000/robots.txt`, `/sitemap.xml`, `/feed.xml` all return valid content.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: sitemap, robots, and RSS feed"
```

---

### Task 9: Deploy to GitHub + Vercel + custom domain

**Files:** none (infra). Requires the user for account-level steps.

- [ ] **Step 1: Final local check**

Run: `npm run build && npm test`
Expected: build succeeds, all tests pass. Fix any lint errors from `npm run lint`.

- [ ] **Step 2: Create GitHub repo and push**

User runs (or via `gh`): create a repo named `raybydays`, then:
```bash
git branch -M main
git remote add origin https://github.com/<user>/raybydays.git
git push -u origin main
```
(Confirm the remote URL with the user before pushing.)

- [ ] **Step 3: Import to Vercel**

In the Vercel dashboard: New Project → import the `raybydays` GitHub repo → framework auto-detected as Next.js → Deploy. Confirm the preview URL builds and renders.

- [ ] **Step 4: Add custom domain**

Vercel → Project → Settings → Domains → add `raybydays.com` and `www.raybydays.com`. Follow Vercel's DNS instructions at the registrar: apex `A`/`ALIAS` record + `www` `CNAME` to `cname.vercel-dns.com`. Set `www` → apex redirect (or the reverse) in Vercel.

- [ ] **Step 5: Verify production**

Once DNS propagates: `curl -sI https://raybydays.com | head -1` → `HTTP/2 200`. Confirm HTTPS, home renders, a post page loads, `/feed.xml` works.

- [ ] **Step 6: Confirm auto-deploy**

Make a trivial content commit, push to `main`, confirm Vercel auto-deploys. Publishing flow verified.

---

## Self-Review

**Spec coverage:** visual direction → Tasks 1,3,5 (tokens, cards, homepage). Stack → Task 1. Content model → Task 2. All routes (`/`, `/[slug]`, `/travels`, `/vlogs`, `/about`) → Tasks 5,6,7. Components (PostCard, FeaturedVlog, LiteYouTube, Nav, Footer, Feed, lib/posts) → Tasks 2–6. SEO (metadata, OG, sitemap, robots, RSS) → Tasks 1,6,8. A11y → baked into component tasks. Deployment → Task 9. Success criteria → Task 9 verification. No gaps.

**Placeholder scan:** no TBD/TODO; every code step has complete code; commands have expected output.

**Type consistency:** `PostMeta`/`Post`/`PostType` defined in Task 2, consumed unchanged in Tasks 3–8. `getAllPosts`/`getPostsByType`/`getPost` signatures stable. `LiteYouTube({id,title})`, `FeaturedVlog({post})`, `PostCard({post})`, `Feed({posts})` used consistently.

**Note (verify at build):** orange (`#e8703a`) on cream for *small* body text is borderline for WCAG AA — keep orange for large headings/gradient only; body text uses ink/muted. Muted (`#7d6a5f`) on cream passes AA for normal text.
