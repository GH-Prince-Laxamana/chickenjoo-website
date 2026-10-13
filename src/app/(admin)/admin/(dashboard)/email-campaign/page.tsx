import type { Metadata } from "next";
import EmailCampaignPreview from "@/components/admin/EmailCampaignPreview";

export const metadata: Metadata = { title: "Email campaign", robots: { index: false, follow: false } };

export default function EmailCampaignPage() {
  return <div>
    <p className="text-sm font-semibold text-cj-red">Marketing campaign</p>
    <h1 className="mt-3 font-display text-4xl font-bold tracking-tight text-cj-navy">Website launch email</h1>
    <p className="mt-4 max-w-2xl leading-relaxed text-cj-charcoal">A preview of the launch email that would invite customers to explore Chicken Joo and use the 25% website-order offer.</p>
    <EmailCampaignPreview />
  </div>;
}
