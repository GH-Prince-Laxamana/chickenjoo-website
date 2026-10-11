import type { PublicBranch } from "@/lib/public/types";

export default function BranchCard({ branch }: { branch: PublicBranch }) {
  return (
    <article className="flex min-w-0 flex-col rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10">
      <p className="mb-3 text-sm font-semibold text-cj-navy">{branch.city}{branch.province ? `, ${branch.province}` : ""}</p>
      <h2 className="break-words font-display text-2xl font-semibold text-cj-navy">{branch.name}</h2>
      <address className="mt-4 break-words text-base not-italic leading-relaxed text-cj-charcoal/85">{branch.address}</address>
      <dl className="mt-5 space-y-3 text-sm leading-relaxed">
        <div><dt className="font-semibold text-cj-navy">Hours</dt><dd className="mt-1 whitespace-pre-line break-words">{branch.businessHours || "Hours have not been supplied yet."}</dd></div>
        {branch.phone && <div><dt className="font-semibold text-cj-navy">Phone</dt><dd className="mt-1"><a href={`tel:${branch.phone.replace(/[^+\d]/g, "")}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{branch.phone}</a></dd></div>}
        {branch.email && <div><dt className="font-semibold text-cj-navy">Email</dt><dd className="mt-1"><a href={`mailto:${encodeURIComponent(branch.email)}`} className="inline-flex min-h-11 items-center break-all underline underline-offset-4">{branch.email}</a></dd></div>}
      </dl>
      <a href={branch.directionsUrl} aria-label={`Open ${branch.name} in Google Maps (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="mt-6 inline-flex min-h-11 items-center justify-center rounded-xl border border-cj-navy/25 px-4 py-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream">
        Open in Google Maps <span className="sr-only">(opens in a new tab)</span>
      </a>
      {branch.facebookUrl && <a href={branch.facebookUrl} aria-label={`${branch.name} Facebook page (opens in a new tab)`} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold text-cj-navy underline underline-offset-4">
        Branch Facebook page <span className="sr-only">(opens in a new tab)</span>
      </a>}
    </article>
  );
}
