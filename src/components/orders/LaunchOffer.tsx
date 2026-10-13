"use client";

import Link from "next/link";
import { ArrowUpRight, BadgePercent, CircleCheck, Info } from "lucide-react";
import { launchCampaign } from "@/lib/orders/launch-campaign";
import { useLaunchVoucher } from "@/lib/orders/voucher";

export default function LaunchOffer() {
  const status = useLaunchVoucher();
  if (status === "inactive") return null;

  const statusLabel = status === "redeemed" ? "Already Redeemed" : status === "available" ? "Ready to use" : status === "checking" ? "Checking voucher" : "Voucher unavailable";
  const statusDetail = status === "redeemed" ? "This voucher has already been used in this browser." : status === "available" ? "Applies automatically at checkout. One redemption per browser." : status === "checking" ? "Checking your voucher status…" : "Enable browser storage to use this voucher.";
  const StatusIcon = status === "redeemed" || status === "available" ? CircleCheck : Info;

  return <aside aria-label="Website launch offer" className="relative isolate mt-4 overflow-hidden rounded-3xl bg-cj-red text-white shadow-sm">
    <div className="grid sm:grid-cols-[minmax(0,1fr)_220px]">
      <div className="px-6 pb-7 pt-7 sm:px-8 sm:py-8">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-white/85">Website launch offer</p>
        <p className="mt-3 font-display text-5xl font-black leading-none tracking-tight text-cj-yellow sm:text-6xl">25% <span className="text-white">OFF</span></p>
        <p className="mt-2 text-base font-semibold text-white sm:text-lg">Your total website order</p>
      </div>
      <div className="relative hidden items-center justify-center border-l border-dashed border-white/35 sm:flex" aria-hidden="true">
        <div className="absolute -left-3 -top-3 h-6 w-6 rounded-full bg-cj-cream" />
        <div className="absolute -bottom-3 -left-3 h-6 w-6 rounded-full bg-cj-cream" />
        <div className="flex h-36 w-36 rotate-[-12deg] items-center justify-center rounded-[28px] border border-white/25 bg-white/10 shadow-inner"><BadgePercent size={80} strokeWidth={1.2} className="text-cj-yellow" /></div>
      </div>
    </div>
    <div className="grid gap-4 border-t border-dashed border-white/35 px-6 py-5 sm:px-8 md:grid-cols-[minmax(0,1fr)_minmax(220px,1.2fr)_auto] md:items-center md:gap-6">
      <div><p className="text-sm font-semibold">September 15–October 15, 2026</p><p className="mt-1 text-xs text-white/85">All branches <span aria-hidden="true">•</span> No minimum spend</p></div>
      <div role="status" className="flex min-w-0 items-start gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-2.5">
        <StatusIcon size={17} className="mt-0.5 shrink-0 text-cj-yellow" aria-hidden="true" />
        <div><p className="text-sm font-bold leading-tight">{statusLabel}</p><p className="mt-1 text-xs leading-relaxed text-white/85">{statusDetail}</p></div>
      </div>
      <Link href={`/news/${launchCampaign.slug}`} className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-white underline decoration-cj-yellow underline-offset-4 md:justify-self-end">See offer details <ArrowUpRight size={16} aria-hidden="true" /></Link>
    </div>
  </aside>;
}
