import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto max-w-3xl px-7 py-24 text-center">
      <h1 className="font-display text-6xl font-extrabold">Lost the trail.</h1>
      <p className="mt-4 text-muted">That page wandered off.</p>
      <Link href="/" className="mt-6 inline-block rounded-full bg-orange px-6 py-3 font-semibold text-white">
        Back home
      </Link>
    </main>
  );
}
