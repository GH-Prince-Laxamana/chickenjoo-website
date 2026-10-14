"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart, Utensils, X } from "lucide-react";
import { useId, useRef, useState } from "react";
import { isLocalMenuImage } from "@/lib/public/assets";
import { flavorArtwork, menuArtwork } from "@/lib/public/menu-artwork";
import type { PublicMenuItem } from "@/lib/public/types";
import { addToCart } from "@/lib/orders/cart";

const peso = new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP", minimumFractionDigits: 0, maximumFractionDigits: 2 });

export default function MenuItemCard({ item, featured = false }: { item: PublicMenuItem; featured?: boolean }) {
  const router = useRouter();
  const [imageFailed, setImageFailed] = useState(false);
  const [flavors, setFlavors] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [flavorErrors, setFlavorErrors] = useState<string[]>([]);
  const [quantity, setQuantity] = useState(1);
  const [adding, setAdding] = useState(false);
  const addingRef = useRef(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const titleId = useId();
  const suppliedImage = item.image && isLocalMenuImage(item.image) ? item.image : null;
  const image = !imageFailed ? suppliedImage || (Object.hasOwn(menuArtwork, item.name) ? menuArtwork[item.name] : null) : null;
  async function add() {
    if (addingRef.current) return;
    const errors = Array.from({ length: item.requiredFlavorCount }, (_, index) => !flavors[index]
      ? `Choose Flavor ${index + 1} to continue.`
      : flavors.slice(0, index).includes(flavors[index]) ? "Choose a different flavor for this box." : "");
    if (errors.some(Boolean)) {
      setFlavorErrors(errors); setMessage("");
      const firstError = errors.findIndex(Boolean);
      requestAnimationFrame(() => dialog.current?.querySelector<HTMLInputElement>(`input[name="${titleId}-flavor-${firstError}"]`)?.focus());
      return;
    }
    setFlavorErrors([]);
    addingRef.current = true; setAdding(true);
    try {
      if (await addToCart({ menuItemId: item.id, name: item.name, priceCentavos: item.priceCentavos, quantity, flavors })) setMessage("Added to your cart.");
      else { dialog.current?.close(); router.push(`/register?next=${encodeURIComponent(`/menu#dish-${item.id}`)}`); }
    }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to add this item."); }
    finally { addingRef.current = false; setAdding(false); }
  }
  function openOrder() { setMessage(""); setFlavorErrors([]); dialog.current?.showModal(); }

  return (
    <article id={featured ? undefined : `dish-${item.id}`} className={featured ? "menu-feature" : "menu-dish"}>
      <div className={featured ? "menu-feature-art" : "menu-dish-art"}>
        {featured && <span className="menu-feature-word" aria-hidden="true">Joo time!</span>}
        {image ? <Image src={image} alt={item.name} fill sizes={featured ? "(max-width: 639px) 90vw, 480px" : "(max-width: 639px) 90vw, (max-width: 1023px) 45vw, 300px"} className="object-contain mix-blend-multiply" onError={() => setImageFailed(true)} /> : <span role="img" aria-label={`Photo coming soon for ${item.name}`} className="flex h-20 w-20 items-center justify-center rounded-full bg-white text-cj-navy/40"><Utensils aria-hidden="true" size={32} strokeWidth={1.5} /></span>}
      </div>
      <div className={featured ? "menu-feature-details" : "menu-dish-details"}>
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 font-bold leading-snug text-cj-navy">{item.name}</h3>
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${item.isAvailable ? "bg-cj-navy/7 text-cj-navy" : "bg-cj-red/10 text-cj-red"}`}>{item.isAvailable ? "Available" : "Unavailable"}</span>
        </div>
        {item.requiredFlavorCount > 0 && <p className="mt-2 text-xs font-semibold text-cj-navy">{item.requiredFlavorCount === 1 ? "Choose one flavor" : "Choose two different flavors"}</p>}
        <p className="mt-3 text-sm leading-relaxed text-cj-charcoal">{item.description}</p>
        <div className="menu-dish-actions">
          <p className="whitespace-nowrap text-xl font-bold text-cj-red">{peso.format(item.priceCentavos / 100)}</p>
          <button type="button" onClick={openOrder} aria-haspopup="dialog" aria-label={`${item.isAvailable ? "Add" : "View details for"} ${item.name}, ${peso.format(item.priceCentavos / 100)}`} className="menu-choose">
            <ShoppingCart aria-hidden="true" size={18} className="shrink-0" />
            {item.isAvailable ? "Add to Cart" : "View details"}
          </button>
        </div>
      </div>
      <dialog ref={dialog} aria-labelledby={titleId} className="menu-dialog" onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close(); }}>
        <div className="p-5 sm:p-7">
          <div className="flex items-start justify-between gap-4"><h2 id={titleId} className="pt-2 text-xl font-bold leading-tight text-cj-navy">{item.name}</h2><button type="button" onClick={() => dialog.current?.close()} aria-label="Close meal options" className="flex min-h-11 min-w-11 items-center justify-center rounded-full bg-cj-cream text-cj-navy"><X aria-hidden="true" size={22} /></button></div>
          <p className="mt-2 text-xs font-bold uppercase tracking-wide text-cj-red">{item.category}</p>
          <p className="mt-2 text-sm leading-relaxed">{item.description}</p>
          <p className="mt-3 text-lg font-bold text-cj-red">{peso.format(item.priceCentavos / 100)} <span className="text-xs font-normal text-cj-charcoal">each</span></p>
          {item.requiredFlavorCount > 0 && <>
            <div className={`menu-flavor-previews ${item.requiredFlavorCount === 2 ? "menu-flavor-previews-pair" : ""}`} aria-live="polite">
              {Array.from({ length: item.requiredFlavorCount }, (_, index) => {
                const chosen = flavors[index];
                const photo = chosen && Object.hasOwn(flavorArtwork, chosen) ? flavorArtwork[chosen] : image;
                return <div key={index} className="menu-flavor-preview">
                  {photo ? <Image src={photo} alt={chosen ? `${chosen} chicken` : item.name} fill sizes="(max-width: 639px) 80vw, 260px" className="object-contain" /> : <Utensils aria-hidden="true" size={34} className="text-cj-navy/25" />}
                  <span className="menu-flavor-preview-label">{item.requiredFlavorCount === 2 ? `Flavor ${index + 1}: ` : ""}{chosen || "Choose a flavor"}</span>
                </div>;
              })}
            </div>
            <p className="mt-5 text-sm font-semibold text-cj-navy">{item.requiredFlavorCount === 1 ? "Pick your flavor" : "Pick two different flavors"}</p>
            {Array.from({ length: item.requiredFlavorCount }, (_, index) => <fieldset key={index} className="mt-4" aria-invalid={Boolean(flavorErrors[index])} aria-describedby={flavorErrors[index] ? `${titleId}-flavor-error-${index}` : undefined}>
              <legend className="mb-3 text-sm font-bold text-cj-navy">Flavor {index + 1} <span className="font-normal text-cj-charcoal">· Required</span></legend>
              <div className="grid grid-cols-2 gap-2 sm:gap-3">{item.flavorOptions.map((flavor) => <label key={flavor} className="menu-flavor-option">
                <input type="radio" name={`${titleId}-flavor-${index}`} value={flavor} checked={flavors[index] === flavor} disabled={!item.isAvailable} onChange={() => { setFlavors((previous) => Array.from({ length: item.requiredFlavorCount }, (_, i) => i === index ? flavor : previous[i] || "")); setFlavorErrors([]); setMessage(""); }} />
                <span className="menu-flavor-radio" aria-hidden="true" />
                <span className="min-w-0 text-sm font-semibold leading-tight text-cj-navy">{flavor}</span>
              </label>)}</div>
              {flavorErrors[index] && <p id={`${titleId}-flavor-error-${index}`} role="alert" className="mt-2 text-sm font-semibold text-cj-red">{flavorErrors[index]}</p>}
            </fieldset>)}
          </>}
          <div className="menu-dialog-footer">
            <div className="flex items-center justify-between"><span className="text-sm font-bold text-cj-navy">Quantity</span><div className="flex items-center rounded-full border border-cj-navy/20 bg-white"><button type="button" aria-label={`Decrease quantity of ${item.name}`} disabled={!item.isAvailable || quantity <= 1} onClick={() => { setQuantity((value) => Math.max(1, value - 1)); setMessage(""); }} className="flex h-11 w-11 items-center justify-center text-cj-navy disabled:opacity-35"><Minus size={17} aria-hidden="true" /></button><output aria-label="Quantity" className="min-w-7 text-center text-sm font-bold text-cj-navy">{quantity}</output><button type="button" aria-label={`Increase quantity of ${item.name}`} disabled={!item.isAvailable || quantity >= 10} onClick={() => { setQuantity((value) => Math.min(10, value + 1)); setMessage(""); }} className="flex h-11 w-11 items-center justify-center text-cj-navy disabled:opacity-35"><Plus size={17} aria-hidden="true" /></button></div></div>
            <button type="button" onClick={add} disabled={!item.isAvailable || adding} className="menu-choose mt-3 min-h-12 w-full disabled:cursor-not-allowed disabled:bg-cj-navy/10 disabled:text-cj-navy">{adding ? "Checking your account…" : item.isAvailable ? `Add to cart · ${peso.format(item.priceCentavos * quantity / 100)}` : "Unavailable for ordering"}</button>
            <p role={message && message !== "Added to your cart." ? "alert" : "status"} className={`mt-2 text-sm font-semibold ${message && message !== "Added to your cart." ? "text-cj-red" : "text-cj-navy"}`}>{message}</p>
            {message === "Added to your cart." && <div className="mt-2 flex flex-wrap items-center gap-4"><Link href="/checkout" className="cj-button">Order now</Link><Link href="/cart" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-red underline underline-offset-4">View your cart</Link></div>}
          </div>
        </div>
      </dialog>
    </article>
  );
}
