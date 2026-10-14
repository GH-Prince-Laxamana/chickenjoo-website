"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useRef, useState, type ReactNode } from "react";
import { ArrowUpRight, ClipboardList, LayoutDashboard, LogOut, Mail, MapPin, Menu, MessageSquare, Newspaper, Users, UtensilsCrossed, X } from "lucide-react";

const links = [
  { href: "/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/menu-items", label: "Menu", icon: UtensilsCrossed },
  { href: "/admin/branches", label: "Branches", icon: MapPin },
  { href: "/admin/blog-posts", label: "Posts", icon: Newspaper },
  { href: "/admin/inquiries", label: "Inquiries", icon: MessageSquare },
  { href: "/admin/orders", label: "Orders", icon: ClipboardList },
  { href: "/admin/customers", label: "Customers", icon: Users },
  { href: "/admin/email-campaign", label: "Email campaign", icon: Mail },
];

export default function AdminNavigation({ email, children }: { email: string; children: ReactNode }) {
  const pathname = usePathname(), router = useRouter();
  const [open, setOpen] = useState(false), [pending, setPending] = useState(false), [error, setError] = useState("");
  const busy = useRef(false);
  const current = links.find((link) => link.href === pathname || (link.href !== "/admin" && pathname.startsWith(link.href + "/")))?.label ?? "Admin";

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

  return <div className="admin-shell">
    {open && <button type="button" aria-label="Close admin menu" className="admin-scrim" onClick={() => setOpen(false)} />}
    <aside id="admin-navigation" className={`admin-sidebar ${open ? "admin-sidebar-open" : ""}`} aria-label="Admin sidebar">
      <div className="admin-sidebar-brand">
        <span className="relative block h-13 w-24 overflow-hidden rounded-md bg-white"><Image src="/images/brand/chicken-joo-logo.jpg" alt="Chicken Joo" width={1080} height={1080} className="absolute -left-3 -top-8 h-28 w-28 max-w-none" /></span>
        <button type="button" aria-label="Close admin menu" className="admin-sidebar-close" onClick={() => setOpen(false)}><X size={22} aria-hidden="true" /></button>
      </div>
      <p className="admin-sidebar-caption">MANAGEMENT</p>
      <nav aria-label="Admin navigation" className="admin-sidebar-links">
        {links.map(({ href, label, icon: Icon }) => <Link key={href} href={href} aria-current={pathname === href ? "page" : undefined} onClick={() => setOpen(false)} className={`admin-sidebar-link ${pathname === href ? "admin-sidebar-link-active" : ""}`}><Icon size={19} strokeWidth={1.9} aria-hidden="true" /><span>{label}</span></Link>)}
      </nav>
      <div className="admin-sidebar-bottom">
        <p className="truncate text-sm font-semibold text-cj-navy" title={email}>{email}</p>
        <p className="mt-1 text-xs text-cj-charcoal">Administrator</p>
        <button type="button" onClick={logout} disabled={pending} className="admin-signout"><LogOut size={17} aria-hidden="true" />{pending ? "Signing out…" : "Sign out"}</button>
        {error && <p role="alert" className="mt-3 text-sm text-cj-red">{error}</p>}
      </div>
    </aside>
    <div className="admin-workspace">
      <header className="admin-topbar">
        <div className="flex min-w-0 items-center gap-3">
          <button type="button" aria-label="Open admin menu" aria-controls="admin-navigation" aria-expanded={open} onClick={() => setOpen(true)} className="admin-menu-toggle"><Menu size={22} aria-hidden="true" /></button>
          <div className="min-w-0"><p className="text-xs font-semibold uppercase tracking-[.12em] text-cj-red">Chicken Joo Admin</p><p className="truncate font-display text-lg font-bold text-cj-navy">{current}</p></div>
        </div>
        <Link href="/" className="admin-view-site">View website <ArrowUpRight size={17} aria-hidden="true" /></Link>
      </header>
      <main id="admin-content" tabIndex={-1} className="admin-content">{children}</main>
    </div>
  </div>;
}
