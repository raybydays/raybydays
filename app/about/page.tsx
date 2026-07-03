import { site } from "@/lib/site";

export const metadata = { title: "About" };

export default function About() {
  return (
    <main className="mx-auto max-w-3xl px-7 py-12">
      <h1 className="font-display text-6xl font-extrabold tracking-tight">Hey, I&apos;m Ray.</h1>
      <div className="prose prose-lg mt-6 text-muted">
        <p>
          I&apos;m Raymond — Ray, mostly. Based in Singapore. I sell enterprise software by day, and
          spend the rest of my time chasing adventures and learning to film them.
        </p>
        <p>
          This site is where I keep the good days: trips, food, and the everyday moments in
          between. Some are photo stories, some are videos. No script, no polish for its own
          sake — just life as it happens.
        </p>
        <p>
          Find me on <a href={site.instagram}>Instagram</a>, or say hi at{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
      </div>
    </main>
  );
}
