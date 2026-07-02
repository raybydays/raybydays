import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type PostType = "travel" | "vlog";
export interface PostMeta {
  slug: string; title: string; date: string; place: string;
  type: PostType; cover: string; youtube?: string; excerpt: string;
}
export interface Post extends PostMeta { content: string; }

const DIR = path.join(process.cwd(), "content", "posts");

function readSlug(slug: string): Post | null {
  const file = path.join(DIR, `${slug}.mdx`);
  if (!fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    slug,
    title: String(data.title),
    date: String(data.date),
    place: String(data.place),
    type: data.type as PostType,
    cover: String(data.cover),
    youtube: data.youtube ? String(data.youtube) : undefined,
    excerpt: String(data.excerpt),
    content,
  };
}

export function getAllPosts(): PostMeta[] {
  if (!fs.existsSync(DIR)) return [];
  return fs.readdirSync(DIR)
    .filter(f => f.endsWith(".mdx"))
    .map(f => readSlug(f.replace(/\.mdx$/, ""))!)
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .map(({ content, ...meta }) => meta);
}

export function getPostsByType(t: PostType): PostMeta[] {
  return getAllPosts().filter(p => p.type === t);
}

export function getPost(slug: string): Post | null {
  return readSlug(slug);
}
