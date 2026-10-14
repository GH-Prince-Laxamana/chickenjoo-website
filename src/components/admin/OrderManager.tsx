"use client";
import { useEffect, useRef, useState } from "react";
import { ArrowUpRight, Eye, X } from "lucide-react";
import Link from "next/link";
import { canTransition, orderStatuses, type OrderStatus, type Quote } from "@/lib/orders/domain";
import { peso } from "@/lib/orders/domain";
type AdminOrder = { id: string; userId?: string; reference: string; guest: { name: string; email: string }; quote: Quote; status: OrderStatus; createdAt: string };
const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-cj-yellow/25 text-cj-navy", preparing: "bg-cj-red/10 text-cj-red",
  ready: "bg-blue-100 text-blue-900", completed: "bg-emerald-100 text-emerald-800", cancelled: "bg-cj-navy/10 text-cj-charcoal",
};
const statusLabel: Record<OrderStatus, string> = { pending: "Pending", preparing: "Preparing", ready: "Ready for pickup", completed: "Completed", cancelled: "Cancelled" };
export default function OrderManager({ customerId }: { customerId?: string }) {
  const [page, setPage] = useState(1), [status, setStatus] = useState(""), [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; data: AdminOrder[]; totalPages: number } | null>(null);
  const [error, setError] = useState(""), [pending, setPending] = useState(false), [message, setMessage] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null), [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const busy = useRef(false), feedback = useRef<HTMLParagraphElement>(null), orderDialog = useRef<HTMLDialogElement>(null), returnFocus = useRef<HTMLElement | null>(null);
  const key = `${page}:${status}:${version}:${customerId || ""}`, loading = result?.key !== key;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/admin/orders?page=${page}${status ? `&status=${status}` : ""}${customerId ? `&customer=${encodeURIComponent(customerId)}` : ""}`, { signal: controller.signal }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Unable to load orders.");
      setResult({ key, data: payload.data, totalPages: payload.meta.totalPages }); setError("");
    }).catch((error) => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load orders."); });
    return () => controller.abort();
  }, [page, status, version, key, customerId]);
  useEffect(() => { if (selected && !orderDialog.current?.open) orderDialog.current?.showModal(); }, [selected]);
  function closeOrder() { if (pending) return; setSelected(null); setNextStatus(""); setError(""); requestAnimationFrame(() => returnFocus.current?.isConnected && returnFocus.current.focus()); }
  async function update() {
    if (!selected || !nextStatus || busy.current) return;
    busy.current = true; setPending(true); setError(""); setMessage("");
    try {
      const response = await fetch(`/api/v1/admin/orders/${selected.id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: nextStatus, expectedStatus: selected.status }) });
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Unable to update order.");
      setMessage(`${selected.reference} updated to ${nextStatus}.`); setSelected(null); setNextStatus(""); setVersion((value) => value + 1);
    } catch (error) { setError(error instanceof Error ? error.message : "Unable to update order."); requestAnimationFrame(() => feedback.current?.focus()); }
    finally { busy.current = false; setPending(false); }
  }
  return <div>
    <p className="text-xs font-bold uppercase tracking-[.14em] text-cj-red">Pickup management</p>
    <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy">Orders</h1>
    {customerId && <Link href="/admin/orders" className="mt-3 inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline">Show all customers’ orders</Link>}
    <p className="mt-3 max-w-3xl leading-relaxed text-cj-charcoal">Review saved pickup orders and update their status. Customers can check the status in their receipt; updates do not send notifications.</p>
    {error && !selected && <p ref={feedback} tabIndex={-1} role="alert" className="mt-5 rounded-xl bg-cj-red/10 p-4 text-cj-red">{error} <button disabled={pending} className="min-h-11 font-semibold underline" onClick={() => setVersion((value) => value + 1)}>Refresh orders</button></p>}
    {message && <p role="status" className="mt-4 rounded-xl border border-cj-navy/10 bg-white p-4 font-semibold text-cj-navy">{message}</p>}
    <div className="mt-6">
      <section className="admin-panel min-w-0 overflow-hidden" aria-label="Pickup orders">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cj-navy/10 px-5 py-4 sm:px-6">
          <h2 className="font-display text-lg font-bold text-cj-navy">Order list</h2>
          <label className="flex items-center gap-2 text-sm font-semibold text-cj-navy">Status<select disabled={pending} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); setSelected(null); }} className="min-h-11 rounded-xl border border-cj-navy/20 bg-white px-3 text-sm outline-none focus-visible:border-cj-red focus-visible:ring-2 focus-visible:ring-cj-red/20"><option value="">All statuses</option>{orderStatuses.map((value) => <option key={value} value={value}>{statusLabel[value]}</option>)}</select></label>
        </div>
        {loading ? !error && <p role="status" className="p-6 text-cj-charcoal">Loading orders…</p> : <>
          {!!result?.data.length && <div role="region" aria-label="Pickup orders table" tabIndex={0} className="overflow-x-auto"><table className="admin-record-table admin-orders-table"><thead><tr><th scope="col">Order</th><th scope="col">Customer</th><th scope="col">Pickup branch</th><th scope="col">Items</th><th scope="col">Total</th><th scope="col">Status</th><th scope="col" className="text-right">Action</th></tr></thead><tbody>{result.data.map((order) => <tr key={order.id}>
            <th scope="row"><span className="admin-cell-clip font-bold text-cj-navy" title={order.reference}>{order.reference}</span><span className="admin-cell-clip mt-1 text-xs font-normal text-cj-charcoal">{new Date(order.createdAt).toLocaleString("en-PH")}</span></th>
            <td className="text-sm font-semibold text-cj-navy"><div className="flex items-center gap-1"><span className="admin-cell-clip" title={order.guest.name}>{order.guest.name}</span>{order.userId ? <Link href={`/admin/customers/${order.userId}`} aria-label={`View customer ${order.guest.name}`} title="View customer" className="inline-flex h-11 w-11 shrink-0 items-center justify-center text-cj-navy hover:text-cj-red"><ArrowUpRight size={17} aria-hidden="true" /></Link> : <span className="text-xs font-normal text-cj-charcoal">Guest</span>}</div></td><td className="text-sm text-cj-charcoal"><span className="admin-cell-clip" title={order.quote.branch.name}>{order.quote.branch.name}</span></td><td className="text-sm text-cj-charcoal">{order.quote.items.reduce((sum, item) => sum + item.quantity, 0)}</td><td className="font-semibold text-cj-navy">{peso(order.quote.totalCentavos)}</td><td><span className={`inline-flex max-w-full truncate rounded-full px-3 py-1 text-xs font-bold ${statusStyles[order.status]}`} title={statusLabel[order.status]}>{statusLabel[order.status]}</span></td>
            <td><div className="flex justify-end"><button type="button" disabled={pending} onClick={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setSelected(order); setNextStatus(""); setMessage(""); }} className="flex h-11 w-11 items-center justify-center text-cj-navy hover:text-cj-red focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cj-red disabled:opacity-40" aria-label={`View receipt for ${order.reference}`} title="View receipt"><Eye size={19} aria-hidden="true" /></button></div></td>
          </tr>)}</tbody></table></div>}
          {!result?.data.length && <p className="p-6 text-sm text-cj-charcoal">No orders match this filter.</p>}
          <nav aria-label="Order pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-cj-navy/10 px-5 py-4 text-sm sm:px-6"><button disabled={pending || page === 1} onClick={() => { setPage(page - 1); setSelected(null); }} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold text-cj-navy disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, result?.totalPages || 0)}</span><button disabled={pending || page >= (result?.totalPages || 0)} onClick={() => { setPage(page + 1); setSelected(null); }} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold text-cj-navy disabled:opacity-40">Next</button></nav>
        </>}
      </section>
      {selected && <dialog ref={orderDialog} aria-labelledby="order-detail-heading" className="admin-editor-dialog" onCancel={(event) => { event.preventDefault(); closeOrder(); }}><div className="admin-editor-heading"><div><p className="text-xs font-bold uppercase tracking-widest text-cj-red">Order receipt</p><h2 id="order-detail-heading" className="mt-1 font-display text-2xl font-bold text-cj-navy">{selected.reference}</h2></div><button type="button" onClick={closeOrder} disabled={pending} aria-label="Close order receipt" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cj-navy hover:bg-cj-cream disabled:opacity-50"><X size={21} aria-hidden="true" /></button></div><div className="px-5 py-6 sm:px-8">
          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ${statusStyles[selected.status]}`}>{statusLabel[selected.status]}</span>
          <p className="mt-2 break-words text-sm text-cj-charcoal">{selected.guest.name} · {selected.guest.email}</p><p className="mt-1 text-xs text-cj-charcoal">Saved {new Date(selected.createdAt).toLocaleString("en-PH")}</p>
          <div className="mt-5 border-t border-cj-navy/10 pt-4"><p className="text-xs font-bold uppercase tracking-wide text-cj-red">Pickup branch</p><p className="mt-1 font-semibold text-cj-navy">{selected.quote.branch.name}</p><p className="mt-1 text-sm text-cj-charcoal">{selected.quote.branch.address}</p></div>
          <ul className="mt-5 divide-y divide-cj-navy/10 border-y border-cj-navy/10">{selected.quote.items.map((item, index) => <li key={index} className="flex justify-between gap-3 py-3 text-sm"><span className="min-w-0 text-cj-navy"><strong>{item.quantity} × {item.name}</strong>{item.flavors.length > 0 && <span className="mt-1 block text-xs text-cj-charcoal">{item.flavors.join(" · ")}</span>}<span className="mt-1 block text-xs text-cj-charcoal">{peso(item.unitPriceCentavos)} each</span></span><span className="shrink-0 font-semibold text-cj-navy">{peso(item.lineTotalCentavos)}</span></li>)}</ul>
          <dl className="mt-4 space-y-2 text-sm"><div className="flex justify-between"><dt>Subtotal</dt><dd>{peso(selected.quote.totalCentavos + (selected.quote.promotion?.discountCentavos ?? 0))}</dd></div>{selected.quote.promotion && <div className="flex justify-between text-cj-red"><dt>{selected.quote.promotion.name}</dt><dd>−{peso(selected.quote.promotion.discountCentavos)}</dd></div>}<div className="flex justify-between border-t border-cj-navy/10 pt-3 font-bold text-cj-navy"><dt>Total</dt><dd className="text-lg">{peso(selected.quote.totalCentavos)}</dd></div></dl>
          <p className="mt-3 text-xs text-cj-charcoal">Payment is not collected online.</p>
          {orderStatuses.some((value) => canTransition(selected.status, value)) ? <form onSubmit={(event) => { event.preventDefault(); void update(); }} className="mt-5 border-t border-cj-navy/10 pt-5"><label className="block text-sm font-semibold text-cj-navy">Next status<select required disabled={pending} value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)} className="mt-2 min-h-11 w-full rounded-xl border border-cj-navy/20 bg-white px-3 outline-none focus-visible:border-cj-red focus-visible:ring-2 focus-visible:ring-cj-red/20"><option value="">Choose status</option>{orderStatuses.filter((value) => canTransition(selected.status, value)).map((value) => <option key={value} value={value}>{statusLabel[value]}</option>)}</select></label><button disabled={pending} className="mt-3 min-h-11 w-full rounded-full bg-cj-red px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Saving…" : "Update status"}</button></form> : <p className="mt-4 text-sm text-cj-charcoal">This order has a final status.</p>}
          {error && <p ref={feedback} tabIndex={-1} role="alert" className="mt-4 rounded-xl bg-cj-red/10 p-4 text-sm text-cj-red">{error}</p>}
        </div></dialog>}
    </div>
  </div>;
}
