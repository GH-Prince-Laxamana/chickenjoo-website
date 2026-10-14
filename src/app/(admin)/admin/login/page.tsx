import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import AuthScreen from "@/components/auth/AuthScreen";
export default async function AdminLogin() {
  if (await getAdmin()) redirect("/admin");
  return <main><AuthScreen admin /></main>;
}
