import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import CustomerManager from "@/components/admin/CustomerManager";
export default async function Page() { if (!await getAdmin()) redirect("/admin/login"); return <CustomerManager />; }
