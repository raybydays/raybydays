import { getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";

export const metadata = { title: "Vlogs" };

export default function Vlogs() {
  return (
    <main className="mx-auto max-w-5xl px-7 py-10">
      <h1 className="font-display text-5xl font-extrabold tracking-tight">Vlogs</h1>
      <p className="mb-8 mt-3 text-muted">Videos, as I make them.</p>
      <Feed posts={getPostsByType("vlog")} />
    </main>
  );
}
