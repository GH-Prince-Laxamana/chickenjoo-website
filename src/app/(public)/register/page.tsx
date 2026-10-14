import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/user-session";
import { safeReturnTo } from "@/lib/auth/validation";
import AuthScreen from "@/components/auth/AuthScreen";
export const metadata = { title: "Create an account", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const next = safeReturnTo((await searchParams).next);
  if (await getUser()) redirect(next);
  return <AuthScreen register next={next} />;
}
