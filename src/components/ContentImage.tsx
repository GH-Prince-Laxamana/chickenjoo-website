"use client";
import Image from "next/image";
import { useState } from "react";
import { Newspaper } from "lucide-react";
export default function ContentImage({
  src,
  label,
  poster = false,
  card = false,
  landscape = false,
}: {
  src?: string | null;
  label: string;
  poster?: boolean;
  card?: boolean;
  landscape?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  return (
    <div
      className={`relative flex ${landscape ? "aspect-[6/5]" : poster || card ? "aspect-square" : "aspect-[16/9]"} ${card ? "bg-cj-cream" : poster ? "bg-white" : "bg-cj-navy/5"} items-center justify-center overflow-hidden ${card ? "" : ""} p-6 text-center`}
    >
      {src && !failed ? (
        <Image
          src={src}
          alt={label}
          fill
          sizes="(max-width: 640px) 100vw, 50vw"
          className="object-cover object-top"
          onError={() => setFailed(true)}
        />
      ) : card ? (
        <div className="flex flex-col items-center gap-3 text-cj-navy"><Newspaper size={36} strokeWidth={1.5} aria-hidden="true" /><span className="text-sm font-semibold">Chicken Joo news</span>{failed && <span className="text-xs">Image unavailable</span>}</div>
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
