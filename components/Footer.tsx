import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="border-t border-white/[0.06] bg-ink text-bg/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-7 py-8 text-sm">
        <span>© {new Date().getFullYear()} Ray · raybydays.com</span>
        <span className="flex gap-4">
          <a href={site.instagram} className="transition hover:text-peach">Instagram</a>
          <a href={`mailto:${site.email}`} className="transition hover:text-peach">Email</a>
        </span>
      </div>
    </footer>
  );
}
