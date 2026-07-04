import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post, index = 0, theme = "light" }: { post: PostMeta; index?: number; theme?: "light" | "dark" }) {
  const chip = post.type === "vlog" ? "Vlog" : "Travel";
  const dark = theme === "dark";
  return (
    <Link
      href={`/${post.slug}`}
      className={`group grid items-center border-t py-8 transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange ${
        dark ? "border-white/[0.06]" : "border-line"
      }`}
      style={{ gridTemplateColumns: "64px 300px 1fr auto", gap: "40px" }}
    >
      <span
        className={`font-display italic font-light ${dark ? "text-bg/30" : "text-muted/50"}`}
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
          className={`mt-2 font-display font-normal tracking-[-0.02em] ${dark ? "text-bg" : "text-ink"}`}
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
        className="shrink-0 text-orange transition group-hover:translate-x-1"
        style={{ fontSize: "20px", paddingRight: 8 }}
        aria-hidden
      >
        →
      </span>
    </Link>
  );
}
