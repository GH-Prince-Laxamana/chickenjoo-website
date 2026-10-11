"use client";
import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const busy = useRef(false);
  const feedback = useRef<HTMLParagraphElement>(null);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const data = new FormData(event.currentTarget);
    busy.current = true; setPending(true); setError("");
    try {
      const response = await fetch("/api/v1/auth/login", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ email: data.get("email"), password: data.get("password") }), cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error?.message || "Sign-in failed. Please try again.");
      router.replace("/admin"); router.refresh();
    } catch (error) {
      setError(error instanceof Error && error.message !== "Failed to fetch" ? error.message : "Sign-in is temporarily unavailable. Please try again.");
      requestAnimationFrame(() => feedback.current?.focus());
    } finally { busy.current = false; setPending(false); }
  }
  return <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10 sm:p-8">
    {error && <p role="alert" ref={feedback} tabIndex={-1} className="rounded-xl border border-cj-red p-4">{error}</p>}
    <fieldset disabled={pending} className="space-y-5">
      <legend className="sr-only">Admin credentials</legend>
      <div><label htmlFor="admin-email" className="font-semibold text-cj-navy">Email address</label><input id="admin-email" name="email" type="email" autoComplete="username" required maxLength={254} className="mt-2 block min-h-11 w-full rounded-xl border border-cj-navy/30 px-4 py-3" /></div>
      <div><label htmlFor="admin-password" className="font-semibold text-cj-navy">Password</label><input id="admin-password" name="password" type="password" autoComplete="current-password" required maxLength={256} className="mt-2 block min-h-11 w-full rounded-xl border border-cj-navy/30 px-4 py-3" /></div>
      <button type="submit" className="min-h-11 rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white hover:bg-cj-navy/90 disabled:opacity-60">{pending ? "Signing in…" : "Sign in"}</button>
    </fieldset>
    <p role="status" className="text-sm">{pending ? "Checking your credentials. Please wait." : "Authorized project administrators only."}</p>
  </form>;
}
