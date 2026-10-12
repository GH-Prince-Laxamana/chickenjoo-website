import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = { title: "Branches", description: "Find Chicken Joo in Pampanga. Check branch addresses, opening hours, and directions before your next chicken break." };

export default function Branches() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-cj-red">Our branches</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-6xl">Find your next Chicken Joo stop.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cj-charcoal">A lunch break near campus or a chicken box after work. Find a Pampanga location that fits your day, check the hours, and open the map before heading over.</p>
      </header>
      <CatalogBrowser kind="branches" />
      <aside aria-labelledby="branch-menu-heading" className="mt-10 flex flex-col items-start justify-between gap-5 rounded-3xl bg-cj-yellow p-6 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-xl">
          <h2 id="branch-menu-heading" className="text-2xl font-extrabold tracking-tight text-cj-navy">Plan your chicken break.</h2>
          <p className="mt-2 text-sm leading-relaxed text-cj-navy">Browse solo meals, sharing boxes, and current prices before your visit.</p>
        </div>
        <Link href="/menu" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-navy px-6 py-3 text-sm font-bold text-white hover:bg-cj-navy/90">Explore the menu <ArrowRight size={18} aria-hidden="true" /></Link>
      </aside>
      <p className="mt-6 text-sm leading-relaxed text-cj-charcoal">Have a general question for Chicken Joo? <Link href="/contact" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline underline-offset-4">Get in touch</Link>.</p>
    </section>
  );
}
