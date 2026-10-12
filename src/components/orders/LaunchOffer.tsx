"use client";
import Link from "next/link";
import { peso } from "@/lib/orders/domain";
import { launchCampaign, launchPromotion } from "@/lib/orders/launch-campaign";
import { useLaunchVoucher } from "@/lib/orders/voucher";
export default function LaunchOffer({ subtotalCentavos }: { subtotalCentavos?: number }) {
  const status = useLaunchVoucher();
  if (status === "inactive") return null;
  const promotion = status === "available" && subtotalCentavos !== undefined ? launchPromotion(subtotalCentavos) : undefined;
  return <aside aria-label="Website launch offer" className="mt-5 rounded-2xl bg-cj-yellow/25 p-5 text-cj-navy">
    <p className="font-bold">25% off your total website order</p>
    <p className="mt-2 text-sm leading-relaxed">September 15–October 15, 2026. All branches. No minimum spend.</p>
    <p role="status" className="mt-2 text-sm leading-relaxed">{status === "checking" ? "Checking your launch voucher…" : status === "redeemed" ? "Your launch voucher has already been redeemed in this browser." : status === "unavailable" ? "Enable browser storage to use the launch voucher." : "Your launch voucher will apply automatically at checkout. One redemption per browser."}</p>
    {promotion && <p className="mt-3 text-sm font-semibold">Estimated savings: {peso(promotion.discountCentavos)} · Estimated total: {peso(subtotalCentavos! - promotion.discountCentavos)}</p>}
    <Link href={`/news/${launchCampaign.slug}`} className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold underline underline-offset-4">See offer details</Link>
  </aside>;
}
