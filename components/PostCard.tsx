import Image from "next/image";
import Link from "next/link";
import type { PostMeta } from "@/lib/posts";

export function PostCard({ post }: { post: PostMeta }) {
  const chip = post.type === "vlog" ? "Vlog" : "Travel";
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
