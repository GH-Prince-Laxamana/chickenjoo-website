import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import AdminNavigation from "@/components/admin/AdminNavigation";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <div><a href="#admin-content" className="fixed left-4 top-4 z-50 -translate-y-24 rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white focus:translate-y-0">Skip to admin content</a><header className="bg-white px-4 py-6 sm:px-8"><div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4"><div><p className="font-display text-2xl font-semibold text-cj-navy">Chicken Joo Admin</p><p className="mt-1 break-all text-sm">{admin.email}</p></div><Link href="/" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline">View website</Link></div></header><AdminNavigation /><main id="admin-content" tabIndex={-1} className="mx-auto max-w-6xl px-4 py-10 sm:px-8">{children}</main></div>;
}
