import { site } from "@/lib/site";

export function AboutTeaser() {
  return (
    <section className="bg-bg">
      <div
        className="mx-auto grid max-w-5xl items-center"
        style={{ gridTemplateColumns: "220px 1fr", gap: "72px", padding: "128px 48px" }}
      >
        <div
          className="shrink-0 rounded-full bg-peach"
          style={{ width: 220, height: 220 }}
          aria-hidden
        />
        <div>
          <h2
            className="font-display text-ink"
            style={{ fontSize: "clamp(36px, 4.5vw, 56px)", lineHeight: 1.06 }}
          >
            I travel slow, film what I can,{" "}
            <span
              className="bg-clip-text italic text-transparent"
              style={{ backgroundImage: "linear-gradient(90deg, #e8703a, #ff6f91)" }}
            >
              and write the rest down.
            </span>
          </h2>
          <p className="mt-6 text-muted" style={{ fontSize: "16px", lineHeight: 1.75, maxWidth: "56ch" }}>
            Based in Singapore, wandering everywhere else. This is a running log of the places I&apos;ve
            slept, the food I&apos;ve chased, and the small moments that made the trip.
          </p>
          <div className="mt-6 flex gap-6">
            {[
              { label: "YouTube", href: site.youtube },
              { label: "Instagram", href: site.instagram },
              { label: "RSS", href: site.rss },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="font-semibold uppercase text-ink transition hover:border-orange"
                style={{
                  fontSize: "12.5px",
                  letterSpacing: "0.1em",
                  borderBottom: "1.5px solid #ffd9b0",
                  paddingBottom: 3,
                }}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
