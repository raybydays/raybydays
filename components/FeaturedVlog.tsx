import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function FeaturedVlog({ post }: { post: PostMeta }) {
  return (
    <section className="border-b border-line bg-bg">
      <div className="mx-auto grid max-w-5xl gap-10 px-7 py-20 sm:grid-cols-2 sm:items-center">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange">Latest vlog</p>
          <h2 className="mt-4 font-display text-4xl font-medium leading-tight tracking-tight">{post.title}</h2>
          <p className="mt-4 max-w-md text-muted">{post.excerpt}</p>
          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.1em] text-muted">
            {post.place} — {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
          </p>
        </div>
        <Link
          href={`/${post.slug}`}
          className="group relative block overflow-hidden rounded-2xl bg-card shadow-[0_20px_50px_rgba(200,110,50,0.12)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
        >
          <Image src={post.cover} alt={post.title} width={1400} height={840} priority
            className="h-72 w-full object-cover opacity-90 transition group-hover:opacity-100" />
          <span className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 items-center gap-2 rounded-full bg-rose px-4 py-2 text-sm font-semibold text-white shadow-lg">
            <span aria-hidden>▶</span> Watch
          </span>
        </Link>
      </div>
    </section>
  );
}
