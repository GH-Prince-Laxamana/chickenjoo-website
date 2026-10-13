"use client";

import { useState } from "react";
import { ArrowUpRight, Clock3, Minus, Phone, Plus, RotateCcw, X } from "lucide-react";
import type { PublicBranch } from "@/lib/public/types";
import { branchPosition } from "./positions";

export default function BranchMap({ branches, active, onSelect }: { branches: PublicBranch[]; active: PublicBranch | null; onSelect: (id: string | null) => void }) {
  const [zoom, setZoom] = useState(1);
  const plotted = branches.flatMap((branch) => {
    const position = branchPosition(branch);
    return position ? [{ branch, position }] : [];
  });
  const activePosition = active && branchPosition(active);
  const project = (value: number) => 50 + (value - 50) * zoom;
  const below = activePosition && project(activePosition[1]) < 45;

  return (
    <div id="branch-map" tabIndex={-1} aria-label="Illustrated Pampanga branch map" onKeyDown={(event) => { if (event.key === "Escape") onSelect(null); }} className="relative isolate h-[660px] overflow-hidden rounded-3xl bg-[#E8F1FA] shadow-sm lg:sticky lg:top-28 lg:h-[calc(100dvh-140px)] lg:min-h-[660px] lg:max-h-[900px]">
      <svg viewBox={`${400 - 400 / zoom} ${400 - 400 / zoom} ${800 / zoom} ${800 / zoom}`} preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs><pattern id="branch-blocks" width="64" height="64" patternTransform="rotate(-18)" patternUnits="userSpaceOnUse"><rect x="5" y="5" width="53" height="53" rx="5" fill="#E8F1FA" /><path d="M0 0H64M0 0V64" stroke="#C7D9E9" strokeWidth="2" /></pattern></defs>
        <rect width="800" height="800" fill="url(#branch-blocks)" />
        <path d="M0 20L170 0L210 170L140 260L0 230Z" fill="#D5EADC" />
        <path d="M570 0L800 0L800 210L710 150L660 70Z" fill="#D5EADC" />
        <path d="M690 230C580 310 650 410 580 480S680 640 800 720" fill="none" stroke="#B5DCEB" strokeWidth="16" />
        <g fill="none" strokeLinecap="round">
          <path d="M80 800L205 535L305 384L330 240L410 0" stroke="#AFC7DD" strokeWidth="18" />
          <path d="M80 800L205 535L305 384L330 240L410 0" stroke="#FFFFFF" strokeWidth="11" />
          <path d="M-40 440L300 390L585 240L830 130M235 455L340 540L455 625L650 840" stroke="#FFFFFF" strokeWidth="10" />
          <path d="M0 610L310 500L740 370M80 110L320 255L730 660M430 800L400 520L570 230L560 0" stroke="#C4D7E7" strokeWidth="6" />
          <path d="M0 440L300 390L585 240L800 140M235 455L340 540L455 625L650 800" stroke="#9EB8D0" strokeWidth="1.5" />
        </g>
        <g fill="#274666" fontSize="16" fontFamily="inherit" fontWeight="600"><text x="110" y="345">Angeles City</text><text x="535" y="180">Magalang</text><text x="405" y="710">San Fernando</text></g>
        <g fill="#53718D" fontSize="11" fontFamily="inherit"><text x="280" y="230" transform="rotate(-75 280 230)">MacArthur Highway</text><text x="360" y="565" transform="rotate(38 360 565)">To San Fernando</text><text x="75" y="150">Clark area</text><text x="655" y="90">Mount Arayat area</text></g>
      </svg>
      <span className="pointer-events-none absolute right-5 top-5 rounded-full border border-cj-navy/10 bg-white/90 px-3 py-2 text-xs font-bold text-cj-navy" aria-hidden="true">N ↑</span>
      {plotted.map(({ branch, position }) => (
        <button key={branch.id} type="button" aria-label={`Show ${branch.name} details`} aria-pressed={active?.id === branch.id} onMouseEnter={() => onSelect(branch.id)} onFocus={() => onSelect(branch.id)} onClick={() => onSelect(branch.id)} className={`absolute z-10 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center transition-colors ${active?.id === branch.id ? "text-cj-yellow" : "text-cj-red"}`} style={{ left: `${project(position[0])}%`, top: `${project(position[1])}%` }}><svg viewBox="0 0 24 24" className="h-9 w-9" aria-hidden="true"><path fill="currentColor" fillRule="evenodd" d="M12 22s7-6.15 7-12a7 7 0 1 0-14 0c0 5.85 7 12 7 12ZM12 7.4a2.6 2.6 0 1 1 0 5.2a2.6 2.6 0 1 1 0-5.2Z" /></svg></button>
      ))}
      {active && activePosition && <article aria-label={`${active.name} map details`} className="absolute z-20 w-[min(320px,calc(100%-32px))] -translate-x-1/2 rounded-2xl bg-white p-5 text-cj-charcoal shadow-xl" style={{ left: `clamp(min(176px, 50%), ${project(activePosition[0])}%, max(calc(100% - 176px), 50%))`, top: `calc(${project(activePosition[1])}% ${below ? "+" : "-"} 34px)`, transform: below ? undefined : "translateY(-100%)" }}>
        <button type="button" onClick={() => onSelect(null)} aria-label="Close branch details" className="absolute right-2 top-2 flex h-11 w-11 items-center justify-center rounded-full text-cj-navy hover:bg-cj-cream"><X size={18} aria-hidden="true" /></button>
        <p className="pr-8 text-xs font-semibold text-cj-red">{active.city}, {active.province || "Pampanga"}</p>
        <h2 className="mt-2 pr-6 text-lg font-bold leading-tight tracking-tight text-cj-navy">{active.name}</h2>
        <address className="mt-3 text-sm not-italic leading-relaxed">{active.address}, {active.city}{active.province ? `, ${active.province}` : ""}</address>
        <p className="mt-3 flex items-start gap-2 text-xs leading-relaxed"><Clock3 size={16} className="shrink-0" aria-hidden="true" />{active.businessHours || "Contact the branch for hours."}</p>
        {active.phone ? <a href={`tel:${active.phone.replace(/[^+\d]/g, "")}`} className="mt-1 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cj-navy"><Phone size={15} aria-hidden="true" />{active.phone}</a> : <p className="mt-3 text-xs">Phone not listed</p>}
        <a href={active.directionsUrl} target="_blank" rel="noopener noreferrer" aria-label={`Open ${active.name} in Google Maps (opens in a new tab)`} className="mt-3 flex min-h-11 items-center justify-center gap-2 rounded-full bg-cj-navy px-3 py-2 text-xs font-bold text-white hover:bg-cj-navy/90">Open in Google Maps <ArrowUpRight size={16} aria-hidden="true" /></a>
      </article>}
      <div className="absolute bottom-5 right-5 flex flex-col rounded-xl bg-white p-1 shadow-lg">
        <button aria-label="Zoom in" disabled={zoom >= 1.4} onClick={() => setZoom(Math.min(1.4, zoom + .2))} className="flex h-11 w-11 items-center justify-center rounded-lg text-cj-navy hover:bg-cj-cream disabled:opacity-30"><Plus size={20} aria-hidden="true" /></button>
        <button aria-label="Zoom out" disabled={zoom <= 1} onClick={() => setZoom(Math.max(1, zoom - .2))} className="flex h-11 w-11 items-center justify-center rounded-lg text-cj-navy hover:bg-cj-cream disabled:opacity-30"><Minus size={20} aria-hidden="true" /></button>
        <button aria-label="Reset map view" onClick={() => { setZoom(1); onSelect(null); }} className="flex h-11 w-11 items-center justify-center rounded-lg text-cj-navy hover:bg-cj-cream"><RotateCcw size={17} aria-hidden="true" /></button>
      </div>
    </div>
  );
}
