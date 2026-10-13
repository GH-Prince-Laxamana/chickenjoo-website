"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, Clock3, MapPin, Phone } from "lucide-react";
import { SiFacebook } from "react-icons/si";
import type { PublicBranch } from "@/lib/public/types";
import CatalogControls from "../catalog/CatalogControls";
import { usePublicList } from "../catalog/usePublicList";
import BranchMap from "./BranchMap";

export default function BranchExplorer() {
  const [query, setQuery] = useState({ q: "", filter: "", page: 1 });
  const [activeId, setActiveId] = useState<string | null>(null);
  const params = new URLSearchParams({ q: query.q, city: query.filter, page: String(query.page) });
  const { data, loading, error, retry } = usePublicList<PublicBranch>(`/api/v1/branches?${params}`);
  const branches = loading || error ? [] : data?.data ?? [];
  const active = branches.find((branch) => branch.id === activeId) ?? null;
  const hasFilters = Boolean(query.q || query.filter);

  return (
    <section className="mx-auto grid w-full max-w-7xl gap-6 px-4 py-6 sm:px-8 lg:grid-cols-[46fr_54fr] lg:gap-8 lg:py-8">
      <div className="min-w-0 lg:pr-2">
        <header>
          <p className="text-sm font-semibold text-cj-red">Our branches</p>
          <h1 className="mt-3 max-w-lg font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy xl:text-5xl">Find your next Chicken Joo stop.</h1>
          <p className="mt-4 max-w-lg text-base leading-relaxed text-cj-charcoal">Your chicken break is closer than you think. Find a Pampanga branch and plan your visit.</p>
        </header>
        <CatalogControls kind="branches" options={data?.options ?? []} hasFilters={hasFilters} onApply={(q, filter) => { setQuery({ q, filter, page: 1 }); setActiveId(null); }} />
        <div className="mt-5" aria-busy={loading}>
          <div className="mb-3 flex items-center justify-between gap-3">
            <p role="status" className="text-sm text-cj-charcoal">{loading ? "Loading branches…" : error ? "Branch details unavailable" : `${data?.meta.total ?? 0} branches found`}</p>
            <a href="#branch-map" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-cj-navy lg:hidden">View map <ArrowUpRight size={16} aria-hidden="true" /></a>
          </div>
          {error ? <div role="alert" className="rounded-2xl bg-white p-6 shadow-sm"><p>We couldn’t load the branches. Please try again.</p><button onClick={retry} className="cj-button mt-4">Try again</button></div>
            : loading ? <div className="space-y-3">{[0, 1, 2].map((key) => <div key={key} className="h-44 rounded-2xl bg-white p-5 shadow-sm"><div className="h-5 w-2/3 rounded bg-cj-cream" /><div className="mt-4 h-12 rounded bg-cj-cream" /></div>)}</div>
              : branches.length ? <ul className="space-y-3">{branches.map((branch) => (
                <li key={branch.id}>
                  <article onMouseEnter={() => setActiveId(branch.id)} onFocus={() => setActiveId(branch.id)} className={`rounded-2xl border bg-white p-5 shadow-sm transition-colors ${active?.id === branch.id ? "border-cj-yellow bg-cj-yellow/5" : "border-cj-navy/10"}`}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="mb-1 flex items-center gap-1.5 text-xs font-semibold text-cj-red"><MapPin size={14} aria-hidden="true" />{branch.city}{branch.province ? `, ${branch.province}` : ""}</p>
                        <h2 className="font-display text-lg font-bold leading-snug tracking-tight text-cj-navy">{branch.name}</h2>
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        {branch.phone && <a href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`} aria-label={`Call ${branch.name} at ${branch.phone}`} title={`Call ${branch.phone}`} className="flex h-11 w-11 items-center justify-center rounded-full text-cj-navy transition-colors hover:bg-cj-cream hover:text-cj-red"><Phone size={19} aria-hidden="true" /></a>}
                        {branch.facebookUrl && <a href={branch.facebookUrl} target="_blank" rel="noopener noreferrer" aria-label={`${branch.name} Facebook page (opens in a new tab)`} title="Facebook page" className="flex h-11 w-11 items-center justify-center rounded-full text-cj-navy transition-colors hover:bg-cj-cream hover:text-cj-red"><SiFacebook size={18} aria-hidden="true" /></a>}
                      </div>
                    </div>
                    <address className="mt-2 text-sm not-italic leading-relaxed text-cj-charcoal">{branch.address}</address>
                    <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed text-cj-charcoal"><Clock3 size={15} className="shrink-0" aria-hidden="true" />{branch.businessHours || "Contact the branch for hours."}</p>
                  </article>
                </li>
              ))}</ul> : <div className="rounded-2xl bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-cj-navy">{hasFilters ? "No branches match your search" : "Branch details are being updated"}</h2><p className="mt-2 text-sm text-cj-charcoal">{hasFilters ? "Try another city or clear your filters." : "Check back soon for locations and hours."}</p></div>}
          {!error && data && data.meta.totalPages > 1 && <nav aria-label="Branch pagination" className="mt-5 flex items-center justify-between gap-3 text-sm"><button disabled={loading || query.page <= 1} onClick={() => { setActiveId(null); setQuery({ ...query, page: query.page - 1 }); }} className="cj-button disabled:opacity-50">Previous</button><span>Page {query.page} of {data.meta.totalPages}</span><button disabled={loading || query.page >= data.meta.totalPages} onClick={() => { setActiveId(null); setQuery({ ...query, page: query.page + 1 }); }} className="cj-button disabled:opacity-50">Next</button></nav>}
        </div>
        <aside className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-cj-yellow p-5 text-cj-navy"><div><h2 className="font-bold">Plan your chicken break.</h2><p className="mt-1 text-xs">Pick your favorites before you visit.</p></div><Link href="/menu" className="inline-flex min-h-11 items-center gap-1 text-sm font-bold">Explore the menu <ArrowUpRight size={17} aria-hidden="true" /></Link></aside>
      </div>
      <BranchMap branches={branches} active={active} onSelect={setActiveId} />
    </section>
  );
}
