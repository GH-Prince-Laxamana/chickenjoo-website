import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { companyContact } from "@/lib/contact";
import { publicNavigation } from "@/lib/navigation";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cj-navy/10 bg-cj-cream px-5 pb-6 pt-8 text-cj-navy sm:px-8 lg:pt-10">
      <div className="mx-auto max-w-7xl">
        {/* Main Content Grid */}
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-[1.2fr_0.8fr_1fr] lg:gap-10">
          {/* Brand & Mission */}
          <div className="text-center sm:text-left">
            <p className="font-display text-2xl font-extrabold tracking-tight">
              CHICKEN JOO
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-cj-charcoal">
              Korean-style boneless chicken for your lunch break and your next
              barkada meal. Find your flavor at Chicken Joo.
            </p>
          </div>

          {/* Navigation Links */}
          <div className="text-center sm:text-left">
            <p className="text-xs font-bold uppercase tracking-wider text-cj-navy/70">
              Navigation
            </p>
            <nav
              aria-label="Footer navigation"
              className="mt-3 flex flex-col gap-2 text-sm font-semibold"
            >
              {publicNavigation.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-cj-red"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact & Social Links */}
          <div className="flex flex-col justify-between text-center sm:text-left">
            <div>
              <Link
                href="/contact"
                className="text-xs font-bold uppercase tracking-wider text-cj-navy/70 hover:underline"
              >
                Contact Us
              </Link>
              <div className="mt-2.5 flex flex-col gap-2 text-sm font-semibold">
                <a
                  href={companyContact.phoneHref}
                  className="inline-flex items-center justify-center gap-2 hover:text-cj-red sm:justify-start"
                >
                  <Phone size={16} aria-hidden="true" className="shrink-0" />
                  <span>{companyContact.phone}</span>
                </a>
                <a
                  href={`mailto:${companyContact.email}`}
                  className="inline-flex items-center justify-center gap-2 break-all hover:text-cj-red sm:justify-start"
                >
                  <Mail size={16} aria-hidden="true" className="shrink-0" />
                  <span>{companyContact.email}</span>
                </a>
              </div>
            </div>

            {/* Social Icons & Logo */}
            <div className="mt-4 flex items-center justify-center gap-4 sm:justify-start">
              <div className="flex items-center gap-2">
                <a
                  href={companyContact.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chicken Joo on Facebook (opens in a new tab)"
                  className="footer-social"
                >
                  <SiFacebook size={18} aria-hidden="true" />
                </a>
                <a
                  href={companyContact.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Chicken Joo San Fernando on Instagram (opens in a new tab)"
                  className="footer-social"
                >
                  <SiInstagram size={18} aria-hidden="true" />
                </a>
                <a
                  href={`mailto:${companyContact.email}`}
                  aria-label="Email Chicken Joo"
                  className="footer-social"
                >
                  <Mail size={18} aria-hidden="true" />
                </a>
              </div>

              {/* Compact Logo Accent */}
              <Link
                href="/"
                aria-label="Chicken Joo home"
                className="relative h-10 w-16 shrink-0 overflow-hidden"
              >
                <Image
                  src="/images/brand/chicken-joo-logo.jpg"
                  alt="Chicken Joo mascot logo"
                  fill
                  sizes="64px"
                  className="object-contain mix-blend-multiply"
                />
              </Link>
            </div>
          </div>
        </div>

        {/* Bottom Bar / Copyright */}
        <div className="mt-8 border-t border-cj-navy/15 pt-5 text-center text-xs text-cj-charcoal sm:flex sm:items-center sm:justify-between sm:text-left">
          <p>© {new Date().getFullYear()} Chicken Joo. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
}
