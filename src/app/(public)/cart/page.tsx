import Cart from "@/components/orders/Cart";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/user-session";
export const metadata = { title: "Your cart", robots: { index: false, follow: false } };
export default async function Page() { if (!await getUser()) redirect("/login?next=%2Fcart"); return <Cart />; }
