"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ArrowRight } from "lucide-react";
import { resumePendingCart } from "@/lib/orders/cart";
import { safeReturnTo } from "@/lib/auth/validation";
export default function AuthForm({ admin = false, register = false, next = "/menu" }: { admin?: boolean; register?: boolean; next?: string }) {
  const router = useRouter(), busy = useRef(false), feedback = useRef<HTMLParagraphElement>(null);
  const [error, setError] = useState(""), [fields, setFields] = useState<Record<string, string>>({}), [pending, setPending] = useState(false), [show, setShow] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    const body = { email: data.get("email"), password: data.get("password"), ...(register ? { name: data.get("name") } : {}) };
    if (register && data.get("password") !== data.get("confirmPassword")) { setFields({ confirmPassword: "The passwords do not match." }); setError("Check your account details."); requestAnimationFrame(() => feedback.current?.focus()); return; }
    busy.current = true; setPending(true); setError(""); setFields({});
    try {
      const response = await fetch(`/api/v1/${admin ? "auth" : "user"}/${register ? "register" : "login"}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body), cache: "no-store" });
      const result = await response.json();
      if (!response.ok) { setFields(result.error?.fields || {}); throw new Error(result.error?.message || "Please try again."); }
      if (!admin) {
        window.dispatchEvent(new Event("cj-account-changed"));
        try { await resumePendingCart(); } catch { /* The pending choice remains for a retry on the account page. */ }
      }
      router.replace(admin ? "/admin" : safeReturnTo(next)); router.refresh();
    } catch (error) {
      setError(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "Sign-in is temporarily unavailable. Please try again.");
      requestAnimationFrame(() => feedback.current?.focus());
    } finally { busy.current = false; setPending(false); }
  }
  function fieldError(name: string) { return fields[name] ? <p id={`auth-${name}-error`} className="auth-field-error">{fields[name]}</p> : null; }
  const attributes = (name: string) => ({ "aria-invalid": Boolean(fields[name]), "aria-describedby": fields[name] ? `auth-${name}-error` : undefined });
  return <form onSubmit={submit} className="auth-form">
    {error && <p role="alert" ref={feedback} tabIndex={-1} className="auth-error">{error}</p>}
    <fieldset disabled={pending}>
      <legend className="sr-only">{admin ? "Administrator" : "Customer"} {register ? "registration" : "sign-in"} details</legend>
      {register && <div><label htmlFor="auth-name">Full name</label><input id="auth-name" name="name" autoComplete="name" required maxLength={100} {...attributes("name")} />{fieldError("name")}</div>}
      <div><label htmlFor="auth-email">Email address</label><input id="auth-email" name="email" type="email" autoComplete="username" required maxLength={254} {...attributes("email")} />{fieldError("email")}</div>
      <div><label htmlFor="auth-password">Password</label><div className="auth-password"><input id="auth-password" name="password" type={show ? "text" : "password"} autoComplete={register ? "new-password" : "current-password"} required minLength={register ? 16 : undefined} maxLength={256} {...attributes("password")} aria-describedby={fields.password ? "auth-password-error" : register ? "auth-password-help" : undefined} /><button type="button" onClick={() => setShow(!show)} aria-label={show ? "Hide password" : "Show password"} aria-pressed={show}>{show ? <EyeOff size={19} aria-hidden="true" /> : <Eye size={19} aria-hidden="true" />}</button></div>{fieldError("password")}{register && <p id="auth-password-help" className="auth-help">Use at least 16 characters. A memorable passphrase works well.</p>}</div>
      {register && <div><label htmlFor="auth-confirmPassword">Confirm password</label><input id="auth-confirmPassword" name="confirmPassword" type={show ? "text" : "password"} autoComplete="new-password" required minLength={16} maxLength={256} {...attributes("confirmPassword")} />{fieldError("confirmPassword")}</div>}
      <button type="submit" className="auth-submit">{pending ? register ? "Creating account…" : "Signing in…" : register ? "Create account" : "Sign in"}{!pending && <ArrowRight size={18} aria-hidden="true" />}</button>
    </fieldset>
    <p role="status" className="sr-only">{pending ? "Please wait while we check your details." : ""}</p>
  </form>;
}
