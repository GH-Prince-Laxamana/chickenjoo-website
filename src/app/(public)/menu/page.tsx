import type { Metadata } from "next";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = { title: "Menu", description: "Choose your Chicken Joo meal, sharing box, or side. Browse current prices and the flavors available with each dish." };

export default function Menu() {
  return (
    <section className="mx-auto w-full max-w-7xl px-4 pb-16 pt-6 sm:px-8 sm:pt-8">
      <header>
        <p className="text-sm font-semibold text-cj-red">Our menu</p>
        <h1 className="mt-1 font-display text-3xl font-extrabold leading-tight tracking-tight text-cj-navy sm:text-4xl lg:whitespace-nowrap">Find your next chicken meal.</h1>
        <p className="mt-2 text-base leading-relaxed text-cj-charcoal lg:whitespace-nowrap lg:text-sm xl:text-base">Make lunch your own with a solo meal, or pass a chicken box around the barkada. Compare portions and prices, then choose your flavors.</p>
      </header>
      <CatalogBrowser kind="menu" />
    </section>
  );
}
