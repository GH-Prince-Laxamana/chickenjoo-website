"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import type { Receipt } from "@/lib/orders/domain";
import { refreshVoucher } from "@/lib/orders/voucher";
import DemoNotice from "./DemoNotice";
import OrderSummary from "./OrderSummary";
export default function Confirmation() {
  const [receipt, setReceipt] = useState<Receipt | null>(null), [error, setError] = useState(""), [retry, setRetry] = useState(0);
  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      try {
        const token = sessionStorage.getItem("cj-order-token");
        if (!token) throw new Error("No private receipt is saved in this tab.");
        const response = await fetch("/api/v1/orders/confirmation", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token }), signal: controller.signal });
        const result = await response.json();
        if (!response.ok) throw new Error(result.error?.message || "Unable to load the receipt.");
        refreshVoucher();
        setReceipt(result.data); setError("");
      } catch (error) { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load this receipt."); }
    }
    void load(); return () => controller.abort();
  }, [retry]);
  return <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8"><h1 className="font-display text-4xl font-semibold text-cj-navy">Your order summary</h1><div className="mt-5"><DemoNotice /></div>{receipt ? <><p className="mt-7 text-xl font-semibold">Order saved: {receipt.reference}</p><p className="mt-2">Order status: <span className="font-semibold capitalize">{receipt.status}</span></p><p className="mt-3 text-sm">Your meal choices are saved. Contact your branch to arrange pickup; saving this summary does not reserve a pickup time.</p><div className="mt-6"><OrderSummary quote={receipt} /></div></> : !error && <p role="status" className="mt-6">Loading your private receipt…</p>}{error && <p role="alert" className="mt-6">{error}</p>}<button onClick={() => setRetry((value) => value + 1)} className="mt-6 min-h-11 rounded-xl border border-cj-navy/25 px-5 py-3 font-semibold">{receipt ? "Refresh order status" : "Retry receipt"}</button><Link href="/menu" className="ml-5 mt-6 inline-flex min-h-11 items-center text-cj-navy underline">Back to menu</Link></div>;
}
