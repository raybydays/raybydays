import { describe, it, expect } from "vitest";
import { getAllPosts, getPost, getPostsByType } from "./posts";

describe("posts", () => {
  it("returns all posts sorted by date descending", () => {
    const posts = getAllPosts();
    expect(posts.length).toBeGreaterThanOrEqual(2);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].date >= posts[i].date).toBe(true);
    }
  });
  it("parses frontmatter fields", () => {
    const p = getPost("kyoto-slow-mornings");
    expect(p).not.toBeNull();
    expect(p!.title).toBe("Slow mornings in Arashiyama");
    expect(p!.type).toBe("travel");
    expect(p!.place).toBe("Kyoto, Japan");
    expect(p!.content).toContain("bamboo grove");
  });
  it("exposes youtube id for vlogs", () => {
    expect(getPost("portuguese-coast")!.youtube).toBe("dQw4w9WgXcQ");
  });
  it("filters by type", () => {
    expect(getPostsByType("vlog").every(p => p.type === "vlog")).toBe(true);
    expect(getPostsByType("travel").every(p => p.type === "travel")).toBe(true);
  });
  it("returns null for missing slug", () => {
    expect(getPost("nope")).toBeNull();
  });
});
