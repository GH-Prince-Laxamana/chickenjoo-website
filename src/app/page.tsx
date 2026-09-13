import Link from "next/link";

// No per-page metadata export — this page uses the layout default:
// "ChickenJoo — Korean Fried Chicken"
// This is intentional: the homepage title IS the default.

/**
 * Placeholder homepage — Phase 1 only.
 * Purpose: prove the design system is wired correctly (fonts, colors, header, footer).
 * Replace entirely in Phase 2 with the real landing page content.
 */
export default function HomePage() {
  return (
    <section
      className="flex flex-col items-center justify-center flex-1 px-4 py-24 text-center"
      aria-label="Coming soon"
    >
      {/* Eyebrow label */}
      <p className="text-sm font-semibold uppercase tracking-widest text-red mb-4">
        Now Serving
      </p>

      {/* Primary heading — font-heading uses Outfit via CSS variable */}
      <h1 className="font-heading text-6xl sm:text-8xl font-bold text-blue mb-6 leading-none tracking-tight">
        ChickenJoo
      </h1>

      <p className="text-base sm:text-lg text-blue/70 max-w-sm mb-10 leading-relaxed">
        Premium Korean fried chicken. Fresh, crispy, and made for every craving.
        Full website coming soon.
      </p>

      {/* CTA — links to /menu (page doesn't exist yet, that's fine for placeholder) */}
      <Link
        href="/menu"
        className="inline-flex items-center gap-2 bg-red text-white font-semibold text-sm px-8 py-3.5 rounded-full hover:bg-blue transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2"
      >
        View Our Menu
      </Link>
    </section>
  );
}
