"use client";
export default function ArticleError({ reset }: { reset: () => void }) {
  return <div className="mx-auto max-w-3xl px-4 py-16" role="alert"><h1 className="font-display text-3xl font-semibold text-cj-navy">We couldn’t load this story</h1><p className="mt-4">Please try again in a moment.</p><button onClick={reset} className="mt-6 min-h-11 rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white">Reload story</button></div>;
}
