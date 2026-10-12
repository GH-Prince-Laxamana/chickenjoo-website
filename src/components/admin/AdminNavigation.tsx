"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { resources } from "@/lib/admin/fields";

export default function AdminNavigation() {
  const pathname = usePathname(), router = useRouter();
  const [pending, setPending] = useState(false), [error, setError] = useState("");
  const busy = useRef(false);
  async function logout() {
    if (busy.current) return;
    busy.current = true; setPending(true); setError("");
    try {
      const response = await fetch("/api/v1/auth/logout", { method: "POST" });
      if (!response.ok) throw new Error();
      router.replace("/admin/login"); router.refresh();
    } catch { setError("Sign-out failed. Please try again."); }
    finally { busy.current = false; setPending(false); }
  }
  const links = [["/admin", "Overview"], ...Object.entries(resources).map(([key, label]) => [`/admin/${key}`, label]), ["/admin/orders", "Orders"], ["/admin/email-campaign", "Email campaign"]];
  return <div className="border-b border-cj-navy/10 bg-white px-4 py-4 sm:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
    <nav aria-label="Admin navigation" className="flex flex-wrap gap-2">{links.map(([href, label]) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-xl px-4 py-3 text-sm font-semibold ${pathname === href ? "bg-cj-navy text-white" : "text-cj-navy hover:bg-cj-cream"}`}>{label}</Link>)}</nav>
    <button onClick={logout} disabled={pending} className="min-h-11 rounded-xl border border-cj-navy/25 px-4 py-3 font-semibold text-cj-navy disabled:opacity-60">{pending ? "Signing out…" : "Sign out"}</button>
  </div>{error && <p role="alert" className="mx-auto mt-3 max-w-6xl">{error}</p>}</div>;
}
