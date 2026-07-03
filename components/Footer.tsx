import { site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="mx-auto mt-16 flex max-w-5xl items-center justify-between border-t border-line px-7 py-8 text-sm text-muted">
      <span>© {new Date().getFullYear()} Ray · raybydays.com</span>
      <span className="flex gap-4">
        <a href={site.instagram} className="hover:text-ink">Instagram</a>
        <a href={`mailto:${site.email}`} className="hover:text-ink">Email</a>
      </span>
    </footer>
  );
}
