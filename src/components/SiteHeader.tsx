"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { publicNavigation } from "@/lib/navigation";
import { useCart } from "@/lib/orders/cart";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();

  return (
    <header className="border-b border-cj-navy/10 bg-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-8">
        <Link href="/" aria-label="Chicken Joo home" onClick={() => setMenuOpen(false)}>
          <Image src="/images/chicken-joo-logo.jpg" alt="Chicken Joo" width={140} height={80} className="h-16 w-auto" preload />
        </Link>
        <Link href="/cart" className="inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-4 text-sm font-semibold text-white" aria-current={pathname === "/cart" ? "page" : undefined}>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="min-h-11 rounded-xl border border-cj-navy/20 px-4 font-semibold text-cj-navy lg:hidden"
        >
          {menuOpen ? "Close menu" : "Open menu"}
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
          className={`${menuOpen ? "flex" : "hidden"} w-full flex-col gap-1 lg:flex lg:w-auto lg:flex-row`}
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
        </nav>
      </div>
    </header>
  );
}
