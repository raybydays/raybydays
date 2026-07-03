import { getAllPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamic = "force-static";

export function GET() {
  const items = getAllPosts()
    .map(
      (p) => `
    <item>
      <title>${escapeXml(p.title)}</title>
      <link>${site.url}/${p.slug}</link>
      <guid>${site.url}/${p.slug}</guid>
      <pubDate>${new Date(p.date).toUTCString()}</pubDate>
      <description>${escapeXml(p.excerpt)}</description>
    </item>`
    )
    .join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"><channel>
  <title>raybydays</title>
  <link>${site.url}</link>
  <description>Travel stories and cinematic vlogs, by the day.</description>
  ${items}
</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/xml" } });
}

function escapeXml(s: string) {
  return s.replace(
    /[<>&'"]/g,
    (c) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", '"': "&quot;" }[c]!)
  );
}
