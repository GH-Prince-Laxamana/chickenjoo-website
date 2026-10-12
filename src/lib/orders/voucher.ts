"use client";
import { useSyncExternalStore } from "react";
import type { Receipt } from "./domain";
import { isLaunchCampaignActive, launchCampaign } from "./launch-campaign";
const key = "cj-website-launch-2026-redeemed";
const listeners = new Set<() => void>();
type VoucherStatus = "checking" | "available" | "redeemed" | "unavailable" | "inactive";
// shortcut: browser storage can be cleared and cannot prevent simultaneous redemptions; use server-side identity for real single-use vouchers.
export function launchVoucherStatus(): VoucherStatus {
  if (!isLaunchCampaignActive()) return "inactive";
  try { return localStorage.getItem(key) ? "redeemed" : "available"; }
  catch { return "unavailable"; }
}
function subscribe(listener: () => void) {
  listeners.add(listener); window.addEventListener("storage", listener);
  return () => { listeners.delete(listener); window.removeEventListener("storage", listener); };
}
export function useLaunchVoucher() {
  return useSyncExternalStore<VoucherStatus>(subscribe, launchVoucherStatus, () => "checking");
}
export function markLaunchVoucherRedeemed(receipt: Receipt) {
  if (receipt.promotion?.id !== launchCampaign.id) return true;
  try { localStorage.setItem(key, "1"); listeners.forEach(listener => listener()); return true; }
  catch { return false; }
}
