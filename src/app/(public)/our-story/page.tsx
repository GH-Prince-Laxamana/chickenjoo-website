import type { Metadata } from "next";
import Link from "next/link";
import ContentImage from "@/components/ContentImage";
export const metadata: Metadata = { title: "Meet Chicken Joo", description: "Meet Chicken Joo: Korean-style boneless chicken, everyday value, solo meals, and sharing boxes in Pampanga." };
const strengths = [
  ["Everyday value", "A 3-piece chicken-and-rice meal is ₱99. Larger chicken boxes start at ₱199, with sides available separately."],
  ["Choose your flavor", "Go with Original, Yangnyeom, Yangnyeom Extra Spicy, or Yangnyeom with Garlic. The 14-piece two-flavor option lets you select two flavors in one box."],
  ["Solo meals and sharing boxes", "Choose a 3-piece meal with rice or Joomami Fries, or a 7-piece or 14-piece chicken box for sharing. Rice is not included with the larger boxes."],
  ["Find us in Pampanga", "Explore the listed branches near HAU and AUF in Angeles City, in San Fernando Downtown, and in Magalang. Check each location's address and hours before your visit."],
];
export default function StoryPage() {
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
    <p className="text-sm font-semibold uppercase tracking-wider text-cj-navy">Our Story</p><h1 className="mt-4 font-display text-4xl font-semibold text-cj-navy sm:text-5xl">Meet Chicken Joo</h1>
    <p className="mt-6 text-xl font-semibold text-cj-navy">Korean-style boneless chicken for everyday cravings.</p>
    <div className="mt-5 max-w-3xl space-y-4 text-lg leading-relaxed text-cj-charcoal/85"><p>Chicken Joo brings together boneless chicken, Korean-style flavors, and budget-friendly choices. Pick a solo meal, add Joomami Fries, or choose a larger chicken box to share.</p><p>With a chicken-and-rice meal at ₱99 and sharing options from ₱199, the menu gives you room to choose what suits your appetite and budget. Explore the flavors, find a Pampanga branch, and plan your next Chicken Joo visit.</p></div>
    <section aria-labelledby="strengths-heading" className="mt-12"><h2 id="strengths-heading" className="font-display text-3xl font-semibold text-cj-navy">What&apos;s on the table</h2><div className="mt-6 grid gap-6 md:grid-cols-2">{strengths.map(([title, description]) => <article key={title} className="rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10"><ContentImage label={title} /><h3 className="mt-5 font-display text-2xl font-semibold text-cj-navy">{title}</h3><p className="mt-3 leading-relaxed">{description}</p></article>)}</div></section>
    <div className="mt-10 flex flex-wrap gap-4"><Link href="/menu" className="inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white hover:bg-cj-navy/90">Explore the Menu</Link><Link href="/branches" className="inline-flex min-h-11 items-center rounded-xl border border-cj-navy/25 bg-white px-6 py-3 font-semibold text-cj-navy hover:bg-cj-cream">Find a Branch</Link></div>
  </div>;
}
