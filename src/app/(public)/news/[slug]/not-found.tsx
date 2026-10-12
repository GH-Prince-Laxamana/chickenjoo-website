import Link from "next/link";
export default function UpdateNotFound() {
  return <div className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-4xl font-semibold text-cj-navy">Update not found</h1><p className="mt-4">This update is not available.</p><Link href="/news" className="mt-6 inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Back to updates</Link></div>;
}
