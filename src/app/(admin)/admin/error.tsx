"use client";
export default function AdminErrorPage({ reset }: { reset: () => void }) {
  return <main className="mx-auto max-w-3xl px-4 py-16"><h1 className="font-display text-3xl font-semibold text-cj-navy">Admin is temporarily unavailable</h1><p className="mt-4">Please try again shortly.</p><button onClick={reset} className="mt-6 min-h-11 rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white">Try again</button></main>;
}
