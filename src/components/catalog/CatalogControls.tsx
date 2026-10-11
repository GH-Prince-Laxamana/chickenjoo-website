"use client";

import { useState } from "react";

export default function CatalogControls({ kind, options, onApply }: {
  kind: "menu" | "branches";
  options: string[];
  onApply: (q: string, filter: string) => void;
}) {
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("");
  const filterLabel = kind === "menu" ? "Category" : "City";
  const fieldClass = "mt-2 min-h-11 w-full rounded-xl border border-cj-navy/25 bg-white px-3 py-2 text-base text-cj-charcoal";

  return (
    <form
      role="search"
      aria-label={kind === "menu" ? "Search menu" : "Search branches"}
      onSubmit={(event) => { event.preventDefault(); onApply(q.trim(), filter); }}
      className="mt-8 flex flex-col gap-4 rounded-2xl bg-white p-5 ring-1 ring-cj-navy/10 sm:flex-row sm:flex-wrap sm:items-end"
    >
      <label className="flex-1 text-sm font-semibold text-cj-navy">
        {kind === "menu" ? "Search dishes" : "Search branches"}
        <input
          type="search" name="q" maxLength={80} value={q} onChange={(event) => setQ(event.target.value)}
          placeholder={kind === "menu" ? "Name or description" : "Name, address, or city"}
          className={fieldClass}
        />
      </label>
      <label className="text-sm font-semibold text-cj-navy sm:min-w-48">
        {filterLabel}
        <select name={kind === "menu" ? "category" : "city"} value={filter} onChange={(event) => setFilter(event.target.value)} className={fieldClass}>
          <option value="">{kind === "menu" ? "All categories" : "All cities"}</option>
          {options.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </label>
      <button type="submit" className="min-h-11 rounded-xl bg-cj-navy px-5 py-3 text-sm font-semibold text-white hover:bg-cj-navy/90">
        Search
      </button>
      <button type="button" onClick={() => { setQ(""); setFilter(""); onApply("", ""); }} className="min-h-11 rounded-xl px-4 py-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream">
        Clear filters
      </button>
    </form>
  );
}
