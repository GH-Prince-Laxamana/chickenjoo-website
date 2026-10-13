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
  const submissionId = useRef("");
  const submittedValues = useRef("");
  const inFlight = useRef(false);
  function focusFirstError(fieldErrors: InquiryErrors) {
    const first = (Object.keys(labels) as InquiryField[]).find((field) => fieldErrors[field]);
    if (first) requestAnimationFrame(() => document.getElementById(`inquiry-${first}`)?.focus());
  }
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (inFlight.current) return;
    setSaved(false); setFailure("");
    const validation = validateInquiry(values);
    setErrors(validation.errors);
    if (!validation.data) { focusFirstError(validation.errors); return; }
    const fingerprint = JSON.stringify(validation.data);
    if (!submissionId.current || submittedValues.current !== fingerprint) {
      submissionId.current = crypto.randomUUID(); submittedValues.current = fingerprint;
    }
    const website = new FormData(event.currentTarget).get("website") || "";
    inFlight.current = true; setPending(true);
    try {
      const response = await fetch("/api/v1/inquiries", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...validation.data, website, submissionId: submissionId.current }), cache: "no-store" });
      const body = await response.json();
      if (!response.ok) {
        const fieldErrors: InquiryErrors = body.error?.fields || {};
        setErrors(fieldErrors);
        setFailure(Object.keys(fieldErrors).length ? "" : body.error?.message || "Your inquiry could not be saved. Please try again.");
        focusFirstError(fieldErrors);
      }
      else { setSaved(true); setValues(empty); setErrors({}); submissionId.current = ""; submittedValues.current = ""; }
    } catch { setFailure("We couldn’t confirm that your inquiry was saved. Please try again. Your message is still in the form."); }
    finally { inFlight.current = false; setPending(false); }
  }
  return <form onSubmit={submit} noValidate aria-label="Send Chicken Joo a message" className="rounded-3xl border border-cj-navy/15 bg-white p-6 text-cj-navy sm:p-7 lg:p-8">
    <fieldset disabled={pending} className="space-y-4"><legend className="sr-only">Message details</legend>
      <div>
        <h2 className="font-display text-2xl font-bold tracking-tight text-cj-red">Send us a message</h2>
        <p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Tell us what you need help with. Your message will be saved for our team to review.</p>
      </div>
      {(Object.keys(labels) as InquiryField[]).map((field) => {
        const props = {
          id: `inquiry-${field}`, name: field, required: true, maxLength: inquiryLimits[field], value: values[field],
          "aria-invalid": Boolean(errors[field]), "aria-describedby": errors[field] ? `inquiry-${field}-error` : undefined,
          onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => { setValues({ ...values, [field]: event.target.value }); setErrors((current) => ({ ...current, [field]: undefined })); setSaved(false); },
          className: `mt-1.5 block min-h-11 w-full bg-white text-base text-cj-navy outline-none transition-colors disabled:opacity-60 sm:text-sm ${field === "message" ? "rounded-xl border px-3 py-2 focus:ring-2" : "rounded-none border-x-0 border-t-0 border-b-2 px-0 py-2 focus:ring-0"} ${errors[field] ? "border-cj-red focus:border-cj-red focus:ring-cj-red/15" : "border-cj-navy/25 focus:border-cj-navy focus:ring-cj-navy/10"}`,
        };
        return <div key={field}><label htmlFor={props.id} className="text-sm font-semibold text-cj-navy">{labels[field]} <span className="text-cj-red" aria-hidden="true">*</span></label>{field === "message" ? <textarea {...props} rows={4} /> : <input {...props} type={field === "email" ? "email" : "text"} autoComplete={field === "name" ? "name" : field === "email" ? "email" : "off"} />}{errors[field] && <p id={`inquiry-${field}-error`} className="mt-1.5 text-sm font-semibold text-cj-red">{errors[field]}</p>}</div>;
      })}
      <div hidden aria-hidden="true"><label htmlFor="inquiry-website">Leave this blank</label><input id="inquiry-website" name="website" tabIndex={-1} autoComplete="off" /></div>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
        <button type="submit" className="min-h-11 rounded-full bg-cj-red px-6 py-2 text-sm font-semibold text-white hover:bg-cj-red/90 disabled:cursor-wait disabled:opacity-60">{pending ? "Saving message…" : "Send Message"}</button>
        <div aria-live="polite" className="min-w-0 flex-1 text-sm leading-relaxed">
          {saved && <p role="status" className="font-semibold text-cj-navy">Thanks for your message. It has been saved for review.</p>}
          {failure && <p role="alert" className="font-semibold text-cj-red">{failure}</p>}
          {pending && <p className="text-cj-charcoal">Saving your message. Please wait.</p>}
        </div>
      </div>
    </fieldset>
  </form>;
}
