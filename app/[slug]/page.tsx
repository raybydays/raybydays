import { notFound } from "next/navigation";
import Image from "next/image";
import { MDXRemote } from "next-mdx-remote/rsc";
import { getAllPosts, getPost } from "@/lib/posts";
import { LiteYouTube } from "@/components/LiteYouTube";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: { title: post.title, description: post.excerpt, images: [post.cover] },
  };
}

export default async function PostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = getPost(slug);
  if (!post) notFound();
  return (
    <article className="mx-auto max-w-3xl px-7 py-10">
      <div className="text-sm uppercase tracking-wide text-muted">
        {new Date(post.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })} · {post.place}
      </div>
      <h1 className="mt-2 font-display text-5xl font-extrabold tracking-tight">{post.title}</h1>
      <div className="mt-6">
        {post.type === "vlog" && post.youtube
          ? <LiteYouTube id={post.youtube} title={post.title} />
          : <Image src={post.cover} alt={post.title} width={1400} height={840} priority className="rounded-2xl" />}
      </div>
      <div className="prose prose-lg mt-8 max-w-none prose-headings:font-display">
        <MDXRemote source={post.content} />
      </div>
    </article>
  );
}
