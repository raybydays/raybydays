import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-ink">
      <div className="mx-auto flex max-w-[1280px] flex-col gap-8" style={{ padding: "56px 48px" }}>
        <h2
          className="bg-clip-text font-display font-normal text-transparent"
          style={{
            backgroundImage: "linear-gradient(90deg, #e8703a, #ff6f91)",
            fontSize: "clamp(48px, 7vw, 96px)",
            letterSpacing: "-0.03em",
          }}
        >
          raybydays
        </h2>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span style={{ fontSize: "12px", letterSpacing: "0.06em", color: "rgba(253,246,238,0.45)" }}>
            © {new Date().getFullYear()} Ray — made on the road
          </span>
          <span className="flex gap-6" style={{ fontSize: "12px", letterSpacing: "0.06em", color: "rgba(253,246,238,0.6)" }}>
            <a href={site.youtube} className="transition hover:text-peach">YouTube</a>
            <a href={site.instagram} className="transition hover:text-peach">Instagram</a>
            <a href={site.rss} className="transition hover:text-peach">RSS</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
