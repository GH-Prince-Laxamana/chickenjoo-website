"use client";

import Image from "next/image";
import { ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";

const videoUrl = "https://youtu.be/Vk5hliXm3p8";

export default function FeaturedVideo() {
  const [status, setStatus] = useState<"loading" | "ready" | "unavailable">("loading");

  useEffect(() => {
    if (status !== "loading") return;
    const timer = window.setTimeout(() => setStatus("unavailable"), 12000);
    return () => window.clearTimeout(timer);
  }, [status]);

  return (
    <div className="min-w-0">
      <div className="relative aspect-video overflow-hidden rounded-3xl bg-cj-navy">
        {status !== "ready" && <div className="absolute inset-0 flex items-center justify-center">
          <Image src="/images/lifestyle/about-workday-break.webp" alt="" fill sizes="(max-width: 767px) 100vw, 700px" className="object-cover opacity-25" />
          <div className="relative px-5 text-center text-white">
            <p role="status" className="font-semibold">{status === "loading" ? "Loading your Joo moment…" : "Watch this Joo moment on YouTube."}</p>
            <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="cj-button mt-4">Open YouTube <ExternalLink size={16} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </div>
        </div>}
        {/* YouTube reports playback restrictions inside the frame; keep the direct link available. */}
        <iframe
          src="https://www.youtube-nocookie.com/embed/Vk5hliXm3p8?rel=0"
          title="Take a little Joo time — Chicken Joo promotional video"
          allow="encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          onLoad={() => setStatus("ready")}
          onError={() => setStatus("unavailable")}
          tabIndex={status === "ready" ? 0 : -1}
          className={`absolute inset-0 h-full w-full border-0 ${status === "ready" ? "" : "invisible"}`}
        />
      </div>
      <p className="mt-3 text-sm leading-relaxed text-white/85">Player unavailable? <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 font-semibold text-white underline underline-offset-4">Watch on YouTube <ExternalLink size={15} aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a></p>
    </div>
  );
}
