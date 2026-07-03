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
