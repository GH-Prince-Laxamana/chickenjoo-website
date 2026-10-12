"use client";
import Image from "next/image";
import { useState } from "react";
export default function ContentImage({
  src,
  label,
  poster = false,
}: {
  src?: string | null;
  label: string;
  poster?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative flex ${poster ? "aspect-square bg-white" : "aspect-[16/9] bg-cj-navy/5"} items-center justify-center overflow-hidden rounded-2xl p-6 text-center`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className={poster ? "object-contain" : "object-cover"}
          onError={() => setFailed(true)}
        />
      ) : (
        <p className="text-sm text-cj-navy">
          <span className="block font-semibold">{label}</span>
          <span className="mt-1 block">
            {failed ? "Photo temporarily unavailable" : "Photo coming soon"}
          </span>
        </p>
      )}
    </div>
  );
}
