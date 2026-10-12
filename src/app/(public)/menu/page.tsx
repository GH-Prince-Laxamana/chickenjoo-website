import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = { title: "Menu", description: "Choose your Chicken Joo meal, sharing box, or side. Browse current prices and the flavors available with each dish." };

export default function Menu() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-cj-red">Our menu</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-6xl">Find your next chicken meal.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cj-charcoal">Make lunch your own with a solo meal, or pass a chicken box around the barkada. Compare portions and prices, then choose your flavors.</p>
      </header>
      <CatalogBrowser kind="menu" />
      <aside aria-labelledby="menu-visit-heading" className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-cj-yellow p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-xl">
          <h2 id="menu-visit-heading" className="text-2xl font-extrabold tracking-tight text-cj-navy">Found your chicken break?</h2>
          <p className="mt-2 text-sm leading-relaxed text-cj-navy">Find a Chicken Joo branch and check the hours and directions for your next visit.</p>
        </div>
        <Link href="/branches" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-navy px-6 py-3 text-sm font-bold text-white hover:bg-cj-navy/90">Find a branch <ArrowRight size={18} aria-hidden="true" /></Link>
      </aside>
    </section>
  );
}
