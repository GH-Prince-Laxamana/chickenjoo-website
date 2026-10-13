import { MapPin } from "lucide-react";
import { peso, type Quote } from "@/lib/orders/domain";

export default function OrderSummary({ quote }: { quote: Quote }) {
  return <section aria-labelledby="pickup-summary-title" className="min-w-0 rounded-3xl border border-cj-navy/10 bg-white shadow-sm">
    <div className="border-b border-cj-navy/10 px-5 py-5 sm:px-7"><h2 id="pickup-summary-title" className="font-display text-xl font-bold text-cj-navy">Your pickup order details</h2></div>
    <div className="p-5 sm:p-7">
      <div className="rounded-2xl bg-cj-cream p-4"><p className="flex items-center gap-2 text-xs font-bold text-cj-red"><MapPin size={16} aria-hidden="true" />Pickup branch</p><p className="mt-2 font-bold text-cj-navy">{quote.branch.name}</p><p className="mt-1 text-sm leading-relaxed text-cj-charcoal">{quote.branch.address}</p></div>
      <ul className="mt-5 divide-y divide-cj-navy/10 border-y border-cj-navy/10">{quote.items.map((item, index) => <li key={index} className="py-4"><div className="flex items-start justify-between gap-3 text-sm font-semibold text-cj-navy"><span className="min-w-0 break-words">{item.quantity} × {item.name}</span><span className="shrink-0">{peso(item.lineTotalCentavos)}</span></div>{item.flavors.length > 0 && <p className="mt-1 text-xs leading-relaxed text-cj-charcoal">{item.flavors.join(" · ")}</p>}<p className="mt-1 text-xs text-cj-charcoal">{peso(item.unitPriceCentavos)} each</p></li>)}</ul>
      <dl className="mt-5 space-y-3 text-sm text-cj-charcoal"><div className="flex justify-between gap-4"><dt>Subtotal</dt><dd className="font-semibold text-cj-navy">{peso(quote.totalCentavos + (quote.promotion?.discountCentavos ?? 0))}</dd></div>{quote.promotion && <div className="flex justify-between gap-4"><dt>{quote.promotion.name}</dt><dd className="font-semibold text-cj-red">−{peso(quote.promotion.discountCentavos)}</dd></div>}<div className="flex items-baseline justify-between gap-4 border-t border-cj-navy/10 pt-5 font-bold text-cj-navy"><dt>Total</dt><dd className="font-display text-2xl">{peso(quote.totalCentavos)}</dd></div></dl>
      <p className="mt-4 text-xs leading-relaxed text-cj-charcoal">Payment is not collected online.</p>
    </div>
  </section>;
}
