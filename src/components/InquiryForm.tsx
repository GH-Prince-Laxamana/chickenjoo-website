"use client";
import { useRef, useState, type FormEvent, type ChangeEvent } from "react";
import { inquiryLimits, validateInquiry, type InquiryErrors, type InquiryField, type InquiryFields } from "@/lib/public/content-validation";

const labels: Record<InquiryField, string> = { name: "Name", email: "Email address", subject: "Subject", message: "Message" };
const empty: InquiryFields = { name: "", email: "", subject: "", message: "" };
export default function InquiryForm() {
  const [values, setValues] = useState(empty);
  const [errors, setErrors] = useState<InquiryErrors>({});
  const [pending, setPending] = useState(false);
  const [failure, setFailure] = useState("");
  const [saved, setSaved] = useState(false);
  const summary = useRef<HTMLDivElement>(null);
  const submissionId = useRef("");
  const submittedValues = useRef("");
  const inFlight = useRef(false);
  function focusSummary() { requestAnimationFrame(() => summary.current?.focus()); }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setSaved(false); setFailure("");
    const validation = validateInquiry(values);
    setErrors(validation.errors);
    if (!validation.data) { focusSummary(); return; }
    const fingerprint = JSON.stringify(validation.data);
    if (!submissionId.current || submittedValues.current !== fingerprint) {
      submissionId.current = crypto.randomUUID(); submittedValues.current = fingerprint;
    }
    const website = new FormData(event.currentTarget).get("website") || "";
    inFlight.current = true; setPending(true);
    try {
      const response = await fetch("/api/v1/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...validation.data, website, submissionId: submissionId.current }), cache: "no-store" });
      const body = await response.json();
      if (!response.ok) { setErrors(body.error?.fields || {}); setFailure(body.error?.message || "Your inquiry could not be saved. Please try again."); focusSummary(); }
      else { setSaved(true); setValues(empty); setErrors({}); submissionId.current = ""; submittedValues.current = ""; }
    } catch { setFailure("We couldn’t confirm that your inquiry was saved. Please try again. Your message is still in the form."); focusSummary(); }
    finally { inFlight.current = false; setPending(false); }
  }
  return <form onSubmit={submit} noValidate aria-labelledby="inquiry-heading" aria-describedby="inquiry-note" className="rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10 sm:p-8">
    <h2 id="inquiry-heading" className="font-display text-3xl font-semibold text-cj-navy">Leave a message</h2>
    <p id="inquiry-note" className="mt-4 text-sm leading-relaxed">Student project inquiry form. Messages are saved for review in this project&apos;s dashboard and are not sent to Chicken Joo.</p>
    {(failure || Object.keys(errors).length > 0) && <div ref={summary} tabIndex={-1} role="alert" className="mt-6 rounded-xl border border-cj-red bg-cj-cream p-4"><h3 className="font-semibold text-cj-navy">{failure || "Check your inquiry"}</h3>{!!Object.keys(errors).length && <ul className="mt-2 space-y-2">{(Object.keys(errors) as InquiryField[]).map((field) => <li key={field}><a href={`#inquiry-${field}`} className="underline underline-offset-4">{labels[field]}: {errors[field]}</a></li>)}</ul>}</div>}
    <div role="status" aria-live="polite">{saved && <p className="mt-6 rounded-xl bg-cj-cream p-4 font-semibold text-cj-navy">Your inquiry has been saved for review in this project&apos;s dashboard.</p>}</div>
    <fieldset disabled={pending} className="mt-6 space-y-5"><legend className="sr-only">Inquiry details — all fields required</legend><p className="text-sm">All fields are required.</p>
      {(Object.keys(labels) as InquiryField[]).map((field) => {
        const props = {
          id: `inquiry-${field}`, name: field, required: true, maxLength: inquiryLimits[field], value: values[field],
          "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? `inquiry-${field}-error` : undefined,
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setValues({ ...values, [field]: event.target.value }); setSaved(false); },
          className: "mt-2 block min-h-11 w-full rounded-xl border border-cj-navy/30 bg-white px-4 py-3 text-base disabled:opacity-60",
        };
        return <div key={field}><label htmlFor={props.id} className="font-semibold text-cj-navy">{labels[field]}</label>{field === "message" ? <textarea {...props} rows={6} /> : <input {...props} type={field === "email" ? "email" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : "off"} />}{errors[field] && <p id={`inquiry-${field}-error`} className="mt-2 text-sm font-semibold text-cj-navy">{errors[field]}</p>}</div>;
      })}
      <div hidden aria-hidden="true"><label htmlFor="inquiry-website">Leave this blank</label><input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <button type="submit" className="min-h-11 rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white hover:bg-cj-navy/90 disabled:cursor-wait disabled:opacity-60">{pending ? "Saving inquiry…" : "Submit Inquiry"}</button>
    </fieldset><p role="status" className="mt-3 text-sm">{pending ? "Saving your inquiry. Please wait." : ""}</p>
  </form>;
}
