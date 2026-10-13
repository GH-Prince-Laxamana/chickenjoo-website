"use client";
import { X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { fields, defaults, resources, type Resource, type Field } from "@/lib/admin/fields";
export type AdminRecord = Record<string, unknown> & { id: string; updatedAt: string };
function textValue(field: Field, value: unknown) {
  if (field.kind === "price") return (Number(value ?? 0) / 100).toFixed(2);
  if (Array.isArray(value)) return value.join(field.kind === "paragraphs" ? "\n\n" : "\n");
  return value == null ? "" : String(value);
}
export default function RecordEditor({ resource, record, onSaved, onClose }: { resource: Resource; record: AdminRecord | null; onSaved: (message: string) => void; onClose: () => void }) {
  const initial = record || defaults(resource);
  const [values, setValues] = useState<Record<string, string | boolean>>(() => Object.fromEntries(fields[resource].map((field) => [field.key, field.kind === "boolean" ? Boolean(initial[field.key]) : field.key === "status" && initial[field.key] === "reviewed" ? "resolved" : textValue(field, initial[field.key])])));
  const [error, setError] = useState(""), [pending, setPending] = useState(false);
  const feedback = useRef<HTMLParagraphElement>(null), busy = useRef(false), dialog = useRef<HTMLDialogElement>(null);
  const inquiry = resource === "inquiries";
  const subject = String(record?.title || record?.name || record?.subject || "");
  useEffect(() => {
    const element = dialog.current;
    element?.showModal();
    return () => { if (element?.open) element.close(); };
  }, []);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault(); if (busy.current) return;
    setError("");
    const payload: Record<string, unknown> = {};
    for (const field of fields[resource]) {
      const value = values[field.key];
      if (field.kind === "price") {
        if (!/^\d+(?:\.\d{1,2})?$/.test(String(value))) { setError("Enter a peso price with at most two decimal places."); requestAnimationFrame(() => feedback.current?.focus()); return; }
        const [whole, fraction = ""] = String(value).split(".");
        payload[field.key] = Number(whole) * 100 + Number(fraction.padEnd(2, "0"));
      } else if (field.key === "requiredFlavorCount") payload[field.key] = Number(value);
      else if (field.kind === "lines" || field.kind === "paragraphs") payload[field.key] = String(value).split(field.kind === "lines" ? /\r?\n/ : /\r?\n\s*\r?\n/).map((text) => text.trim()).filter(Boolean);
      else payload[field.key] = value;
    }
    if (record) payload.expectedUpdatedAt = record.updatedAt;
    busy.current = true; setPending(true);
    try {
      const response = await fetch(`/api/v1/admin/${resource}${record ? `/${record.id}` : ""}`, { method: record ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload), cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Saving failed.");
      onSaved(inquiry ? "Inquiry status saved." : "Record saved. Public changes appear on a fresh request.");
    } catch (error) { setError(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "Saving is temporarily unavailable. Your changes are still in the form."); requestAnimationFrame(() => feedback.current?.focus()); }
    finally { busy.current = false; setPending(false); }
  }
  return <dialog ref={dialog} aria-labelledby="editor-heading" className="admin-editor-dialog" onCancel={(event) => { event.preventDefault(); if (!pending) onClose(); }} onClick={(event) => { if (event.target === event.currentTarget && !pending) onClose(); }}>
    <div className="admin-editor-heading"><div><p className="text-xs font-bold uppercase tracking-widest text-cj-red">{resources[resource]}</p><h2 id="editor-heading" className="mt-1 font-display text-2xl font-semibold text-cj-navy">{inquiry ? `Review ${subject}` : record ? `Edit ${subject}` : `Add ${resource === "menu-items" ? "menu item" : resource === "blog-posts" ? "post" : "branch"}`}</h2></div><button type="button" onClick={onClose} disabled={pending} aria-label="Close editor" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-cj-navy hover:bg-cj-cream disabled:opacity-50"><X size={21} aria-hidden="true" /></button></div>
    {inquiry && record && <dl className="space-y-4 px-5 py-6 sm:px-8">{["name", "email", "subject", "message", "createdAt"].map((key) => <div key={key}><dt className="font-semibold capitalize text-cj-navy">{key === "createdAt" ? "Submitted" : key}</dt><dd className="mt-1 whitespace-pre-line break-words">{key === "createdAt" ? new Date(String(record[key])).toLocaleString() : String(record[key] ?? "")}</dd></div>)}</dl>}
    <form onSubmit={submit} className="space-y-5">
      <div className="space-y-5 px-5 py-6 sm:px-8">
      {error && <p role="alert" tabIndex={-1} ref={feedback} className="rounded-xl border border-cj-red p-4">{error}</p>}
      <fieldset disabled={pending} className="space-y-5"><legend className="sr-only">Editable fields</legend>
        {fields[resource].map((field) => {
          const id = `edit-${field.key}`, value = values[field.key];
          const style = "mt-2 block min-h-12 w-full rounded-xl border border-cj-navy/20 bg-white px-4 py-3 text-base text-cj-navy outline-none transition-colors hover:border-cj-navy/40 focus-visible:border-cj-red focus-visible:ring-2 focus-visible:ring-cj-red/20 disabled:opacity-60";
          if (field.kind === "boolean") return <label key={id} className="flex min-h-11 items-center gap-3 font-semibold text-cj-navy"><input id={id} type="checkbox" checked={Boolean(value)} onChange={(e) => setValues({ ...values, [field.key]: e.target.checked })} className="h-5 w-5 accent-cj-navy" />{field.label}</label>;
          const common = { id, required: field.required, maxLength: field.max, value: String(value), "aria-describedby": field.help ? `${id}-help` : undefined, className: style };
          return <div key={id}><label htmlFor={id} className="font-semibold text-cj-navy">{field.label}{field.required ? " (required)" : ""}</label>
            {field.kind === "select" ? <select {...common} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })}>{field.options!.map((option) => <option value={option} key={option}>{option || "None"}</option>)}</select>
              : ["textarea", "lines", "paragraphs"].includes(field.kind) ? <textarea {...common} rows={field.kind === "paragraphs" ? 8 : 3} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />
              : <input {...common} type={field.kind === "date" ? "date" : "text"} inputMode={field.kind === "price" ? "decimal" : undefined} onChange={(e) => setValues({ ...values, [field.key]: e.target.value })} />}
            {field.help && <p id={`${id}-help`} className="mt-2 text-sm leading-relaxed">{field.help}</p>}
          </div>;
        })}
      </fieldset></div>
      <div className="admin-editor-actions"><button type="button" onClick={onClose} disabled={pending} className="min-h-11 rounded-full border border-cj-navy/25 bg-white px-6 py-3 font-semibold text-cj-navy hover:bg-cj-cream disabled:opacity-50">Cancel</button><button type="submit" disabled={pending} className="min-h-11 rounded-full bg-cj-red px-6 py-3 font-semibold text-white transition-colors hover:bg-[#cb1024] disabled:opacity-60">{pending ? "Saving…" : inquiry ? "Save status" : record ? "Save changes" : "Create record"}</button></div>
      <p role="status" className="sr-only">{pending ? "Saving changes. Please wait." : ""}</p>
    </form>
  </dialog>;
}
