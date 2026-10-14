"use client";
import Link from "next/link";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { clearCart, useCart } from "@/lib/orders/cart";
import type { Quote } from "@/lib/orders/domain";
import { refreshVoucher, useLaunchVoucher } from "@/lib/orders/voucher";
import { useUser } from "@/components/auth/UserProvider";
import type { PublicBranch } from "@/lib/public/types";
import DemoNotice from "./DemoNotice";
import OrderSummary from "./OrderSummary";
import LaunchOffer from "./LaunchOffer";

export default function Checkout({ branches }: { branches: PublicBranch[] }) {
  const cart = useCart(), router = useRouter();
  const { user } = useUser();
  const voucherStatus = useLaunchVoucher(), launchVoucher = voucherStatus === "available";
  const [branchId, setBranchId] = useState("");
  const [review, setReview] = useState<{ quote: Quote; cartKey: string } | null>(null), [pending, setPending] = useState(false), [error, setError] = useState("");
  const busy = useRef(false), feedback = useRef<HTMLParagraphElement>(null), summary = useRef<HTMLDivElement>(null);
  const items = cart.map(({ menuItemId, quantity, flavors }) => ({ menuItemId, quantity, flavors }));
  const cartKey = JSON.stringify({ userId: user?.id, branchId, items, launchVoucher }), quote = review?.cartKey === cartKey ? review.quote : null;
  async function request(path: string, body: unknown) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) {
      if (response.status === 401) router.push("/login?next=%2Fcheckout");
      if (result.quote) setReview({ quote: result.quote, cartKey });
      throw new Error(result.error?.message || "Unable to complete this request.");
    }
    return result.data;
  }
  async function handle(submit: boolean) {
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    try {
      if (!user) { router.push("/login?next=%2Fcheckout"); throw new Error("Sign in to continue with your order."); }
      if (voucherStatus === "checking" || voucherStatus === "unavailable") throw new Error("Voucher status could not be confirmed. Refresh the page before continuing.");
      if (!submit || !quote) {
        const nextQuote = await request("/api/v1/orders/quote", { branchId, items, launchVoucher });
        setReview({ quote: nextQuote, cartKey });
        requestAnimationFrame(() => summary.current?.focus());
      } else {
        const payload = { branchId, items, launchVoucher, quoteHash: quote.hash };
        const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
        const fingerprint = user.id + ":" + Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
        let attempt: { fingerprint: string; submissionId: string; confirmationToken: string } | null = null;
        try { attempt = JSON.parse(sessionStorage.getItem("cj-order-attempt") || "null"); } catch { /* Replace a malformed local attempt. */ }
        if (attempt?.fingerprint !== fingerprint) attempt = { fingerprint, submissionId: crypto.randomUUID(), confirmationToken: Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("") };
        // Save the capability before submitting so a lost response still has a private receipt.
        sessionStorage.setItem("cj-order-attempt", JSON.stringify(attempt));
        sessionStorage.setItem("cj-order-token", attempt!.confirmationToken);
        await request("/api/v1/orders", { ...payload, submissionId: attempt!.submissionId, confirmationToken: attempt!.confirmationToken });
        refreshVoucher();
        try { clearCart(); } catch { /* A saved order must still reach its receipt if cart storage fails. */ }
        router.push("/confirmation");
      }
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to submit. Your cart is preserved."); requestAnimationFrame(() => feedback.current?.focus()); }
    finally { busy.current = false; setPending(false); }
  }
  return <div className="mx-auto w-full max-w-7xl px-4 py-10 sm:px-8 sm:py-14">
    <header className="max-w-3xl"><p className="text-sm font-semibold text-cj-red">Complete your order</p><h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy sm:text-5xl">Pickup Order Details</h1><p className="mt-3 text-base text-cj-charcoal">Confirm your account details and choose where you&apos;d like to pick up your order.</p></header>
    <div className="mt-7"><DemoNotice /><LaunchOffer /></div>
    {cart.length ? <form onSubmit={(event) => { event.preventDefault(); void handle(Boolean(quote)); }} className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1.75fr)_minmax(300px,1fr)] lg:gap-8">
      <section aria-labelledby="pickup-details-title" className="min-w-0 rounded-3xl border border-cj-navy/10 bg-white shadow-sm">
        <div className="border-b border-cj-navy/10 px-5 py-5 sm:px-7"><h2 id="pickup-details-title" className="font-display text-xl font-bold text-cj-navy">Pickup details</h2><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Your name and email are saved with your order details. A confirmation email is not sent.</p></div>
        <div className="space-y-5 p-5 sm:p-7">
          <label className="block text-sm font-bold text-cj-navy">Name<input required maxLength={100} autoComplete="name" disabled={pending} readOnly value={user?.name || ""} className="mt-2 min-h-12 w-full rounded-xl border border-cj-navy/20 bg-white px-4 py-3 text-base font-normal text-cj-navy placeholder:text-cj-charcoal/60" /></label>
          <label className="block text-sm font-bold text-cj-navy">Email address<input required type="email" maxLength={254} autoComplete="email" disabled={pending} readOnly value={user?.email || ""} className="mt-2 min-h-12 w-full rounded-xl border border-cj-navy/20 bg-white px-4 py-3 text-base font-normal text-cj-navy placeholder:text-cj-charcoal/60" /></label>
          <label className="block text-sm font-bold text-cj-navy">Pickup branch<select required disabled={pending} value={branchId} onChange={(event) => { setBranchId(event.target.value); setReview(null); }} className="mt-2 min-h-12 w-full rounded-xl border border-cj-navy/20 bg-white px-4 py-3 text-base font-normal text-cj-navy"><option value="">Choose a branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
          {!branches.length && <p role="alert" className="text-sm text-cj-red">No pickup branches are currently available.</p>}
          {!quote && <button disabled={pending || !branches.length} className="cj-button cj-button-order w-full sm:w-auto">{pending ? "Please wait…" : "Review current prices"} {!pending && <ArrowRight size={18} aria-hidden="true" />}</button>}
          <p className="border-t border-cj-navy/10 pt-5 text-sm leading-relaxed text-cj-charcoal">Your receipt is available in this tab for 24 hours. Keep the tab open to return to it.</p>
          {error && <p ref={feedback} tabIndex={-1} role="alert" className="rounded-xl bg-cj-red/10 p-4 text-sm text-cj-red">{error}</p>}
          <Link href="/cart" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">Edit cart</Link>
        </div>
      </section>
      <div ref={summary} tabIndex={-1} aria-label="Order review" className="min-w-0 lg:sticky lg:top-28">{quote ? <><OrderSummary quote={quote} /><button disabled={pending} className="cj-button cj-button-order mt-5 w-full">{pending ? "Please wait…" : "Save Pickup Order"} {!pending && <ArrowRight size={18} aria-hidden="true" />}</button></> : <div className="rounded-3xl border border-cj-navy/10 bg-white p-6 shadow-sm sm:p-7"><h2 className="font-display text-xl font-bold text-cj-navy">Your pickup order details</h2><p className="mt-4 text-sm leading-relaxed text-cj-charcoal">Choose a pickup branch and review the current menu prices before saving your order.</p></div>}</div>
    </form> : <div className="mx-auto mt-8 flex max-w-xl flex-col items-center rounded-3xl border border-cj-navy/10 bg-white px-6 py-12 text-center shadow-sm sm:py-16"><span className="flex h-20 w-20 items-center justify-center rounded-full bg-cj-cream text-cj-navy"><ShoppingCart size={36} strokeWidth={1.6} aria-hidden="true" /></span><h2 className="mt-6 font-display text-2xl font-bold text-cj-navy">Your cart is empty.</h2><p className="mt-2 text-sm text-cj-charcoal">Choose a meal from the menu before adding pickup details.</p><Link href="/menu" className="cj-button cj-button-order mt-7">Browse Menu <ArrowRight size={18} aria-hidden="true" /></Link></div>}
    <Link href="/confirmation" className="mt-7 inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">View your latest receipt</Link>
  </div>;
}
