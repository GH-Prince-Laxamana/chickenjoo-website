import type { Metadata } from "next";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = { title: "Menu" };

export default function Menu() {
  return (
    <section className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-8 sm:py-10">
      <p className="cj-eyebrow">Chicken Joo</p><h1 className="cj-title mt-2">Our Menu</h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cj-charcoal sm:text-base">A little Joo for you. A whole box for the barkada.</p>
      <CatalogBrowser kind="menu" />
    </section>
  );
}
