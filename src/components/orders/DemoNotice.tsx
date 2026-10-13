import { Info } from "lucide-react";

export default function DemoNotice() {
  return <div className="flex items-start gap-3 rounded-2xl border border-cj-navy/10 bg-white px-5 py-4 text-cj-navy shadow-sm sm:px-6">
    <Info size={19} className="mt-0.5 shrink-0 text-cj-red" aria-hidden="true" />
    <div><p className="text-sm font-bold">Pickup order</p><p className="mt-1 text-sm leading-relaxed text-cj-charcoal">Save your meal choices with a pickup branch. Payment is not collected on this website.</p></div>
  </div>;
}
