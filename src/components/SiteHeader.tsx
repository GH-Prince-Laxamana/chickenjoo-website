"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { publicNavigation } from "@/lib/navigation";
import { useCart } from "@/lib/orders/cart";

export default function SiteHeader() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const cart = useCart();

  return (
    <header className="relative z-20 bg-white shadow-[0_2px_15px_-8px_#11144720]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-2 sm:px-8 sm:py-3">
        <Link href="/" aria-label="Chicken Joo home" onClick={() => setMenuOpen(false)} className="mr-auto">
          <span className="relative block h-13 w-24 overflow-hidden"><Image src="/images/chicken-joo-logo.jpg" alt="Chicken Joo" width={1080} height={1080} className="absolute -left-3 -top-8 h-28 w-28 max-w-none" preload /></span>
        </Link>
        <button
          type="button"
          aria-expanded={menuOpen}
          aria-controls="public-navigation"
          onClick={() => setMenuOpen(!menuOpen)}
          className="flex min-h-11 min-w-11 items-center justify-center rounded-xl text-cj-red lg:hidden"
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
          <Link href="/cart" onClick={() => setMenuOpen(false)} className="inline-flex min-h-11 items-center rounded-xl px-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream" aria-current={pathname === "/cart" ? "page" : undefined}>Cart ({cart.reduce((sum, item) => sum + item.quantity, 0)})</Link>
        </nav>
      </div>
    </header>
  );
}
