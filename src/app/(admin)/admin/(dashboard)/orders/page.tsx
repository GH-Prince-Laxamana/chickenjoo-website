import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import OrderManager from "@/components/admin/OrderManager";
export default async function Page() { if (!await getAdmin()) redirect("/admin/login"); return <OrderManager />; }
