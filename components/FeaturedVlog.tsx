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
