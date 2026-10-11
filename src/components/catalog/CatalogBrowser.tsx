"use client";

import { useState } from "react";
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
  const resultLabel = kind === "menu"
    ? data?.meta.total === 1 ? "dish" : "dishes"
    : data?.meta.total === 1 ? "branch" : "branches";

  return (
    <div>
      <CatalogControls kind={kind} options={data?.options ?? []} onApply={(q, filter) => setQuery({ q, filter, page: 1 })} />
      {kind === "menu" && <p className="mt-5 text-sm leading-relaxed text-cj-charcoal/85">Demo pickup ordering. No payment or food preparation takes place. Availability is for this demonstration and does not reflect live restaurant stock.</p>}
      <div aria-busy={loading} className="mt-8">
        <p role="status" className="mb-5 text-sm text-cj-navy">
          {loading ? `Loading ${kind === "menu" ? "menu" : "branches"}…` : error ? "" : `${data?.meta.total ?? 0} ${resultLabel} found`}
        </p>
        {loading ? (
          <div aria-hidden="true" className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((key) => <div key={key} className="h-64 rounded-3xl bg-cj-navy/5 motion-safe:animate-pulse" />)}
          </div>
        ) : error ? (
          <div role="alert" className="rounded-2xl border border-cj-navy/20 bg-white p-6">
            <h2 className="font-display text-xl font-semibold text-cj-navy">We couldn’t load the {kind === "menu" ? "menu" : "branches"}.</h2>
            <p className="mt-3 text-sm leading-relaxed">Please try again shortly.</p>
            <button type="button" onClick={retry} className="mt-5 min-h-11 rounded-xl bg-cj-navy px-5 py-3 text-sm font-semibold text-white hover:bg-cj-navy/90">Try again</button>
          </div>
        ) : data?.data.length ? (
          <div className={`grid gap-6 sm:grid-cols-2 ${kind === "menu" ? "lg:grid-cols-3" : ""}`}>
            {data.data.map((item) => "priceCentavos" in item ? <MenuItemCard key={item.id} item={item} /> : <BranchCard key={item.id} branch={item} />)}
          </div>
        ) : (
          <div className="rounded-2xl border border-cj-navy/15 bg-white p-8">
            <h2 className="font-display text-2xl font-semibold text-cj-navy">{hasFilters ? "No matches yet" : kind === "menu" ? "Menu updates are on the way" : "Branch details are on the way"}</h2>
            <p className="mt-3 max-w-xl text-base leading-relaxed text-cj-charcoal/85">
              {hasFilters ? "Try a different search or use Clear filters to see everything available." : kind === "menu" ? "Verified dishes and prices haven’t been added yet. Please check back soon." : "Verified branch addresses and hours haven’t been added yet. Please check back soon."}
            </p>
          </div>
        )}
      </div>
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
