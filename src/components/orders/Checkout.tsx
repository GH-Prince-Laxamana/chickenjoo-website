"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { clearCart, useCart } from "@/lib/orders/cart";
import type { Quote } from "@/lib/orders/domain";
import type { PublicBranch } from "@/lib/public/types";
import DemoNotice from "./DemoNotice";
import OrderSummary from "./OrderSummary";

export default function Checkout({ branches }: { branches: PublicBranch[] }) {
  const cart = useCart(), router = useRouter();
  const [branchId, setBranchId] = useState(""), [name, setName] = useState(""), [email, setEmail] = useState("");
  const [review, setReview] = useState<{ quote: Quote; cartKey: string } | null>(null), [pending, setPending] = useState(false), [error, setError] = useState("");
  const busy = useRef(false), feedback = useRef<HTMLParagraphElement>(null), summary = useRef<HTMLDivElement>(null);
  const items = cart.map(({ menuItemId, quantity, flavors }) => ({ menuItemId, quantity, flavors }));
  const cartKey = JSON.stringify({ branchId, items }), quote = review?.cartKey === cartKey ? review.quote : null;
  async function request(path: string, body: unknown) {
    const response = await fetch(path, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
    const result = await response.json();
    if (!response.ok) {
      if (result.quote) setReview({ quote: result.quote, cartKey });
      throw new Error(result.error?.message || "Unable to complete this request.");
    }
    return result.data;
  }
  async function handle(submit: boolean) {
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    try {
      if (!submit || !quote) {
        const nextQuote = await request("/api/v1/orders/quote", { branchId, items });
        setReview({ quote: nextQuote, cartKey });
        requestAnimationFrame(() => summary.current?.focus());
      } else {
        const payload = { branchId, items, guest: { name: name.trim(), email: email.trim().toLowerCase() }, quoteHash: quote.hash };
        const bytes = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(JSON.stringify(payload)));
        const fingerprint = Array.from(new Uint8Array(bytes), (byte) => byte.toString(16).padStart(2, "0")).join("");
        let attempt: { fingerprint: string; submissionId: string; confirmationToken: string } | null = null;
        try { attempt = JSON.parse(sessionStorage.getItem("cj-order-attempt") || "null"); } catch { /* Replace a malformed local attempt. */ }
        if (attempt?.fingerprint !== fingerprint) attempt = { fingerprint, submissionId: crypto.randomUUID(), confirmationToken: Array.from(crypto.getRandomValues(new Uint8Array(32)), (byte) => byte.toString(16).padStart(2, "0")).join("") };
        // Save the capability before submitting so a lost response still has a private receipt.
        sessionStorage.setItem("cj-order-attempt", JSON.stringify(attempt));
        sessionStorage.setItem("cj-order-token", attempt!.confirmationToken);
        await request("/api/v1/orders", { ...payload, submissionId: attempt!.submissionId, confirmationToken: attempt!.confirmationToken });
        try { clearCart(); } catch { /* A saved order must still reach its receipt if cart storage fails. */ }
        router.push("/confirmation");
      }
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to submit. Your cart is preserved."); requestAnimationFrame(() => feedback.current?.focus()); }
    finally { busy.current = false; setPending(false); }
  }
  return <div className="mx-auto w-full max-w-5xl px-4 py-12 sm:px-8"><h1 className="font-display text-4xl font-semibold text-cj-navy">Demo pickup checkout</h1><div className="mt-5"><DemoNotice /></div>
    {cart.length ? <form onSubmit={(event) => { event.preventDefault(); void handle(Boolean(quote)); }} className="mt-7 grid items-start gap-7 lg:grid-cols-2">
      <div className="space-y-5 rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10"><h2 className="font-display text-2xl font-semibold">Pickup details</h2><p className="text-sm leading-relaxed">Use test details for this student project. Your name and email are saved for the admin demo. No confirmation email is sent.</p>
        <label className="block font-semibold">Name<input required maxLength={100} autoComplete="name" disabled={pending} value={name} onChange={(event) => setName(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-cj-navy/25 px-3 py-2" /></label>
        <label className="block font-semibold">Email<input required type="email" maxLength={254} autoComplete="email" disabled={pending} value={email} onChange={(event) => setEmail(event.target.value)} className="mt-2 min-h-11 w-full rounded-xl border border-cj-navy/25 px-3 py-2" /></label>
        <label className="block font-semibold">Pickup branch<select required disabled={pending} value={branchId} onChange={(event) => { setBranchId(event.target.value); setReview(null); }} className="mt-2 min-h-11 w-full rounded-xl border border-cj-navy/25 bg-white px-3 py-2"><option value="">Choose a branch</option>{branches.map((branch) => <option key={branch.id} value={branch.id}>{branch.name}</option>)}</select></label>
        {!branches.length && <p role="alert">No pickup branches are currently available.</p>}
        {!quote && <button disabled={pending || !branches.length} className="min-h-11 w-full rounded-xl bg-cj-red px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Please wait…" : "Review current prices"}</button>}
        <p className="text-sm leading-relaxed">The private receipt stays available in this browser tab for 24 hours. An order reference alone cannot open it.</p>
        {error && <p ref={feedback} tabIndex={-1} role="alert" className="rounded-xl bg-cj-red/10 p-4">{error}</p>}
        <Link href="/cart" className="inline-flex min-h-11 items-center text-cj-navy underline">Edit cart</Link>
      </div><div ref={summary} tabIndex={-1} aria-label="Order review">{quote ? <><OrderSummary quote={quote} /><button disabled={pending} className="mt-5 min-h-11 w-full rounded-xl bg-cj-red px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Please wait…" : "Submit demo order"}</button></> : <p className="rounded-3xl bg-cj-navy/5 p-6 leading-relaxed">Choose a pickup branch and review the current menu prices before submitting.</p>}</div>
    </form> : <p className="mt-8">Your cart is empty. <Link className="text-cj-navy underline" href="/menu">Browse the menu</Link>.</p>}
    <Link href="/confirmation" className="mt-6 inline-flex min-h-11 items-center text-sm text-cj-navy underline">Recover the latest private receipt from this tab</Link></div>;
}
