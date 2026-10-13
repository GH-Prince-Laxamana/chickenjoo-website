"use client";
import Image from "next/image";
import { Archive, Eye, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { resources, type Resource } from "@/lib/admin/fields";
import { isLocalMenuImage } from "@/lib/public/assets";
import { menuArtwork } from "@/lib/public/menu-artwork";
import RecordEditor, { type AdminRecord } from "./RecordEditor";

type List = { data: AdminRecord[]; meta: { page: number; total: number; totalPages: number } };
export default function AdminManager({ resource }: { resource: Resource }) {
  const [page, setPage] = useState(1), [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; list?: List; error?: string }>();
  const [editor, setEditor] = useState<{ record: AdminRecord | null } | null>(null);
  const [notice, setNotice] = useState(""), [failure, setFailure] = useState("");
  const [confirm, setConfirm] = useState<AdminRecord | null>(null), [pending, setPending] = useState(false);
  const busy = useRef(false), listHeading = useRef<HTMLHeadingElement>(null), confirmationHeading = useRef<HTMLHeadingElement>(null), confirmDialog = useRef<HTMLDialogElement>(null), returnFocus = useRef<HTMLElement | null>(null);
  const key = `${resource}:${page}:${attempt}`;
  useEffect(() => {
    const controller = new AbortController();
    fetch(`/api/v1/admin/${resource}?page=${page}`, { cache: "no-store", signal: controller.signal }).then(async (response) => {
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "Records could not be loaded.");
      setResult({ key, list: body });
    }).catch((error) => { if (!controller.signal.aborted) setResult({ key, error: error.message === "Failed to fetch" ? "Records are temporarily unavailable." : error.message }); });
    return () => controller.abort();
  }, [resource, page, attempt, key]);
  useEffect(() => { if (confirm && !confirmDialog.current?.open) { confirmDialog.current?.showModal(); confirmationHeading.current?.focus(); } }, [confirm]);
  function edit(record: AdminRecord | null) {
    returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setEditor({ record }); setFailure(""); setNotice("");
  }
  function close() { setEditor(null); requestAnimationFrame(() => (returnFocus.current?.isConnected ? returnFocus.current : listHeading.current)?.focus()); }
  function closeConfirm() { setConfirm(null); requestAnimationFrame(() => (returnFocus.current?.isConnected ? returnFocus.current : listHeading.current)?.focus()); }
  async function remove() {
    if (!confirm || busy.current) return;
    busy.current = true; setPending(true); setFailure("");
    try {
      const response = await fetch(`/api/v1/admin/${resource}/${confirm.id}`, { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ expectedUpdatedAt: confirm.updatedAt }) });
      const body = await response.json();
      if (!response.ok) throw new Error(body.error?.message || "The change failed.");
      setNotice(body.message); setConfirm(null); setEditor(null); setAttempt((n) => n + 1);
      requestAnimationFrame(() => listHeading.current?.focus());
    } catch (error) { setFailure(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "The change failed. Please try again."); }
    finally { busy.current = false; setPending(false); }
  }
  const loaded = result?.key === key;
  return <div>
    <div className="flex flex-wrap items-center justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.14em] text-cj-red">Manage content</p><h1 ref={listHeading} tabIndex={-1} className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy">{resources[resource]}</h1></div>{resource !== "inquiries" && <button onClick={() => edit(null)} className="min-h-11 rounded-full bg-cj-red px-5 py-3 font-semibold text-white transition-colors hover:bg-[#cb1024]">Add {resource === "menu-items" ? "menu item" : resource === "blog-posts" ? "post" : "branch"}</button>}</div>
    <p className="mt-4 leading-relaxed">{resource === "inquiries" ? "Review messages from the contact form and mark them resolved when handled." : "Update the content visitors see on the website. Saved changes appear on their next visit."}</p>
    {notice && <p role="status" className="mt-4 rounded-xl border border-cj-navy/10 bg-white p-4 font-semibold text-cj-navy">{notice}</p>}
    {failure && !confirm && <p role="alert" className="mt-4 rounded-xl border border-cj-red bg-white p-4">{failure}</p>}
    {confirm && <dialog ref={confirmDialog} aria-labelledby="confirm-heading" className="admin-confirm-dialog" onCancel={(event) => { event.preventDefault(); if (!pending) closeConfirm(); }}><h2 ref={confirmationHeading} id="confirm-heading" tabIndex={-1} className="text-xl font-semibold text-cj-navy">{resource === "blog-posts" ? "Permanently delete this post?" : "Archive this record?"}</h2><p className="mt-3 break-words">{String(confirm.title || confirm.name)}. {resource === "blog-posts" ? "This cannot be undone." : "It will be hidden publicly. You can restore it through the editor."}</p>{failure && <p role="alert" className="mt-4 text-cj-red">{failure}</p>}<div className="mt-5 flex flex-wrap gap-4"><button disabled={pending} onClick={remove} className="min-h-11 rounded-full bg-cj-red px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Working…" : resource === "blog-posts" ? "Delete post" : "Archive record"}</button><button disabled={pending} onClick={closeConfirm} className="min-h-11 rounded-full border border-cj-navy/25 bg-white px-5 py-3">Cancel</button></div></dialog>}
    <div className="mt-8">
      <section aria-label="Records">
        {!loaded ? <p role="status" className="rounded-2xl bg-white p-6">Loading records…</p> : result.error ? <div role="alert" className="rounded-2xl bg-white p-6"><p>{result.error}</p><button onClick={() => setAttempt((n) => n + 1)} className="mt-4 min-h-11 rounded-full border border-cj-navy/20 px-5 font-semibold text-cj-navy">Try again</button></div>
          : <div className="admin-panel overflow-hidden"><div className="flex items-center justify-between gap-4 border-b border-cj-navy/10 px-5 py-4 sm:px-6"><h2 className="font-display text-lg font-bold text-cj-navy">{resources[resource]} list</h2><button type="button" onClick={() => setAttempt((n) => n + 1)} aria-label={`Refresh ${resources[resource].toLowerCase()} list`} title="Refresh list" className="flex h-11 w-11 shrink-0 items-center justify-center text-cj-navy hover:text-cj-red focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cj-red"><RefreshCw size={19} aria-hidden="true" /></button></div>
          {!result.list?.data.length ? <p className="p-6">No records on this page.</p> : <div role="region" aria-label={`${resources[resource]} records table`} tabIndex={0} className="overflow-x-auto"><table className="admin-record-table">
            <thead><tr><th scope="col">{resource === "inquiries" ? "Inquiry" : resource === "branches" ? "Branch" : resource === "blog-posts" ? "Post" : "Item"}</th><th scope="col">Details</th><th scope="col">Status</th><th scope="col" className="text-right">Actions</th></tr></thead>
            <tbody>{result.list.data.map((record) => {
            const title = String(record.title || record.name || record.subject || "Record");
            const suppliedImage = resource === "menu-items" ? record.image : resource === "blog-posts" ? record.coverImage : null;
            const picture = typeof suppliedImage === "string" && isLocalMenuImage(suppliedImage) ? suppliedImage : resource === "menu-items" ? menuArtwork[String(record.name)] : null;
            const state = resource === "inquiries" ? String(record.status === "reviewed" ? "resolved" : record.status) : resource === "blog-posts" ? String(record.status) : record.isArchived ? "Archived" : resource === "branches" && !record.isActive ? "Inactive" : "Visible";
            return <tr key={record.id}>
              <th scope="row"><div className="flex min-w-0 items-center gap-3">{picture && <span className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-cj-cream"><Image src={picture} alt="" fill sizes="48px" className="object-contain" /></span>}<span className="admin-cell-clip font-semibold text-cj-navy" title={title}>{title}</span></div></th>
              <td className="text-sm text-cj-charcoal">
                {resource === "menu-items" && <span className="admin-cell-clip" title={String(record.category || "")}>{String(record.category || "")} · {new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(Number(record.priceCentavos || 0) / 100)}</span>}
                {resource === "branches" && <span className="admin-cell-clip" title={`${String(record.address || "")}${record.city ? ` · ${String(record.city)}` : ""}`}>{String(record.address || "")}{record.city ? ` · ${String(record.city)}` : ""}</span>}
                {resource === "blog-posts" && <span className="admin-cell-clip">{String(record.type || "Post")}{record.publishedDate ? ` · ${String(record.publishedDate).slice(0, 10)}` : ""}</span>}
                {resource === "inquiries" && <><span className="admin-cell-clip" title={`${String(record.name || "")} · ${String(record.email || "")}`}>{String(record.name || "")} · {String(record.email || "")}</span><span className="admin-cell-clip mt-1" title={String(record.message || "")}>{String(record.message || "")}</span></>}
              </td>
              <td><span className={`inline-block max-w-full truncate rounded-full px-3 py-1 text-xs font-bold capitalize ${state === "Visible" || state === "published" || state === "resolved" ? "bg-emerald-100 text-emerald-800" : state === "new" ? "bg-cj-yellow/25 text-cj-navy" : "bg-cj-navy/8 text-cj-charcoal"}`} title={state}>{state}</span></td>
              <td><div className="flex justify-end gap-1"><button type="button" onClick={() => edit(record)} className="flex h-11 w-11 items-center justify-center text-cj-navy hover:text-cj-red focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cj-red" aria-label={`${resource === "inquiries" ? "Review" : "Edit"} ${title}`} title={resource === "inquiries" ? "Review" : "Edit"}>{resource === "inquiries" ? <Eye size={19} aria-hidden="true" /> : <Pencil size={19} aria-hidden="true" />}</button>{resource !== "inquiries" && <button type="button" onClick={() => { returnFocus.current = document.activeElement instanceof HTMLElement ? document.activeElement : null; setConfirm(record); setFailure(""); }} className="flex h-11 w-11 items-center justify-center text-cj-red hover:text-cj-navy focus-visible:rounded-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cj-red" aria-label={`${resource === "blog-posts" ? "Delete" : "Archive"} ${title}`} title={resource === "blog-posts" ? "Delete" : "Archive"}>{resource === "blog-posts" ? <Trash2 size={19} aria-hidden="true" /> : <Archive size={19} aria-hidden="true" />}</button>}</div></td>
            </tr>;
          })}</tbody></table></div>}
          {result.list && <nav aria-label="Admin record pages" className="flex flex-wrap items-center justify-between gap-3 border-t border-cj-navy/10 px-5 py-4 text-sm sm:px-6"><button disabled={page === 1} onClick={() => setPage((n) => n - 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold text-cj-navy disabled:opacity-40">Previous</button><span>Page {page} of {Math.max(1, result.list.meta.totalPages)}</span><button disabled={page >= result.list.meta.totalPages} onClick={() => setPage((n) => n + 1)} className="min-h-11 rounded-full border border-cj-navy/20 px-4 font-semibold text-cj-navy disabled:opacity-40">Next</button></nav>}
          </div>}
      </section>
    </div>
    {editor && <RecordEditor key={editor.record?.id || `new-${resource}`} resource={resource} record={editor.record} onClose={close} onSaved={(message) => { setNotice(message); close(); setAttempt((n) => n + 1); }} />}
  </div>;
}
