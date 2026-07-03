import { getAllPosts, getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";
import { FeaturedVlog } from "@/components/FeaturedVlog";

export default function Home() {
  const posts = getAllPosts();
  const featured = getPostsByType("vlog")[0];
  return (
    <main className="mx-auto max-w-5xl px-7">
      <section className="py-12">
        <span className="inline-block rounded-full bg-peach px-4 py-1.5 text-sm font-semibold text-[#8a4b1e]">Based in Singapore</span>
        <h1 className="mt-5 font-display text-6xl font-extrabold leading-[0.95] tracking-tight sm:text-7xl">
          The good days,<br />
          <span className="bg-gradient-to-r from-orange to-rose bg-clip-text text-transparent">by the days.</span>
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-muted">
          I&apos;m Raymond — Ray, mostly. I like adventures, good food, and pointing a camera at the everyday in between. This is me documenting it, one day at a time.
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
