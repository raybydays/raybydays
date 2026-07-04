import { getAllPosts, getPostsByType } from "@/lib/posts";
import { Feed } from "@/components/Feed";
import { FeaturedVlog } from "@/components/FeaturedVlog";
import { Hero } from "@/components/Hero";

export default function Home() {
  const posts = getAllPosts();
  const featured = getPostsByType("vlog")[0];
  return (
    <main>
      <Hero currentPlace="Singapore" />

      {featured && <FeaturedVlog post={featured} />}

      <section id="feed" className="bg-ink">
        <div className="mx-auto max-w-5xl px-7 py-16">
          <div className="mb-8 flex items-baseline justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-[0.12em] text-orange">Recent days</h2>
          </div>
          <Feed posts={posts} theme="dark" />
        </div>
      </section>
    </main>
  );
}
