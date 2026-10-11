"use client";
import Image from "next/image";
import { useState } from "react";
export default function ContentImage({ src, label }: { src?: string | null; label: string }) {
  const [failed, setFailed] = useState(false);
  return <div className="relative flex aspect-[16/9] items-center justify-center overflow-hidden rounded-2xl bg-cj-navy/5 p-6 text-center">{src && !failed ? <Image src={src} alt={label} fill sizes="(max-width: 640px) 100vw, 50vw" className="object-cover" onError={() => setFailed(true)} /> : <p className="text-sm text-cj-navy"><span className="block font-semibold">{label}</span><span className="mt-1 block">Image to be supplied</span></p>}</div>;
}
