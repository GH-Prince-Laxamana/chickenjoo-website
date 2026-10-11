import type { Metadata } from "next";
import CatalogBrowser from "@/components/catalog/CatalogBrowser";

export const metadata: Metadata = { title: "Menu" };

export default function Menu() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-12 sm:px-8 sm:py-16">
      <h1 className="font-display text-4xl font-semibold text-cj-navy sm:text-5xl">Menu</h1>
      <p className="mt-5 max-w-2xl text-base leading-relaxed text-cj-charcoal/85">Explore the dishes, find your favorites, and browse by category.</p>
      <CatalogBrowser kind="menu" />
    </section>
  );
}
