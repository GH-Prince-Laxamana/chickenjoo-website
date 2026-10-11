import Link from "next/link";

export default function FoundationPage({ title, description }: { title: string; description: string }) {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
      <p className="mb-4 text-sm font-semibold uppercase tracking-wider text-cj-navy">Coming soon</p>
      <h1 className="font-display text-4xl font-semibold text-cj-navy sm:text-5xl">{title}</h1>
      <p className="mt-6 max-w-2xl text-base leading-relaxed text-cj-charcoal/85">{description}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-cj-charcoal/75">
        This page is being prepared for the student demonstration.
      </p>
      <Link href="/" className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-5 py-3 font-semibold text-white hover:bg-cj-navy/90">
        Back to home
      </Link>
    </section>
  );
}
