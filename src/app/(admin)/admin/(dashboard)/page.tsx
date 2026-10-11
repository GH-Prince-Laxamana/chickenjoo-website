import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import { connectDatabase } from "@/lib/db";
import { resources } from "@/lib/admin/fields";
export default async function AdminOverview() {
  if (!await getAdmin()) redirect("/admin/login");
  let counts: number[] | undefined;
  try {
    const connection = await connectDatabase();
    counts = await Promise.all(["menuItems", "branches", "blogPosts", "inquiries"].map((name) => connection.collection(name).countDocuments({}, { maxTimeMS: 5000 })));
  } catch { /* Navigation remains usable when counts are unavailable. */ }
  return <div><h1 className="font-display text-4xl font-semibold text-cj-navy">Overview</h1><p className="mt-4 max-w-3xl leading-relaxed">Manage public content and review student-project inquiries. Review simulated pickup orders and advance their demo status.</p><div className="mt-8 grid gap-5 sm:grid-cols-2">{Object.entries(resources).map(([resource, label], index) => <Link key={resource} href={`/admin/${resource}`} className="rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10 hover:ring-cj-navy/30"><h2 className="font-display text-2xl font-semibold text-cj-navy">{label}</h2><p className="mt-3">{counts ? `${counts[index]} saved records` : "Open management"}</p><p className="mt-4 font-semibold text-cj-navy underline">Manage {label.toLowerCase()}</p></Link>)}</div><Link href="/admin/orders" className="mt-6 inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white">Manage demo orders</Link></div>;
}
