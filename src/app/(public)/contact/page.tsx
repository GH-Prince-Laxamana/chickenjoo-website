import type { Metadata } from "next";
import Link from "next/link";
import BranchCard from "@/components/catalog/BranchCard";
import InquiryForm from "@/components/InquiryForm";
import { getPublicBranches } from "@/lib/public/catalog";
export const metadata: Metadata = { title: "Get in Touch", description: "Find Chicken Joo branch contact details or leave an inquiry for this student project's dashboard." };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function ContactPage() {
  let branches;
  try { branches = await getPublicBranches({ q: "", filter: "", page: 1, limit: 48 }); } catch { /* Keep the inquiry form available independently. */ }
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
    <h1 className="font-display text-4xl font-semibold text-cj-navy sm:text-5xl">Get in Touch</h1><p className="mt-5 max-w-3xl text-lg leading-relaxed">Looking for a branch? Find addresses, opening hours, and available contact details below. You can also leave a message through this project&apos;s inquiry form.</p>
    <div className="mt-10 grid items-start gap-10 lg:grid-cols-2"><section aria-labelledby="branch-contacts"><h2 id="branch-contacts" className="mb-6 font-display text-3xl font-semibold text-cj-navy">Branch contacts</h2>
      {branches?.data.length ? <div className="space-y-5">{branches.data.map((branch) => <BranchCard branch={branch} key={branch.id} headingLevel={3} />)}</div> : <p className="rounded-2xl bg-white p-6">{branches ? "Branch details are on the way." : "Branch contacts are temporarily unavailable."}</p>}
      <Link href="/branches" className="mt-4 inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Explore all branches</Link></section><InquiryForm /></div>
  </div>;
}
