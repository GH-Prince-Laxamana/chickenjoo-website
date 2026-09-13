import Link from "next/link";

// Server Component — no interactivity needed, no "use client" required
const QUICK_LINKS = [
  { href: "/menu", label: "Menu" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-blue text-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
          {/* ── Brand ── */}
          <div>
            <p className="font-heading font-bold text-xl mb-2">ChickenJoo</p>
            <p className="text-sm text-steel leading-relaxed">
              Premium Korean fried chicken, made fresh for every craving.
            </p>
          </div>

          {/* ── Quick links ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-steel mb-4">
              Quick Links
            </p>
            <ul className="space-y-2" role="list">
              {QUICK_LINKS.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white hover:text-red transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2 rounded"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ── Contact ── */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-steel mb-4">
              Contact
            </p>
            {/* address element is semantically correct for contact info */}
            <address className="not-italic space-y-1.5">
              <p className="text-sm text-white">info@chickenjoo.com</p>
              <p className="text-sm text-white">+63 912 345 6789</p>
            </address>
          </div>
        </div>

        {/* ── Copyright ── */}
        <div className="mt-10 pt-6 border-t border-steel/30 text-center text-xs text-steel">
          © {year} ChickenJoo. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
