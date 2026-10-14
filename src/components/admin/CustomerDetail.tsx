"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { peso } from "@/lib/orders/domain";
type Customer = { id: string; name: string; email: string; isActive: boolean; createdAt: string | null; orderCount: number; completedCount: number; totalCentavos: number; voucherStatus: string; orders: { id: string; reference: string; status: string; createdAt: string; quote: { branch: { name: string }; totalCentavos: number; promotion?: { name: string } } }[] };
export default function CustomerDetail({ id }: { id: string }) {
  const [page, setPage] = useState(1), [version, setVersion] = useState(0), [error, setError] = useState("");
  const [result, setResult] = useState<{ key: string; data: Customer; meta: { totalPages: number } } | null>(null);
  const key = `${id}:${page}:${version}`, customer = result?.key === key ? result.data : null;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/admin/customers/${id}?page=${page}`, { signal: controller.signal, cache: "no-store" }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Unable to load customer.");
      setResult({ ...payload, key }); setError("");
    }).catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load customer."); });
    return () => controller.abort();
  }, [id, page, version, key]);
  return <div><Link href="/admin/customers" className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cj-navy underline"><ArrowLeft size={17} aria-hidden="true" />All customers</Link><h1 className="mt-4 break-words font-display text-4xl font-bold text-cj-navy">{customer?.name || "Customer details"}</h1>
    {error ? <div role="alert" className="admin-panel mt-6 p-6"><p>{error}</p><button className="mt-3 min-h-11 font-semibold underline" onClick={() => setVersion(value => value + 1)}>Retry</button></div> : !customer ? <p role="status" className="mt-6">Loading customer…</p> : <>
      <section className="admin-panel mt-6 p-6" aria-label="Customer information"><dl className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{[["Email", customer.email], ["Account status", customer.isActive ? "Active" : "Inactive"], ["Joined", customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" }) : "—"], ["Orders", String(customer.orderCount)], ["Completed order total", `${peso(customer.totalCentavos)} · ${customer.completedCount} completed`], ["Launch voucher", customer.voucherStatus]].map(([label, value]) => <div key={label}><dt className="text-sm text-cj-charcoal">{label}</dt><dd className="mt-1 break-words font-semibold capitalize text-cj-navy">{value}</dd></div>)}</dl><p className="mt-5 border-t border-cj-navy/10 pt-4 text-xs text-cj-charcoal">Voucher use is recorded once per account when a discounted order is saved, including orders later cancelled.</p></section>
      <section className="admin-panel mt-6 overflow-hidden" aria-label="Customer order history"><div className="flex flex-wrap items-center justify-between gap-3 border-b border-cj-navy/10 px-6 py-4"><h2 className="font-display text-xl font-bold text-cj-navy">Order history</h2><Link href={`/admin/orders?customer=${id}`} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cj-navy underline">Manage orders <ArrowUpRight size={17} aria-hidden="true" /></Link></div>
        {customer.orders.length ? <div role="region" aria-label="Customer orders table" tabIndex={0} className="overflow-x-auto"><table className="admin-record-table"><thead><tr><th scope="col">Order</th><th scope="col">Pickup branch</th><th scope="col">Total</th><th scope="col">Voucher</th><th scope="col">Status</th></tr></thead><tbody>{customer.orders.map(order => <tr key={order.id}><th scope="row"><span className="admin-cell-clip font-semibold text-cj-navy">{order.reference}</span><span className="mt-1 block text-xs font-normal">{new Date(order.createdAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}</span></th><td><span className="admin-cell-clip text-sm">{order.quote.branch.name}</span></td><td className="font-semibold">{peso(order.quote.totalCentavos)}</td><td className="text-sm">{order.quote.promotion ? "Redeemed" : "—"}</td><td className="text-sm font-semibold capitalize">{order.status}</td></tr>)}</tbody></table></div> : <p className="p-6">This customer has no saved orders yet.</p>}
        <nav aria-label="Customer order pages" className="flex items-center justify-between gap-3 border-t border-cj-navy/10 px-6 py-4 text-sm"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, result?.meta.totalPages || 0)}</span><button disabled={page >= (result?.meta.totalPages || 0)} onClick={() => setPage(page + 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold disabled:opacity-40">Next</button></nav>
      </section></>}
  </div>;
}
