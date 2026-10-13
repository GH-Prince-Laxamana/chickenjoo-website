import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import AdminNavigation from "@/components/admin/AdminNavigation";
export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect("/admin/login");
  return <><a href="#admin-content" className="fixed left-4 top-4 z-[70] -translate-y-24 rounded-xl bg-cj-red px-5 py-3 font-semibold text-white focus:translate-y-0">Skip to admin content</a><AdminNavigation email={admin.email}>{children}</AdminNavigation></>;
}
