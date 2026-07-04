import Link from "next/link";

const links = [
  { href: "/travels", label: "Travels" },
  { href: "/vlogs", label: "Vlogs" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <nav className="border-b border-white/[0.06] bg-ink">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-7 py-5">
        <Link href="/" className="font-display text-xl italic text-bg">
          raybydays
        </Link>
        <div className="flex items-center gap-7">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="text-[12.5px] font-semibold uppercase tracking-[0.08em] text-bg/85 transition hover:text-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach"
            >
              {l.label}
            </Link>
          ))}
          <a
            href="mailto:ray@raybydays.com"
            className="rounded-full bg-bg px-5 py-2 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-ink transition hover:bg-peach focus-visible:outline focus-visible:outline-2 focus-visible:outline-peach"
          >
            Subscribe
          </a>
        </div>
      </div>
    </nav>
  );
}
