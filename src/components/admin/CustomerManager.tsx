"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowUpRight, Search } from "lucide-react";
type Customer = { id: string; name: string; email: string; isActive: boolean; createdAt: string | null };
export default function CustomerManager() {
  const [page, setPage] = useState(1), [query, setQuery] = useState(""), [search, setSearch] = useState(""), [version, setVersion] = useState(0);
  const [result, setResult] = useState<{ key: string; data: Customer[]; meta: { total: number; totalPages: number } } | null>(null), [error, setError] = useState("");
  const key = `${page}:${search}:${version}`, loading = result?.key !== key;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/admin/customers?page=${page}&q=${encodeURIComponent(search)}`, { signal: controller.signal, cache: "no-store" }).then(async response => {
      const payload = await response.json();
      if (!response.ok) throw new Error(payload.error?.message || "Unable to load customers.");
      setResult({ ...payload, key }); setError("");
    }).catch(error => { if (!controller.signal.aborted) setError(error instanceof Error ? error.message : "Unable to load customers."); });
    return () => controller.abort();
  }, [page, search, version, key]);
  return <div><p className="text-xs font-bold uppercase tracking-[.14em] text-cj-red">Customer information</p><h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy">Customers</h1><p className="mt-3 max-w-3xl text-cj-charcoal">Find customer accounts and review their order history and voucher use.</p>
    <section className="admin-panel mt-6 overflow-hidden" aria-label="Customers">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-cj-navy/10 px-5 py-4 sm:px-6"><h2 className="font-display text-lg font-bold text-cj-navy">Customer list</h2><form onSubmit={event => { event.preventDefault(); setSearch(query.trim()); setPage(1); }} className="flex flex-wrap items-center gap-2"><label htmlFor="customer-search" className="sr-only">Search customer name or email</label><input id="customer-search" value={query} onChange={event => setQuery(event.target.value)} maxLength={100} placeholder="Name or email" className="min-h-11 min-w-0 rounded-xl border border-cj-navy/20 px-3 text-sm" /><button className="flex min-h-11 items-center gap-2 rounded-xl bg-cj-navy px-4 text-sm font-semibold text-white"><Search size={17} aria-hidden="true" />Search</button></form></div>
      {error ? <div role="alert" className="p-6"><p>{error}</p><button onClick={() => setVersion(value => value + 1)} className="mt-3 min-h-11 font-semibold underline">Retry</button></div> : loading ? <p role="status" className="p-6">Loading customers…</p> : <>
        {result?.data.length ? <div role="region" aria-label="Customer accounts table" tabIndex={0} className="overflow-x-auto"><table className="admin-record-table"><thead><tr><th scope="col">Customer</th><th scope="col">Email</th><th scope="col">Joined</th><th scope="col">Status</th><th scope="col">Details</th></tr></thead><tbody>{result.data.map(customer => <tr key={customer.id} id={`customer-${customer.id}`}><th scope="row"><Link href={`/admin/customers/${customer.id}`} className="admin-cell-clip font-semibold text-cj-navy underline underline-offset-4">{customer.name}</Link></th><td><span className="admin-cell-clip text-sm" title={customer.email}>{customer.email}</span></td><td className="text-sm">{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString("en-PH", { timeZone: "Asia/Manila" }) : "—"}</td><td><span className={`rounded-full px-3 py-1 text-xs font-bold ${customer.isActive ? "bg-emerald-100 text-emerald-800" : "bg-cj-navy/10 text-cj-charcoal"}`}>{customer.isActive ? "Active" : "Inactive"}</span></td><td><Link href={`/admin/customers/${customer.id}`} aria-label={`View customer ${customer.name}`} title="View customer" className="inline-flex h-11 w-11 items-center justify-center text-cj-navy hover:text-cj-red"><ArrowUpRight size={19} aria-hidden="true" /></Link></td></tr>)}</tbody></table></div> : <p className="p-6">No customers match this search.</p>}
        <nav aria-label="Customer pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-cj-navy/10 px-5 py-4 text-sm"><button disabled={page === 1} onClick={() => setPage(page - 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold disabled:opacity-40">Previous</button><span>{result?.meta.total} customers · Page {page} of {Math.max(1, result?.meta.totalPages || 0)}</span><button disabled={page >= (result?.meta.totalPages || 0)} onClick={() => setPage(page + 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold disabled:opacity-40">Next</button></nav>
      </>}
    </section></div>;
}
