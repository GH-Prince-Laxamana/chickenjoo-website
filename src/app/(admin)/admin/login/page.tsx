import Link from "next/link";
import { redirect } from "next/navigation";
import { getAdmin } from "@/lib/auth/session";
import LoginForm from "@/components/admin/LoginForm";
export default async function AdminLogin() {
  if (await getAdmin()) redirect("/admin");
  return <main className="mx-auto max-w-lg px-4 py-16 sm:px-8"><Link href="/" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Back to the public website</Link><h1 className="mt-8 font-display text-4xl font-semibold text-cj-navy">Admin sign-in</h1><p className="mt-4 leading-relaxed">Manage Chicken Joo&apos;s student-project content and inquiries.</p><LoginForm /></main>;
}
