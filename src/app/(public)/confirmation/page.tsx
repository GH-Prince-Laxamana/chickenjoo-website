import Confirmation from "@/components/orders/Confirmation";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/user-session";
export const metadata = { title: "Your order summary", robots: { index: false, follow: false } };
export default async function Page() { if (!await getUser()) redirect("/login?next=%2Fconfirmation"); return <Confirmation />; }
