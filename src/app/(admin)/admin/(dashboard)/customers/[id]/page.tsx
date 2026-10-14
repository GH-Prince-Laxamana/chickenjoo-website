import { redirect, notFound } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import CustomerDetail from "@/components/admin/CustomerDetail";
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  if (!await getAdmin()) redirect("/admin/login");
  const { id } = await params;
  if (!/^[a-f0-9]{24}$/.test(id)) notFound();
  return <CustomerDetail id={id} />;
}
