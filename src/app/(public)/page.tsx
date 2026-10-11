import type { Metadata } from "next";
import Link from "next/link";
import MenuItemCard from "@/components/catalog/MenuItemCard";
import { getPublicMenu } from "@/lib/public/catalog";
import type { PublicMenuItem } from "@/lib/public/types";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore Chicken Joo's chicken, meals, sides, and Pampanga branches on this student demonstration website.",
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  let items: PublicMenuItem[] = [];
  let menuUnavailable = false;
  try {
    items = (await getPublicMenu({ q: "", filter: "", page: 1, limit: 3 })).data;
  } catch {
    menuUnavailable = true;
  }

  return (
    <div>
      <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
        <p className="text-sm font-semibold uppercase tracking-wider text-cj-navy">Chicken · Meals · Sides</p>
        <h1 className="mt-5 font-display text-5xl font-semibold tracking-tight text-cj-navy sm:text-7xl">Chicken Joo</h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cj-charcoal/85">Explore the menu, discover the flavors, and find a branch in Pampanga.</p>
        <div className="mt-8 flex flex-wrap gap-4">
          <Link href="/menu" className="inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white hover:bg-cj-navy/90">Explore the menu</Link>
          <Link href="/branches" className="inline-flex min-h-11 items-center rounded-xl border border-cj-navy/25 bg-white px-6 py-3 font-semibold text-cj-navy hover:bg-cj-cream">Find a branch</Link>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="menu-preview-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="menu-preview-heading" className="font-display text-3xl font-semibold text-cj-navy">Explore the menu</h2>
          <Link href="/menu" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">See the full menu</Link>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-cj-charcoal/85">Demo pickup ordering. No payment or food preparation takes place. Availability is for the demonstration.</p>
        {items.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <MenuItemCard key={item.id} item={item} />)}</div> : (
          <p className="rounded-2xl border border-cj-navy/15 bg-white p-6 text-base leading-relaxed">{menuUnavailable ? "The menu preview is temporarily unavailable. Visit the Menu page to try again." : "Menu details are on the way. Please check back soon."}</p>
        )}
      </section>
    </div>
  );
}
