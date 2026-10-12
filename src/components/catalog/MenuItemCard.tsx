"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Utensils, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { isLocalMenuImage } from "@/lib/public/assets";
import { menuArtwork } from "@/lib/public/menu-artwork";
import type { PublicMenuItem } from "@/lib/public/types";
import { addToCart } from "@/lib/orders/cart";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function MenuItemCard({ item, featured = false }: { item: PublicMenuItem; featured?: boolean }) {
  const [imageFailed, setImageFailed] = useState(false);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const suppliedImage = item.image && isLocalMenuImage(item.image) ? item.image : null;
  const image = !imageFailed ? suppliedImage || (Object.hasOwn(menuArtwork, item.name) ? menuArtwork[item.name] : null) : null;
  function add() {
    if (flavors.filter(Boolean).length !== item.requiredFlavorCount || new Set(flavors).size !== item.requiredFlavorCount) { setMessage("Choose the required number of distinct flavors."); return; }
    try { addToCart({ menuItemId: item.id, name: item.name, priceCentavos: item.priceCentavos, quantity, flavors }); setMessage("Added to your cart."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to add this item."); }
  }
  function openOrder() { setMessage(""); dialog.current?.showModal(); }

  return (
    <article id={featured ? undefined : `dish-${item.id}`} className={featured ? "menu-feature" : "menu-dish"}>
      <div className={featured ? "menu-feature-art" : "menu-dish-art"}>
        {featured && <span className="menu-feature-word" aria-hidden="true">Joo time!</span>}
        {image ? <Image src={image} alt={item.name} fill sizes={featured ? "(max-width: 639px) 90vw, 480px" : "(max-width: 639px) 45vw, 300px"} className="object-contain mix-blend-multiply" onError={() => setImageFailed(true)} /> : <span role="img" aria-label={`Photo coming soon for ${item.name}`} className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-cj-navy/40"><Utensils aria-hidden="true" size={32} strokeWidth={1.5} /></span>}
      </div>
      <div className={featured ? "menu-feature-details" : "menu-dish-details"}>
        <h3 className="font-bold leading-snug text-cj-navy">{item.name}</h3>
        <p className="mt-2 text-sm leading-relaxed text-cj-charcoal">{item.description}</p>
        {item.requiredFlavorCount > 0 && <p className="mt-2 text-xs font-semibold text-cj-navy">{item.requiredFlavorCount === 1 ? "Choose one flavor" : "Choose two different flavors"}</p>}
        <p className={`mt-2 text-xs ${item.isAvailable ? "text-cj-charcoal" : "font-semibold text-cj-red"}`}>{item.isAvailable ? "Available" : "Currently unavailable"}</p>
        <div className={featured ? "mt-4 flex flex-wrap items-center justify-between gap-3" : "mt-4 w-full"}>
          <p className="text-xl font-bold text-cj-red">{peso.format(item.priceCentavos / 100)}</p>
          <button type="button" onClick={openOrder} aria-haspopup="dialog" aria-label={`View ${item.isAvailable ? "options" : "details"} for ${item.name}, ${peso.format(item.priceCentavos / 100)}`} className={featured ? "menu-choose" : "menu-choose mt-3 w-full"}>
            {item.isAvailable ? "View options" : "View details"}
            <ArrowRight aria-hidden="true" size={16} className="shrink-0" />
          </button>
        </div>
      </div>
      <dialog ref={dialog} aria-labelledby={titleId} className="menu-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><h2 id={titleId} className="pt-2 text-xl font-bold leading-tight text-cj-navy">{item.name}</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Close meal options" className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-cj-cream text-cj-navy"><X aria-hidden="true" size={22} /></button></div>
          <p className="mt-3 text-xs font-semibold text-cj-red">{item.category}</p>
          <p className="mt-2 text-sm leading-relaxed">{item.description}</p>
          <p className="mt-2 text-lg font-bold text-cj-red">{peso.format(item.priceCentavos / 100)}</p>
          {item.requiredFlavorCount > 0 && <fieldset className="mt-5"><legend className="font-semibold text-cj-navy">{item.requiredFlavorCount === 1 ? "Pick your flavor" : "Pick two different flavors"}</legend>{Array.from({ length: item.requiredFlavorCount }, (_, index) => <label key={index} className="mt-3 block text-sm">Flavor {index + 1}<select className="mt-1 min-h-12 w-full rounded-xl border border-cj-navy/20 bg-cj-cream px-3 text-base" disabled={!item.isAvailable} value={flavors[index] || ""} onChange={(event) => { setFlavors((previous) => Array.from({ length: item.requiredFlavorCount }, (_, i) => i === index ? event.target.value : previous[i] || "")); setMessage(""); }}><option value="">Choose a flavor</option>{item.flavorOptions.map((flavor) => <option key={flavor}>{flavor}</option>)}</select></label>)}</fieldset>}
          <label className="mt-5 block text-sm font-semibold text-cj-navy">Quantity<select className="mt-1 min-h-12 w-full rounded-xl border border-cj-navy/20 bg-cj-cream px-3 text-base font-normal" disabled={!item.isAvailable} value={quantity} onChange={(event) => { setQuantity(Number(event.target.value)); setMessage(""); }}>{Array.from({ length: 10 }, (_, index) => <option key={index + 1}>{index + 1}</option>)}</select></label>
          <button type="button" onClick={add} disabled={!item.isAvailable} className="menu-choose mt-6 w-full disabled:cursor-not-allowed disabled:bg-cj-navy/10 disabled:text-cj-navy">{item.isAvailable ? `Add to cart · ${peso.format(item.priceCentavos * quantity / 100)}` : "Unavailable for ordering"}</button>
          <p role="status" className="mt-3 text-sm font-semibold text-cj-navy">{message}</p>
          {message === "Added to your cart." && <Link href="/cart" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-red underline underline-offset-4">View your cart</Link>}
          <p className="mt-4 text-xs leading-relaxed text-cj-charcoal">Current prices and availability are checked at checkout.</p>
        </div>
      </dialog>
    </article>
  );
}
