export default function EmailCampaignPreview() {
  return <section aria-label="Website launch email" className="admin-panel mt-8 overflow-hidden">
    <dl className="divide-y divide-cj-navy/10 border-b border-cj-navy/10 bg-[#f7f8fc]">
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-3 px-5 py-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:px-6"><dt className="text-xs font-bold uppercase tracking-wide text-cj-charcoal">From</dt><dd className="min-w-0 truncate text-sm font-semibold text-cj-navy" title="Chicken Joo <jooservice@chickenjoo.com>">Chicken Joo &lt;jooservice@chickenjoo.com&gt;</dd></div>
      <div className="grid grid-cols-[72px_minmax(0,1fr)] items-baseline gap-3 px-5 py-4 sm:grid-cols-[88px_minmax(0,1fr)] sm:px-6"><dt className="text-xs font-bold uppercase tracking-wide text-cj-charcoal">Subject</dt><dd className="min-w-0 truncate text-sm font-semibold text-cj-navy" title="Chicken Joo is online: get 25% off your website order">Chicken Joo is online: get 25% off your website order</dd></div>
    </dl>
    <iframe src="/email.html" title="Full Chicken Joo website launch email" sandbox="allow-popups allow-popups-to-escape-sandbox" className="block h-[75dvh] min-h-[600px] w-full border-0 bg-[#fff8ef]" />
  </section>;
}
