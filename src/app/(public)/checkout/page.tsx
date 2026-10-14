import Checkout from "@/components/orders/Checkout";
import { getPublicBranches } from "@/lib/public/catalog";
import type { PublicBranch } from "@/lib/public/types";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/user-session";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const metadata = { title: "Pickup order details", robots: { index: false, follow: false } };
export default async function Page() {
  const user = await getUser();
  if (!user) redirect("/login?next=%2Fcheckout");
  let branches: PublicBranch[] | undefined;
  try { branches = (await getPublicBranches({ q: "", filter: "", page: 1, limit: 12 })).data; }
  catch { /* Preserve the cart while the database is unavailable. */ }
  return branches ? <Checkout branches={branches} /> : <div className="mx-auto max-w-4xl px-4 py-12"><h1 className="font-display text-4xl">Checkout unavailable</h1><p className="mt-5">Pickup branches could not be loaded. Your cart is preserved; please try again shortly.</p></div>;
}
