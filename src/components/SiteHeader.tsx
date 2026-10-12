"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingCart, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { publicNavigation } from "@/lib/navigation";
import { useCart } from "@/lib/orders/cart";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-cj-navy/10 bg-white shadow-[0_2px_15px_-8px_#11144720]">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center gap-2 px-4 py-3 sm:gap-4 sm:px-8">
        <Link href="/" aria-label="Chicken Joo home" onClick={() => setMenuOpen(false)} className="mr-auto">
          <span className="relative block h-13 w-24 overflow-hidden"><Image src="/images/chicken-joo-logo.jpg" alt="Chicken Joo" width={1080} height={1080} className="absolute -left-3 -top-8 h-28 w-28 max-w-none" preload /></span>
        </Link>
        <Link href="/cart" onClick={() => setMenuOpen(false)} className="relative inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-cj-navy/15 px-3 font-semibold text-cj-navy transition-colors hover:bg-cj-cream lg:order-3" aria-label={`Cart, ${itemCount} items`} aria-current={pathname === "/cart" ? "page" : undefined}>
          <ShoppingCart size={22} aria-hidden="true" /><span className="hidden sm:inline">Cart</span>
          {itemCount > 0 && <span aria-hidden="true" className="absolute -right-1 -top-2 flex h-6 min-w-6 items-center justify-center rounded-full bg-cj-red px-1 text-xs font-bold text-white ring-2 ring-white">{itemCount}</span>}
        </Link>
        <span className="sr-only" role="status" aria-atomic="true">{itemCount} items in your cart</span>
        <Link href="/checkout" onClick={() => setMenuOpen(false)} className="cj-button cj-button-order hidden sm:inline-flex lg:order-4">Order now</Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-cj-red hover:bg-cj-cream lg:hidden"
        >
          <span className="sr-only">{menuOpen ? "Close menu" : "Open menu"}</span>{menuOpen ? <X aria-hidden="true" size={24} /> : <Menu aria-hidden="true" size={24} />}
        </button>
        <nav
          id="public-navigation"
          aria-label="Main navigation"
          onKeyDown={(event) => {
            if (event.key === "Escape" && menuOpen) {
              setMenuOpen(false);
              document.querySelector<HTMLButtonElement>('button[aria-controls="public-navigation"]')?.focus();
            }
          }}
          className={`${menuOpen ? "flex" : "hidden"} max-h-[calc(100dvh-100px)] w-full flex-col gap-1 overflow-y-auto lg:order-2 lg:mr-2 lg:flex lg:w-auto lg:flex-row`}
        >
          {publicNavigation.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              onClick={() => setMenuOpen(false)}
              className={`flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold transition-colors hover:bg-cj-cream ${pathname === href ? "bg-cj-cream text-cj-navy underline decoration-cj-red decoration-2 underline-offset-8" : "text-cj-charcoal"}`}
            >
              {label}
            </Link>
          ))}
          <Link href="/checkout" onClick={() => setMenuOpen(false)} className="cj-button cj-button-order mt-2 sm:hidden">Order now</Link>
        </nav>
      </div>
    </header>
  );
}
