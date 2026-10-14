"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useUser } from "./UserProvider";
import { resumePendingCart, setCartUser } from "@/lib/orders/cart";
import LaunchOffer from "@/components/orders/LaunchOffer";
export default function Account() {
  const { user } = useUser(), router = useRouter(), busy = useRef(false);
  const [pending, setPending] = useState(false), [message, setMessage] = useState("");
  async function logout() {
    if (busy.current) return;
    busy.current = true; setPending(true); setMessage("");
    try {
      const response = await fetch("/api/v1/user/logout", { method: "POST" });
      if (!response.ok) throw new Error("Sign-out failed. Please try again.");
      setCartUser(null);
      try { sessionStorage.removeItem("cj-order-token"); sessionStorage.removeItem("cj-order-attempt"); sessionStorage.removeItem("cj-pending-cart"); } catch { /* Cookie revocation still completes without browser storage. */ }
      window.dispatchEvent(new Event("cj-account-changed")); router.replace("/login"); router.refresh();
    } catch (error) { setMessage(error instanceof Error ? error.message : "Sign-out failed."); }
    finally { busy.current = false; setPending(false); }
  }
  async function restore() {
    try { await resumePendingCart(); setMessage("Your saved meal selection is ready. Check your cart."); }
    catch (error) { setMessage(error instanceof Error ? error.message : "Unable to restore your selection."); }
  }
  return <div className="mx-auto w-full max-w-3xl px-4 py-12 sm:px-8"><h1 className="font-display text-4xl font-bold text-cj-navy">Your account</h1><div className="mt-6 rounded-3xl border border-cj-navy/10 bg-white p-6"><dl className="space-y-4"><div><dt className="text-sm text-cj-charcoal">Name</dt><dd className="break-words font-semibold text-cj-navy">{user?.name || "Loading…"}</dd></div><div><dt className="text-sm text-cj-charcoal">Email</dt><dd className="break-all font-semibold text-cj-navy">{user?.email || "Loading…"}</dd></div></dl><div className="mt-6 flex flex-wrap gap-3"><Link href="/cart" className="cj-button">Your cart</Link><Link href="/confirmation" className="cj-button">Latest receipt</Link><button disabled={pending} onClick={logout} className="min-h-11 rounded-full border border-cj-navy/20 px-5 font-semibold text-cj-navy">{pending ? "Signing out…" : "Sign out"}</button></div><button onClick={restore} className="mt-4 min-h-11 text-sm font-semibold text-cj-navy underline">Restore meal selected before sign-in</button>{message && <p role="status" className="mt-3 text-sm">{message}</p>}</div><LaunchOffer /></div>;
}
