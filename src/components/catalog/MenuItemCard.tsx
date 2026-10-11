"use client";

import Image from "next/image";
import { useState } from "react";
import { isLocalMenuImage } from "@/lib/public/assets";
import type { PublicMenuItem } from "@/lib/public/types";
import { addToCart } from "@/lib/orders/cart";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" });

export default function MenuItemCard({ item }: { item: PublicMenuItem }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  function add() {
    if (flavors.filter(Boolean).length !== item.requiredFlavorCount || new Set(flavors).size !== item.requiredFlavorCount) { setMessage("Choose the required number of distinct flavors."); return; }
    try { addToCart({ menuItemId: item.id, name: item.name, priceCentavos: item.priceCentavos, quantity, flavors }); setMessage("Added to your cart."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to add this item."); }
  }
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
          {Array.from({ length: item.requiredFlavorCount }, (_, index) => <label key={index} className="mt-3 block">Flavor {index + 1} for {item.name}<select className="mt-1 min-h-11 w-full rounded-lg border border-cj-navy/25 bg-white px-3" disabled={!item.isAvailable} value={flavors[index] || ""} onChange={(event) => { setFlavors((previous) => Array.from({ length: item.requiredFlavorCount }, (_, i) => i === index ? event.target.value : previous[i] || "")); setMessage(""); }}><option value="">Choose a flavor</option>{item.flavorOptions.map((flavor) => <option key={flavor}>{flavor}</option>)}</select></label>)}
        </div>}
        <p className="mt-5 text-2xl font-semibold text-cj-navy">{peso.format(item.priceCentavos / 100)}</p>
        <p className="mt-2 text-sm text-cj-charcoal/85">{item.isAvailable ? "Available in this demo" : "Currently unavailable"}</p>
        <label className="mt-4 text-sm">Quantity for {item.name}<select className="ml-3 min-h-11 rounded-lg border border-cj-navy/25 bg-white p-2" disabled={!item.isAvailable} value={quantity} onChange={(event) => setQuantity(Number(event.target.value))}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
        <button type="button" onClick={add} disabled={!item.isAvailable} className="mt-5 min-h-11 rounded-xl bg-cj-red px-4 py-3 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-cj-navy/10 disabled:text-cj-navy">
          {item.isAvailable ? "Add to demo cart" : "Unavailable for ordering"}
        </button>
        <p role="status" className="mt-2 text-sm">{message}</p>
        <p className="mt-2 text-xs leading-relaxed">Demo pickup ordering. No payment or food preparation takes place.</p>
      </div>
    </article>
  );
}
