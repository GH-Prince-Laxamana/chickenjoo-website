"use client";
import { useEffect, useState } from "react";
import { useUser } from "@/components/auth/UserProvider";
import { isLaunchCampaignActive } from "./launch-campaign";
type VoucherStatus = "checking" | "available" | "redeemed" | "unavailable" | "inactive" | "signin";
export function useLaunchVoucher() {
  const { user, loading, error } = useUser();
  const userId = user?.id;
  const [result, setResult] = useState<{ userId: string; status: VoucherStatus } | null>(null);
  useEffect(() => {
    if (!userId) return;
    let controller: AbortController;
    const refresh = async () => {
      controller?.abort(); controller = new AbortController();
      const current = controller;
      try {
        const response = await fetch("/api/v1/user/voucher", { cache: "no-store", signal: current.signal });
        if (!response.ok) throw new Error();
        const payload = await response.json();
        if (!current.signal.aborted) setResult({ userId, status: payload.data });
      } catch { if (!current.signal.aborted) setResult({ userId, status: "unavailable" }); }
    };
    void refresh();
    window.addEventListener("focus", refresh); window.addEventListener("cj-voucher-changed", refresh);
    return () => { controller?.abort(); window.removeEventListener("focus", refresh); window.removeEventListener("cj-voucher-changed", refresh); };
  }, [userId]);
  if (!isLaunchCampaignActive()) return "inactive";
  if (loading) return "checking";
  if (!user) return error ? "unavailable" : "signin";
  return result?.userId === user.id ? result.status : "checking";
}
export function refreshVoucher() { window.dispatchEvent(new Event("cj-voucher-changed")); }
