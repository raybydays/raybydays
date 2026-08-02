import Image from "next/image";
import { getPost } from "@/lib/posts";
import { HeroMedia } from "@/components/HeroMedia";

export function ScrollHero() {
  const vlog = getPost("portuguese-coast");

  if (!vlog || !vlog.youtube) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("ScrollHero: missing featured vlog or youtube id, hero will not render");
    }
    return null;
  }

  const date = `${vlog.place} · ${new Date(vlog.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}`;

  return (
    <section className="relative overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image src={vlog.cover} alt="" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-ink/30" />
      </div>

      <div className="relative mx-auto flex max-w-3xl flex-col items-center px-7 py-24 text-center sm:py-32">
        <p className="text-sm font-semibold uppercase tracking-[0.12em] text-bg/80 drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)]">
          {date}
        </p>
        <h1 className="mt-4 font-display text-5xl font-medium leading-[0.95] tracking-tight text-bg drop-shadow-[0_2px_16px_rgba(0,0,0,0.55)] sm:text-7xl">
          Days
          <br />
          <span className="italic">on the road, in order.</span>
        </h1>

        <HeroMedia youtubeId={vlog.youtube} title={vlog.title} />
      </div>
    </section>
  );
}
