import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { connectDatabase } from "@/lib/db";
import { resources } from "@/lib/admin/fields";
import { ArrowRight, ClipboardList, MapPin, MessageSquare, Newspaper, UtensilsCrossed } from "lucide-react";

const icons = { "menu-items": UtensilsCrossed, branches: MapPin, "blog-posts": Newspaper, inquiries: MessageSquare };
export default async function AdminOverview() {
  if (!await getAdmin()) redirect("/admin/login");
  let counts: number[] | undefined;
  try {
    const connection = await connectDatabase();
    counts = await Promise.all(["menuItems", "branches", "blogPosts", "inquiries"].map((name) => connection.collection(name).countDocuments({}, { maxTimeMS: 5000 })));
  } catch { /* Navigation remains usable when counts are unavailable. */ }
  return <div>
    <p className="text-xs font-bold uppercase tracking-[.14em] text-cj-red">Your workspace</p>
    <h1 className="mt-2 font-display text-4xl font-bold tracking-tight text-cj-navy">Overview</h1>
    <p className="mt-3 max-w-3xl leading-relaxed text-cj-charcoal">Keep the menu, branch details, and news up to date. Review messages and manage saved pickup orders.</p>
    <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">{Object.entries(resources).map(([resource, label], index) => {
      const Icon = icons[resource as keyof typeof icons];
      return <Link key={resource} href={`/admin/${resource}`} className="admin-panel group flex min-h-52 flex-col p-6 transition-[transform,box-shadow] hover:-translate-y-1 hover:shadow-[0_18px_34px_-22px_#11144760]">
        <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cj-red/10 text-cj-red"><Icon size={22} strokeWidth={1.8} aria-hidden="true" /></span>
        <h2 className="mt-5 font-display text-xl font-bold text-cj-navy">{label}</h2>
        <p className="mt-1 text-sm text-cj-charcoal">{counts ? `${counts[index]} saved records` : "Open management"}</p>
        <span className="mt-auto inline-flex items-center gap-2 pt-5 text-sm font-bold text-cj-red">Manage {label.toLowerCase()} <ArrowRight size={16} aria-hidden="true" className="transition-transform group-hover:translate-x-1" /></span>
      </Link>;
    })}</div>
    <section className="admin-panel mt-7 flex flex-col items-start justify-between gap-5 p-6 sm:flex-row sm:items-center sm:p-7">
      <div className="flex items-start gap-4"><span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-cj-yellow/30 text-cj-navy"><ClipboardList size={23} aria-hidden="true" /></span><div><h2 className="font-display text-xl font-bold text-cj-navy">Pickup orders</h2><p className="mt-1 text-sm leading-relaxed text-cj-charcoal">Review saved orders and keep their pickup status current.</p></div></div>
      <Link href="/admin/orders" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-red px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-[#cb1024]">Manage orders <ArrowRight size={17} aria-hidden="true" /></Link>
    </section>
  </div>;
}
