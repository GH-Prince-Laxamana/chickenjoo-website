"use client";
import { useEffect, useRef, useState } from "react";
import { resources, type Resource } from "@/lib/admin/fields";
import RecordEditor, { type AdminRecord } from "./RecordEditor";

type List = { data: AdminRecord[]; meta: { page: number; total: number; totalPages: number } };
export default function AdminManager({ resource }: { resource: Resource }) {
  const [page, setPage] = useState(1), [attempt, setAttempt] = useState(0);
  const [result, setResult] = useState<{ key: string; list?: List; error?: string }>();
  const [editor, setEditor] = useState<{ record: AdminRecord | null } | null>(null);
  const [notice, setNotice] = useState(""), [failure, setFailure] = useState("");
  const [confirm, setConfirm] = useState<AdminRecord | null>(null), [pending, setPending] = useState(false);
  const busy = useRef(false), listHeading = useRef<HTMLHeadingElement>(null), confirmationHeading = useRef<HTMLHeadingElement>(null);
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
  function edit(record: AdminRecord | null) {
    setEditor({ record }); setFailure(""); setNotice("");
    requestAnimationFrame(() => document.getElementById("editor-heading")?.focus());
  }
  function close() { setEditor(null); requestAnimationFrame(() => listHeading.current?.focus()); }
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
    <div className="flex flex-wrap items-center justify-between gap-4"><h1 ref={listHeading} tabIndex={-1} className="font-display text-4xl font-semibold text-cj-navy">{resources[resource]}</h1>{resource !== "inquiries" && <button onClick={() => edit(null)} className="min-h-11 rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white">Create record</button>}</div>
    <p className="mt-4 leading-relaxed">{resource === "inquiries" ? "Review messages from the contact form and mark them resolved when handled." : "Update the content visitors see on the website. Saved changes appear on their next visit."}</p>
    <p role="status" className="mt-4 font-semibold text-cj-navy">{notice}</p>
    {failure && <p role="alert" className="mt-4 rounded-xl border border-cj-red bg-white p-4">{failure}</p>}
    {confirm && <section aria-labelledby="confirm-heading" className="my-6 rounded-2xl border border-cj-navy/30 bg-white p-6"><h2 ref={confirmationHeading} id="confirm-heading" tabIndex={-1} className="text-xl font-semibold text-cj-navy">{resource === "blog-posts" ? "Permanently delete this post?" : "Archive this record?"}</h2><p className="mt-3 break-words">{String(confirm.title || confirm.name)}. {resource === "blog-posts" ? "This cannot be undone." : "It will be hidden publicly. You can restore it through the editor."}</p><div className="mt-5 flex flex-wrap gap-4"><button disabled={pending} onClick={remove} className="min-h-11 rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white disabled:opacity-60">{pending ? "Working…" : resource === "blog-posts" ? "Delete post" : "Archive record"}</button><button disabled={pending} onClick={() => { setConfirm(null); requestAnimationFrame(() => listHeading.current?.focus()); }} className="min-h-11 rounded-xl border border-cj-navy/25 px-5 py-3">Cancel</button></div></section>}
    <div className="mt-8 grid items-start gap-8 lg:grid-cols-2">
      <section aria-label="Records">
        {!loaded ? <p role="status" className="rounded-2xl bg-white p-6">Loading records…</p> : result.error ? <div role="alert" className="rounded-2xl bg-white p-6"><p>{result.error}</p><button onClick={() => setAttempt((n) => n + 1)} className="mt-4 min-h-11 font-semibold text-cj-navy underline">Try again</button></div>
          : !result.list?.data.length ? <p className="rounded-2xl bg-white p-6">No records on this page.</p>
          : <ul className="space-y-4">{result.list.data.map((record) => <li key={record.id} className="rounded-2xl bg-white p-5 ring-1 ring-cj-navy/10"><h2 className="break-words font-display text-xl font-semibold text-cj-navy">{String(record.title || record.name || record.subject)}</h2><p className="mt-2 text-sm">{resource === "inquiries" ? `${record.subject} · ${record.status === "reviewed" ? "resolved" : record.status}` : resource === "blog-posts" ? `${record.type} · ${record.status}` : `${record.isArchived ? "Archived" : "Visible"}${resource === "branches" && !record.isActive ? " · Inactive" : ""}`}</p><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => edit(record)} className="min-h-11 rounded-xl border border-cj-navy/25 px-4 py-2 font-semibold text-cj-navy" aria-label={`${resource === "inquiries" ? "Review" : "Edit"} ${String(record.title || record.name)}`}>{resource === "inquiries" ? "Review" : "Edit"}</button>{resource !== "inquiries" && <button onClick={() => { setConfirm(record); setFailure(""); requestAnimationFrame(() => confirmationHeading.current?.focus()); }} className="min-h-11 px-4 py-2 text-cj-navy underline" aria-label={`${resource === "blog-posts" ? "Delete" : "Archive"} ${String(record.title || record.name)}`}>{resource === "blog-posts" ? "Delete" : "Archive"}</button>}</div></li>)}</ul>}
        {loaded && result.list && <nav aria-label="Admin record pages" className="mt-6 flex flex-wrap items-center gap-4"><button disabled={page === 1} onClick={() => setPage((n) => n - 1)} className="min-h-11 px-3 underline disabled:opacity-40">Previous</button><span>Page {page} · {result.list.meta.total} records</span><button disabled={page >= result.list.meta.totalPages} onClick={() => setPage((n) => n + 1)} className="min-h-11 px-3 underline disabled:opacity-40">Next</button></nav>}
        <button onClick={() => setAttempt((n) => n + 1)} className="mt-3 min-h-11 px-3 font-semibold text-cj-navy underline">Reload records</button>
      </section>
      {editor ? <RecordEditor key={editor.record?.id || `new-${resource}`} resource={resource} record={editor.record} onClose={close} onSaved={(message) => { setNotice(message); close(); setAttempt((n) => n + 1); }} /> : <p className="rounded-2xl border border-dashed border-cj-navy/25 p-6 leading-relaxed">{resource === "inquiries" ? "Select an inquiry to read its message and update its status." : "Select a record to edit, or create a new one."}</p>}
    </div>
  </div>;
}
