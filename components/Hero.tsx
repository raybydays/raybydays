const PLACES = ["Lisbon", "Porto", "São Miguel", "Fes", "Imlil", "Chefchaouen", "Seville", "Tangier"];

export function Hero({ currentPlace }: { currentPlace: string }) {
  const ticker = [...PLACES, ...PLACES];
  return (
    <section className="relative overflow-hidden bg-ink text-bg">
      <div className="mx-auto flex min-h-[70vh] max-w-5xl flex-col justify-end px-7 pb-16 pt-20">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-orange">
              A travel journal by Ray
            </p>
            <h1 className="mt-5 font-display text-6xl font-medium leading-[0.95] tracking-tight sm:text-7xl">
              Days on the road,
              <br />
              <span className="bg-gradient-to-r from-[#ffb27a] to-[#ff8fa8] bg-clip-text italic font-light text-transparent">
                in order.
              </span>
            </h1>
          </div>
          <span className="hidden shrink-0 items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs text-bg/80 sm:flex">
            <span className="h-1.5 w-1.5 rounded-full bg-orange" aria-hidden />
            Currently — {currentPlace}
          </span>
        </div>
        <span className="mt-10 text-xs uppercase tracking-[0.15em] text-bg/50">Scroll ↓</span>
      </div>
      <div className="overflow-hidden border-t border-white/[0.06] py-4">
        <div className="flex w-max animate-marquee gap-10 whitespace-nowrap">
          {ticker.map((place, i) => (
            <span key={i} className="flex items-center gap-10 font-display text-lg italic text-bg/40">
              {place}
              <span aria-hidden className="text-orange/60">+</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
