import { render, screen } from "@testing-library/react";
import { PostCard } from "./PostCard";
import type { PostMeta } from "@/lib/posts";

const post: PostMeta = {
  slug: "kyoto-slow-mornings", title: "Slow mornings in Arashiyama",
  date: "2026-06-15", place: "Kyoto, Japan", type: "travel",
  cover: "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=800",
  excerpt: "Bamboo, mist, and the quietest streets I've walked.",
};

it("renders title, place, excerpt, type chip, and links to the post", () => {
  render(<PostCard post={post} />);
  expect(screen.getByRole("heading", { name: /Slow mornings/i })).toBeInTheDocument();
  expect(screen.getByText(/Kyoto, Japan/)).toBeInTheDocument();
  expect(screen.getByText(/quietest streets/)).toBeInTheDocument();
  expect(screen.getByText(/travel/i)).toBeInTheDocument();
  expect(screen.getByRole("link")).toHaveAttribute("href", "/kyoto-slow-mornings");
  expect(screen.getByRole("img")).toHaveAccessibleName(/Slow mornings/i);
});
