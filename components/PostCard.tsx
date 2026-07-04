import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post, index = 0, theme = "light" }: { post: PostMeta; index?: number; theme?: "light" | "dark" }) {
  const chip = post.type === "vlog" ? "Vlog" : "Travel";
  const dark = theme === "dark";
  return (
    <Link
      href={`/${post.slug}`}
      className={`group flex items-center gap-6 border-b py-6 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${
        dark ? "border-white/[0.06]" : "border-line"
      }`}
    >
      <span className={`font-display text-lg italic ${dark ? "text-bg/30" : "text-muted/50"}`}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="relative h-16 w-24 shrink-0 overflow-hidden rounded-lg">
        <Image src={post.cover} alt={post.title} width={200} height={130} className="h-full w-full object-cover" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-xs font-semibold uppercase tracking-[0.08em] text-orange">
          {post.place} — {new Date(post.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })} · {chip}
        </div>
        <h3 className={`mt-1 truncate font-display text-xl font-medium tracking-tight ${dark ? "text-bg" : "text-ink"}`}>
          {post.title}
        </h3>
        <p className={`mt-1 truncate text-sm ${dark ? "text-bg/50" : "text-muted"}`}>{post.excerpt}</p>
      </div>
      <span className="shrink-0 text-orange transition group-hover:translate-x-1" aria-hidden>
        →
      </span>
    </Link>
  );
}
