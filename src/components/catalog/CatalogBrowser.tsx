"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { flavorArtwork } from "@/lib/public/menu-artwork";
import type { PublicBranch, PublicMenuItem } from "@/lib/public/types";
import CatalogControls from "./CatalogControls";
import MenuItemCard from "./MenuItemCard";
import BranchCard from "./BranchCard";
import { usePublicList } from "./usePublicList";

export default function CatalogBrowser({ kind }: { kind: "menu" | "branches" }) {
  const [query, setQuery] = useState({ q: "", filter: "", page: 1 });
  const params = new URLSearchParams({ page: String(query.page) });
  if (query.q) params.set("q", query.q);
  if (query.filter) params.set(kind === "menu" ? "category" : "city", query.filter);
  const endpoint = kind === "menu" ? "menu-items" : "branches";
  const { data, loading, error, retry } = usePublicList<PublicMenuItem | PublicBranch>(`/api/v1/${endpoint}?${params}`);
  const hasFilters = Boolean(query.q || query.filter || query.page > 1);
  const dishes = (data?.data ?? []).filter((item): item is PublicMenuItem => "priceCentavos" in item);
  const flavors = [...new Set(dishes.flatMap((item) => item.flavorOptions))];
  const galleryFlavors = [...new Set([...Object.keys(flavorArtwork), ...flavors])];
  const resultLabel = kind === "menu"
    ? data?.meta.total === 1 ? "dish" : "dishes"
    : data?.meta.total === 1 ? "branch" : "branches";

  return (
    <div>
      <CatalogControls kind={kind} showFlavors={!hasFilters && flavors.length > 0} options={data?.options ?? []} onApply={(q, filter) => setQuery({ q, filter, page: 1 })} />
      <div aria-busy={loading} className="mt-5">
        <p role="status" className={kind === "menu" && !loading ? "sr-only" : "mb-3 text-xs text-cj-charcoal"}>
          {loading ? `Loading ${kind === "menu" ? "menu" : "branches"}…` : error ? "" : `${data?.meta.total ?? 0} ${resultLabel} found`}
        </p>
        {loading ? (
          <div aria-hidden="true" className={kind === "menu" ? "grid grid-cols-2 gap-6 lg:grid-cols-3" : "grid gap-6 sm:grid-cols-2 lg:grid-cols-3"}>
            {[1, 2, 3].map((key) => <div key={key} className="h-64 rounded-3xl bg-cj-navy/5 motion-safe:animate-pulse" />)}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-cj-navy/20 bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-cj-navy">We couldn’t load the {kind === "menu" ? "menu" : "branches"}.</h2>
            <p className="mt-3 text-sm leading-relaxed">Please try again shortly.</p>
            <button type="button" onClick={retry} className="mt-5 min-h-11 rounded-xl bg-cj-navy px-5 py-3 text-sm font-semibold text-white hover:bg-cj-navy/90">Try again</button>
          </div>
        ) : data?.data.length ? (
          kind === "menu" ? <>

            {[...new Set(dishes.map((item) => item.category))].sort((a, b) => {
              const order = ["Meals", "Chicken", "Sides"];
              return (order.includes(a) ? order.indexOf(a) : 3) - (order.includes(b) ? order.indexOf(b) : 3);
            }).map((group) => <section key={group} className="menu-section">
              <div className="mb-4"><h2 className="text-xl font-bold tracking-tight text-cj-navy sm:text-2xl">{group === "Chicken" ? "Chicken à la carte" : group === "Meals" ? "Chicken Joo meals" : group === "Sides" ? "A little something on the side" : group}</h2><p className="mt-1 text-sm text-cj-charcoal">{group === "Chicken" ? "More chicken. More people to share it with." : group === "Meals" ? "Your chicken break starts here." : group === "Sides" ? "Make room for your favorites." : "Find your next craving."}</p></div>
              <div className="grid grid-cols-2 items-stretch gap-x-4 gap-y-7 sm:gap-x-6 md:grid-cols-3">{dishes.filter((item) => item.category === group).map((item, index, list) => <div key={item.id} className={list.length % 2 === 1 && index === list.length - 1 ? "col-span-2 mx-auto w-[calc(50%-8px)] sm:w-[calc(50%-12px)] md:col-span-1 md:w-full" : ""}><MenuItemCard item={item} /></div>)}</div>
            </section>)}
            {!hasFilters && flavors.length > 0 && <section className="menu-section scroll-mt-6" id="menu-flavors" aria-labelledby="menu-flavors-heading"><h2 id="menu-flavors-heading" className="text-xl font-bold tracking-tight text-cj-navy sm:text-2xl">Find your flavor</h2><p className="mb-5 mt-1 text-sm leading-relaxed">Explore the flavors. Your meal options show what you can currently order.</p><ul className="grid grid-cols-2 gap-x-4 gap-y-6 md:grid-cols-4">{galleryFlavors.map((flavor) => <li key={flavor} className="text-center">{Object.hasOwn(flavorArtwork, flavor) && <div className="relative aspect-[4/3]"><Image src={flavorArtwork[flavor]} alt={`${flavor} boneless chicken`} fill sizes="(max-width: 639px) 45vw, 240px" className="object-contain mix-blend-multiply" /></div>}<h3 className="mt-2 text-sm font-bold text-cj-navy">{flavor}</h3>{!flavors.includes(flavor) && <p className="mt-1 text-xs text-cj-charcoal">Ask your branch</p>}</li>)}</ul></section>}

          </> : <div className="grid gap-4 md:grid-cols-2">{data.data.map((item) => "priceCentavos" in item ? null : <BranchCard key={item.id} branch={item} />)}</div>
        ) : (
          <div className="rounded-2xl border border-cj-navy/15 bg-white p-8">
            <h2 className="font-display text-2xl font-semibold text-cj-navy">{hasFilters ? "No matches yet" : kind === "menu" ? "Menu updates are on the way" : "Branch details are on the way"}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cj-charcoal/85">
              {hasFilters ? "Try a different search or use Clear filters to see everything available." : kind === "menu" ? "Verified dishes and prices haven’t been added yet. Please check back soon." : "Verified branch addresses and hours haven’t been added yet. Please check back soon."}
            </p>
          </div>
        )}
      </div>
      {kind === "menu" && <div className="mt-8 border-t border-cj-navy/10 pt-6"><Link href="/cart" className="menu-choose w-full sm:w-auto sm:px-10">View your cart<ArrowRight aria-hidden="true" size={20} /></Link><p className="mt-4 text-xs leading-relaxed text-cj-charcoal">Demo pickup ordering only; no payment or food preparation takes place.</p></div>}
      {!error && data && data.meta.totalPages > 1 && (
        <nav aria-label={`${kind === "menu" ? "Menu" : "Branches"} pagination`} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button type="button" disabled={loading || query.page <= 1} onClick={() => setQuery((previous) => ({ ...previous, page: previous.page - 1 }))} className="min-h-11 rounded-xl border border-cj-navy/25 bg-white px-5 py-3 font-semibold text-cj-navy disabled:cursor-not-allowed disabled:opacity-50">Previous</button>
          <p className="text-sm text-cj-navy">Page {query.page} of {data.meta.totalPages}</p>
          <button type="button" disabled={loading || query.page >= data.meta.totalPages} onClick={() => setQuery((previous) => ({ ...previous, page: previous.page + 1 }))} className="min-h-11 rounded-xl border border-cj-navy/25 bg-white px-5 py-3 font-semibold text-cj-navy disabled:cursor-not-allowed disabled:opacity-50">Next</button>
        </nav>
      )}
    </div>
  );
}
