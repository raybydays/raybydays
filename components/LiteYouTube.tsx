"use client";
import { useState } from "react";
import Image from "next/image";

export function LiteYouTube({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);
  if (play) {
    return (
      <div className="relative aspect-video overflow-hidden rounded-2xl">
        <iframe title={title} className="absolute inset-0 h-full w-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen />
      </div>
    );
  }
  return (
    <button onClick={() => setPlay(true)} aria-label={`Play video: ${title}`}
      className="group relative block aspect-video w-full overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange">
      <Image src={`https://i.ytimg.com/vi/${id}/maxresdefault.jpg`} alt="" fill className="object-cover" />
      <span className="absolute inset-0 bg-ink/20 transition group-hover:bg-ink/10" />
      <span className="absolute left-1/2 top-1/2 flex h-16 w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-2xl text-orange">▶</span>
    </button>
  );
}
