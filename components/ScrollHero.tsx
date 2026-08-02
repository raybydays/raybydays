import Image from "next/image";
import { getPost } from "@/lib/posts";
import { HeroMedia } from "@/components/HeroMedia";

export function ScrollHero() {
  const vlog = getPost("portuguese-coast");

  if (!vlog) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("ScrollHero: missing featured vlog, hero will not render");
    }
    return null;
  }

  const year = new Date(vlog.date).getFullYear();
  const dateShort = new Date(vlog.date).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image src={vlog.cover} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/40" />
      </div>

      {/* top furniture: repeats the same slots as post-detail pages so the site reads as one system */}
      <div className="relative flex items-start justify-between px-7 pt-8 text-bg/85 sm:px-10">
        <span className="text-xs font-semibold uppercase tracking-[0.2em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
          raybydays
        </span>
        <span className="text-xs font-semibold uppercase tracking-[0.2em] drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
          {year}
        </span>
      </div>

      <div className="relative mx-auto flex max-w-4xl flex-col px-7 pb-24 pt-16 sm:px-10 sm:pb-32 sm:pt-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-bg/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
          {vlog.place} · {dateShort}
        </p>
        <h1 className="mt-3 font-display text-[15vw] font-medium leading-[0.82] tracking-tight text-bg drop-shadow-[0_2px_24px_rgba(0,0,0,0.6)] sm:text-[9rem] lg:text-[11rem]">
          Days
          <br />
          <span className="bg-gradient-to-r from-orange to-rose bg-clip-text italic text-transparent">
            on the road.
          </span>
        </h1>

        <HeroMedia />
      </div>

      <span className="relative mb-6 block pr-7 text-right font-mono text-[10px] uppercase tracking-[0.15em] text-bg/50 sm:mb-8 sm:pr-10">
        featured vlog
      </span>
    </section>
  );
}
