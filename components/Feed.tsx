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
