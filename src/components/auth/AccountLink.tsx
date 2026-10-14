"use client";
import Link from "next/link";
import { UserRound } from "lucide-react";
import { useUser } from "./UserProvider";
export default function AccountLink() {
  const { user } = useUser();
  return <Link href={user ? "/account" : "/login"} className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full px-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream lg:order-3"><UserRound size={20} aria-hidden="true" /><span className="hidden xl:inline">{user ? "Account" : "Sign in"}</span><span className="sr-only xl:hidden">{user ? "Your account" : "Sign in"}</span></Link>;
}
