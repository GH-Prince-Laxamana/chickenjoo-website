import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/user-session";
import Account from "@/components/auth/Account";
export const metadata = { title: "Your account", robots: { index: false, follow: false } };
export default async function Page() { if (!await getUser()) redirect("/login?next=%2Faccount"); return <Account />; }
