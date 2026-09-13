"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavLink {
  href: string;
  label: string;
}

const NAV_LINKS: NavLink[] = [
  { href: "/", label: "Home" },
  { href: "/menu", label: "Menu" },
  { href: "/blog", label: "Blog" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // "/" must match exactly; all other routes match as prefix
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-white shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* ── Logo ── */}
          <Link
            href="/"
            aria-label="ChickenJoo — go to homepage"
            className="font-heading font-bold text-xl text-blue hover:text-red transition-colors duration-150"
          >
            ChickenJoo
          </Link>

          {/* ── Desktop navigation ── */}
          <nav
            aria-label="Main navigation"
            className="hidden md:flex items-center gap-8"
          >
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={[
                  "relative text-sm font-medium transition-colors duration-150",
                  "after:absolute after:-bottom-0.5 after:left-0 after:h-0.5 after:w-full",
                  "after:origin-left after:transition-transform after:duration-200",
                  "after:bg-red",
                  isActive(href)
                    ? "text-red after:scale-x-100"
                    : "text-blue hover:text-red after:scale-x-0 hover:after:scale-x-100",
                ].join(" ")}
              >
                {label}
              </Link>
            ))}
          </nav>

          {/* ── Mobile hamburger button ── */}
          <button
            type="button"
            onClick={() => setIsOpen((prev) => !prev)}
            aria-label={
              isOpen ? "Close navigation menu" : "Open navigation menu"
            }
            aria-expanded={isOpen}
            aria-controls="mobile-nav"
            className="md:hidden p-2 rounded-md text-blue hover:text-red hover:bg-white/60 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-red focus-visible:outline-offset-2"
          >
            {isOpen ? (
              // X icon
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* ── Mobile navigation drawer ── */}
      {isOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-white bg-white px-4 pb-4"
        >
          <ul className="flex flex-col gap-1 pt-2" role="list">
            {NAV_LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setIsOpen(false)}
                  className={[
                    "block py-2.5 px-3 rounded-md text-sm font-medium transition-colors duration-150",
                    isActive(href)
                      ? "bg-white text-red font-semibold"
                      : "text-blue hover:bg-white/60 hover:text-red",
                  ].join(" ")}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
