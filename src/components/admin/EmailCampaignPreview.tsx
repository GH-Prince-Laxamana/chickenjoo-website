"use client";
import { useState } from "react";

export default function EmailCampaignPreview() {
  const [mobile, setMobile] = useState(false);
  return <section aria-labelledby="email-preview-heading" className="mt-8">
    <div className="flex flex-wrap items-center justify-between gap-4">
      <h2 id="email-preview-heading" className="text-xl font-bold text-cj-navy">Email preview</h2>
      <div role="group" aria-label="Email preview size" className="flex gap-2">
        <button type="button" aria-pressed={!mobile} onClick={() => setMobile(false)} className={`min-h-11 rounded-full px-5 text-sm font-semibold ${!mobile ? "bg-cj-navy text-white" : "bg-white text-cj-navy ring-1 ring-cj-navy/15"}`}>Desktop</button>
        <button type="button" aria-pressed={mobile} onClick={() => setMobile(true)} className={`min-h-11 rounded-full px-5 text-sm font-semibold ${mobile ? "bg-cj-navy text-white" : "bg-white text-cj-navy ring-1 ring-cj-navy/15"}`}>Mobile</button>
      </div>
    </div>
    <div className="mt-5 rounded-3xl bg-cj-navy/5 p-2 sm:p-5">
      <iframe src="/email.html" title="Chicken Joo website launch promotional email" sandbox="allow-popups allow-popups-to-escape-sandbox" className="mx-auto block h-[1500px] w-full rounded-2xl border-0 bg-white" style={{ maxWidth: mobile ? 390 : 680 }} />
    </div>
    <p className="mt-3 text-sm text-cj-charcoal">Scroll inside the preview to see the full email. Campaign links open the website; this preview does not send email.</p>
  </section>;
}
