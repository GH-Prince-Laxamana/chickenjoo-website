"use client";
import { useEffect, useRef, useState } from "react";
import { canTransition, orderStatuses, type OrderStatus, type Quote } from "@/lib/orders/domain";
import OrderSummary from "@/components/orders/OrderSummary";
type AdminOrder = { id: string; reference: string; guest: { name: string; email: string }; quote: Quote; status: OrderStatus; createdAt: string };
export default function OrderManager() {
  const [page, setPage] = useState(1), [status, setStatus] = useState(""), [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; data: AdminOrder[]; totalPages: number } | null>(null);
  const [error, setError] = useState(""), [pending, setPending] = useState(false), [message, setMessage] = useState("");
  const [selected, setSelected] = useState<AdminOrder | null>(null), [nextStatus, setNextStatus] = useState<OrderStatus | "">("");
  const busy = useRef(false), feedback = useRef<HTMLParagraphElement>(null);
  const key = `${page}:${status}:${version}`, loading = result?.key !== key;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/admin/orders?page=${page}${status ? `&status=${status}` : ""}`, { signal: controller.signal }).then(async (response) => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Unable to load orders.");
      setResult({ key, data: payload.data, totalPages: payload.meta.totalPages }); setError("");
    }).catch((error) => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load orders."); });
    return () => controller.abort();
  }, [page, status, version, key]);
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
  return <div><h1 className="font-display text-4xl font-semibold text-cj-navy">Demo orders</h1><p className="mt-4">These orders simulate pickup only. Status changes do not prepare food or notify customers.</p><label className="mt-6 block font-semibold">Filter by status<select disabled={pending} value={status} onChange={(event) => { setStatus(event.target.value); setPage(1); setSelected(null); }} className="ml-3 min-h-11 rounded-xl border border-cj-navy/25 bg-white p-3"><option value="">All statuses</option>{orderStatuses.map((value) => <option key={value}>{value}</option>)}</select></label>
    {error && <p ref={feedback} tabIndex={-1} role="alert" className="mt-5 rounded-xl bg-cj-red/10 p-4">{error} <button disabled={pending} className="min-h-11 underline" onClick={() => { setSelected(null); setVersion((value) => value + 1); }}>Refresh orders</button></p>}<p role="status" className="mt-5">{message}</p>
    {loading ? !error && <p role="status">Loading orders…</p> : <><ul className="mt-5 space-y-3">{result?.data.map((order) => <li key={order.id}><button disabled={pending} className="flex min-h-11 w-full flex-wrap items-center justify-between gap-3 rounded-2xl bg-white p-5 text-left ring-1 ring-cj-navy/10 hover:ring-cj-navy/30" onClick={() => { setSelected(order); setNextStatus(""); setMessage(""); }}><span><span className="block font-semibold">{order.reference}</span><span className="mt-1 block text-sm">{order.guest.name} · {order.quote.branch.name}</span></span><span className="capitalize">{order.status}</span></button></li>)}</ul>{!result?.data.length && <p>No demo orders match this filter.</p>}<div className="mt-5 flex flex-wrap items-center gap-4"><button disabled={pending || page === 1} onClick={() => { setPage(page - 1); setSelected(null); }} className="min-h-11 rounded-xl border px-4 disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, result?.totalPages || 0)}</span><button disabled={pending || page >= (result?.totalPages || 0)} onClick={() => { setPage(page + 1); setSelected(null); }} className="min-h-11 rounded-xl border px-4 disabled:opacity-40">Next</button></div></>}
    {selected && <section aria-label="Selected order" className="mt-8"><h2 className="font-display text-2xl font-semibold">{selected.reference}</h2><p className="mt-3 break-words">{selected.guest.name} · {selected.guest.email}</p><p className="mt-2">Saved {new Date(selected.createdAt).toLocaleString("en-PH")}</p><div className="mt-4"><OrderSummary quote={selected.quote} /></div><p className="mt-4 capitalize">Current status: {selected.status}</p>{orderStatuses.some((value) => canTransition(selected.status, value)) ? <form onSubmit={(event) => { event.preventDefault(); void update(); }} className="mt-4 flex flex-wrap items-center gap-4"><label className="font-semibold">Next demo status<select required disabled={pending} value={nextStatus} onChange={(event) => setNextStatus(event.target.value as OrderStatus)} className="ml-3 min-h-11 rounded-xl border bg-white p-3"><option value="">Choose status</option>{orderStatuses.filter((value) => canTransition(selected.status, value)).map((value) => <option key={value}>{value}</option>)}</select></label><button disabled={pending} className="min-h-11 rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white disabled:opacity-50">{pending ? "Saving…" : "Update demo status"}</button></form> : <p className="mt-3">This order has a final status.</p>}</section>}
  </div>;
}
