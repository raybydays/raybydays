import Link from "next/link";

const links = [
  { href: "/travels", label: "Travels" },
  { href: "/vlogs", label: "Vlogs" },
  { href: "/about", label: "About" },
];

export function Nav() {
  return (
    <nav className="mx-auto flex max-w-5xl items-center justify-between px-7 py-6">
      <Link href="/" className="text-2xl font-extrabold tracking-tight">
        ray<span className="bg-gradient-to-r from-orange to-rose bg-clip-text text-transparent">bydays</span>
      </Link>
      <div className="flex gap-2">
        {links.map(l => (
          <Link key={l.href} href={l.href}
            className="rounded-full border border-line bg-card px-4 py-2 text-sm font-medium text-muted transition hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
            {l.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
