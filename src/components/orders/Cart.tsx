"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Minus, Plus, ShoppingCart, Trash2, Utensils } from "lucide-react";
import { menuArtwork } from "@/lib/public/menu-artwork";
import { lineKey, setQuantity, useCart } from "@/lib/orders/cart";
import { peso } from "@/lib/orders/domain";
import { launchPromotion } from "@/lib/orders/launch-campaign";
import { useLaunchVoucher } from "@/lib/orders/voucher";
import DemoNotice from "./DemoNotice";
import LaunchOffer from "./LaunchOffer";

export default function Cart() {
  const items = useCart();
  const voucherStatus = useLaunchVoucher();
  const [error, setError] = useState("");
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.priceCentavos * item.quantity, 0);
  const promotion = voucherStatus === "available" ? launchPromotion(subtotal) : undefined;
  const discount = promotion?.discountCentavos ?? 0;

  function change(key: string, quantity: number) {
    try { setQuantity(key, quantity); setError(""); }
    catch (error) { setError(error instanceof Error ? error.message : "Unable to update cart."); }
  }

  return <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
    <header className="max-w-3xl"><p className="text-sm font-semibold text-cj-red">Your order</p><h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy sm:text-5xl">Shopping Cart</h1><p className="mt-3 text-base text-cj-charcoal">Review your picks before adding your pickup details.</p></header>
    <div className="mt-7">
      <DemoNotice />
      <LaunchOffer />
    </div>
    {error && <p className="mt-5 rounded-xl bg-cj-red/10 p-4 text-sm text-cj-red" role="alert">{error}</p>}
    {items.length ? <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,1fr)] lg:gap-8">
      <section aria-labelledby="cart-items-title" className="min-w-0 rounded-3xl border border-cj-navy/10 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-4 border-b border-cj-navy/10 px-5 py-5 sm:px-7"><h2 id="cart-items-title" className="font-display text-xl font-bold text-cj-navy">Your selections</h2><span className="text-sm text-cj-charcoal">{totalQuantity} {totalQuantity === 1 ? "item" : "items"}</span></div>
        <ul className="divide-y divide-cj-navy/10">{items.map((item) => {
          const key = lineKey(item);
          const image = Object.hasOwn(menuArtwork, item.name) ? menuArtwork[item.name] : null;
          const selection = `${item.name}${item.flavors.length ? ` (${item.flavors.join(", ")})` : ""}`;
          return <li key={key} className="p-5 sm:p-7">
            <div className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:gap-5">
              <div className="relative h-[72px] w-[72px] overflow-hidden rounded-2xl bg-cj-cream sm:h-[88px] sm:w-[88px]">{image ? <Image src={image} alt="" fill sizes="88px" className="object-contain p-2" /> : <span className="flex h-full items-center justify-center text-cj-navy/40"><Utensils size={28} aria-hidden="true" /></span>}</div>
              <div className="min-w-0"><h3 className="break-words font-display text-base font-bold leading-snug text-cj-navy sm:text-lg">{item.name}</h3>{item.flavors.length > 0 && <p className="mt-1 break-words text-sm text-cj-charcoal">{item.flavors.join(" · ")}</p>}<p className="mt-2 text-sm text-cj-charcoal">{peso(item.priceCentavos)} each</p></div>
            </div>
            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 pl-0 sm:pl-[108px]">
              <div className="flex items-center rounded-full border border-cj-navy/15 bg-cj-cream/50 text-cj-navy" role="group" aria-label={`Quantity for ${selection}`}>
                <button type="button" disabled={item.quantity <= 1} onClick={() => change(key, item.quantity - 1)} aria-label={`Decrease quantity of ${selection}`} className="flex h-11 w-11 items-center justify-center rounded-l-full hover:bg-cj-yellow/30 disabled:cursor-not-allowed disabled:opacity-40"><Minus size={16} aria-hidden="true" /></button>
                <span className="min-w-7 text-center text-sm font-bold" aria-label={`Quantity ${item.quantity}`}>{item.quantity}</span>
                <button type="button" disabled={item.quantity >= 10} onClick={() => change(key, item.quantity + 1)} aria-label={`Increase quantity of ${selection}`} className="flex h-11 w-11 items-center justify-center rounded-r-full hover:bg-cj-yellow/30 disabled:cursor-not-allowed disabled:opacity-40"><Plus size={16} aria-hidden="true" /></button>
              </div>
              <p className="ml-auto font-bold text-cj-navy" aria-label={`Subtotal for ${selection}: ${peso(item.priceCentavos * item.quantity)}`}>{peso(item.priceCentavos * item.quantity)}</p>
              <button type="button" onClick={() => change(key, 0)} aria-label={`Remove ${selection}`} className="flex h-11 w-11 items-center justify-center rounded-full text-cj-red hover:bg-cj-red/10"><Trash2 size={18} aria-hidden="true" /></button>
            </div>
          </li>;
        })}</ul>
      </section>
      <aside aria-labelledby="cart-summary-title" className="rounded-3xl border border-cj-navy/10 bg-white p-6 shadow-sm sm:p-7 lg:sticky lg:top-28">
        <h2 id="cart-summary-title" className="font-display text-xl font-bold text-cj-navy">Order summary</h2>
        <dl className="mt-6 space-y-4 text-sm"><div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="font-semibold text-cj-navy">{peso(subtotal)}</dd></div><div className="flex justify-between gap-4"><dt>{promotion ? promotion.name : "Promotion savings"}</dt><dd className={discount ? "font-semibold text-cj-red" : "text-cj-charcoal"}>{discount ? `−${peso(discount)}` : "—"}</dd></div><div className="flex items-baseline justify-between gap-4 border-t border-cj-navy/10 pt-5 text-cj-navy"><dt className="font-bold">Estimated total</dt><dd className="font-display text-2xl font-bold">{peso(subtotal - discount)}</dd></div></dl>
        <p className="mt-5 text-xs leading-relaxed text-cj-charcoal">Current prices, availability, and voucher eligibility are checked at pickup details. Payment is not collected online.</p>
        <Link href="/checkout" className="cj-button cj-button-order mt-6 w-full">Proceed to Pickup Details <ArrowRight size={18} aria-hidden="true" /></Link>
        <Link href="/menu" className="mt-2 inline-flex min-h-11 w-full items-center justify-center text-sm font-semibold text-cj-navy underline underline-offset-4">Continue shopping</Link>
      </aside>
    </div> : <div className="mx-auto mt-8 flex max-w-xl flex-col items-center rounded-3xl border border-cj-navy/10 bg-white px-6 py-12 text-center shadow-sm sm:py-16"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-cj-cream text-cj-navy"><ShoppingCart size={36} strokeWidth={1.6} aria-hidden="true" /></span><h2 className="mt-6 font-display text-2xl font-bold text-cj-navy">Your cart is empty.</h2><p className="mt-2 max-w-sm text-sm leading-relaxed text-cj-charcoal">Explore the menu and add something delicious for pickup.</p><Link href="/menu" className="cj-button cj-button-order mt-7">Browse Menu <ArrowRight size={18} aria-hidden="true" /></Link></div>}
    <Link href="/confirmation" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">View your latest receipt</Link>
  </div>;
}
