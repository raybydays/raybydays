import type { PostMeta } from "@/lib/posts";
import { PostCard } from "./PostCard";

export function Feed({ posts, theme = "light" }: { posts: PostMeta[]; theme?: "light" | "dark" }) {
  if (posts.length === 0)
    return <p className={theme === "dark" ? "text-bg/50" : "text-muted"}>Nothing here yet.</p>;
  return (
    <div>
      {posts.map((p, i) => <PostCard key={p.slug} post={p} index={i} theme={theme} />)}
    </div>
  );
}
