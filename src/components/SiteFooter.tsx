import Link from "next/link";
import { publicNavigation } from "@/lib/navigation";

export default function SiteFooter() {
  return (
    <footer className="bg-cj-navy px-4 py-10 text-white sm:px-8">
      <div className="mx-auto max-w-6xl">
        <p className="font-display text-xl font-semibold">CHICKEN JOO</p>
        <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/85">
          Korean-style boneless chicken for your lunch break and your next barkada meal. Find your flavor at Chicken Joo.
        </p>
        <nav aria-label="Footer navigation" className="mt-5 flex flex-wrap gap-x-6 gap-y-1">
          {publicNavigation.map(({ href, label }) => (
            <Link key={href} href={href} className="inline-flex min-h-11 items-center text-sm hover:underline">
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
