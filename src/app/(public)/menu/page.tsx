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
    </section>
  );
}
