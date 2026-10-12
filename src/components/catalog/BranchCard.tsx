import type { PublicBranch } from "@/lib/public/types";
import { ArrowUpRight, Clock3, MapPin } from "lucide-react";

export default function BranchCard({ branch, headingLevel = 2 }: { branch: PublicBranch; headingLevel?: 2 | 3 }) {
  const Heading = headingLevel === 3 ? "h3" : "h2";
  return (
    <article className="flex min-w-0 flex-col rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10 sm:p-8">
      <p className="mb-4 flex items-center gap-2 text-sm font-semibold text-cj-red"><MapPin size={18} className="shrink-0" aria-hidden="true" />{branch.city}{branch.province ? `, ${branch.province}` : ""}</p>
      <Heading className="break-words font-display text-2xl font-bold tracking-tight text-cj-navy">{branch.name}</Heading>
      <address className="mt-3 break-words text-base not-italic leading-relaxed text-cj-charcoal">{branch.address}</address>
      <dl className="mt-5 space-y-3 text-sm leading-relaxed">
        <div className="rounded-2xl bg-cj-cream p-4"><dt className="flex items-center gap-2 font-semibold text-cj-navy"><Clock3 size={18} aria-hidden="true" />Opening hours</dt><dd className="mt-2 whitespace-pre-line break-words">{branch.businessHours || "Check with the branch for current hours."}</dd></div>
        {branch.phone && <div><dt className="font-semibold text-cj-navy">Phone</dt><dd className="mt-1"><a href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{branch.phone}</a></dd></div>}
        {branch.email && <div><dt className="font-semibold text-cj-navy">Email</dt><dd className="mt-1"><a href={`mailto:${encodeURIComponent(branch.email)}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4">{branch.email}</a></dd></div>}
      </dl>
      <div className="mt-auto pt-6">
        {branch.facebookUrl && <a href={branch.facebookUrl} aria-label={`${branch.name} Facebook page (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="mb-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cj-navy underline underline-offset-4">
          Branch Facebook page <ArrowUpRight size={16} aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
        </a>}
        <a href={branch.directionsUrl} aria-label={`Open ${branch.name} in Google Maps (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-cj-red px-5 py-3 text-sm font-semibold text-white hover:bg-cj-red/90">
          Open in Google Maps <ArrowUpRight size={18} className="shrink-0" aria-hidden="true" /><span className="sr-only">(opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
