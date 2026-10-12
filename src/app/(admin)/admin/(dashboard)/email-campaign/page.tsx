import type { Metadata } from "next";
import EmailCampaignPreview from "@/components/admin/EmailCampaignPreview";

export const metadata: Metadata = { title: "Email campaign", robots: { index: false, follow: false } };

export default function EmailCampaignPage() {
  return <div>
    <p className="text-sm font-semibold text-cj-red">Marketing campaign</p>
    <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cj-navy">Website launch email</h1>
    <p className="mt-4 max-w-2xl leading-relaxed text-cj-charcoal">A preview of the launch email that would invite customers to explore Chicken Joo and use the 25% website-order offer.</p>
    <dl className="mt-6 space-y-4 rounded-2xl bg-white p-6 ring-1 ring-cj-navy/10">
      <div><dt className="text-sm font-semibold text-cj-charcoal">From</dt><dd className="mt-1 break-words font-semibold text-cj-navy">Chicken Joo &lt;jooservice@chickenjoo.com&gt;</dd></div>
      <div><dt className="text-sm font-semibold text-cj-charcoal">Subject</dt><dd className="mt-1 font-semibold text-cj-navy">Chicken Joo is online: get 25% off your website order</dd></div>
      <div><dt className="text-sm font-semibold text-cj-charcoal">Preheader</dt><dd className="mt-1 text-cj-navy">September 15–October 15, 2026. All branches. No minimum spend.</dd></div>
      <div><dt className="text-sm font-semibold text-cj-charcoal">Offer</dt><dd className="mt-1 text-cj-navy">25% off the total website order. One redemption per browser.</dd></div>
    </dl>
    <EmailCampaignPreview />
  </div>;
}
