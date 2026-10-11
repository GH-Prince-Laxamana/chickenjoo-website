"use client";

import Image from "next/image";
import { useState } from "react";
import { isLocalMenuImage } from "@/lib/public/assets";
import type { PublicMenuItem } from "@/lib/public/types";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export default function MenuItemCard({ item }: { item: PublicMenuItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const image = item.image && isLocalMenuImage(item.image) && !imageFailed ? item.image : null;

  return (
    <article className="flex min-w-0 flex-col overflow-hidden rounded-3xl bg-white ring-1 ring-cj-navy/10">
      <div className="relative flex aspect-[4/3] items-center justify-center bg-cj-navy/5">
        {image ? (
          <Image src={image} alt={item.name} fill sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw" className="object-cover" onError={() => setImageFailed(true)} />
        ) : <p className="text-sm text-cj-navy/75">Photo coming soon</p>}
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-3 flex flex-wrap gap-2 text-xs font-semibold text-cj-navy">
          <span className="rounded-full bg-cj-cream px-3 py-1">{item.category}</span>
          {item.isFeatured && <span className="rounded-full bg-cj-yellow/35 px-3 py-1">Featured</span>}
        </div>
        <h2 className="break-words font-display text-xl font-semibold text-cj-navy">{item.name}</h2>
        <p className="mt-3 flex-1 break-words text-sm leading-relaxed text-cj-charcoal/85">{item.description}</p>
        {item.requiredFlavorCount > 0 && <div className="mt-4 text-sm leading-relaxed text-cj-charcoal/85">
          <p className="font-semibold text-cj-navy">{item.requiredFlavorCount === 1 ? "One flavor" : "Two flavors"} per item</p>
          <p className="mt-1">{item.flavorOptions.join(" · ")}</p>
        </div>}
        <p className="mt-5 text-2xl font-semibold text-cj-navy">{peso.format(item.priceCentavos / 100)}</p>
        <p className="mt-2 text-sm text-cj-charcoal/85">{item.isAvailable ? "Available in this demo" : "Currently unavailable"}</p>
        <button type="button" disabled className="mt-5 min-h-11 cursor-not-allowed rounded-xl bg-cj-navy/10 px-4 py-3 text-sm font-semibold text-cj-navy">
          {item.isAvailable ? "Demo ordering coming soon" : "Unavailable for ordering"}
        </button>
      </div>
    </article>
  );
}
