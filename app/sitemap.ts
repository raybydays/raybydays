import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/travels", "/vlogs", "/about"].map((r) => ({
    url: `${site.url}${r}`,
    lastModified: new Date(),
  }));
  const posts = getAllPosts().map((p) => ({
    url: `${site.url}/${p.slug}`,
    lastModified: new Date(p.date),
  }));
  return [...routes, ...posts];
}
