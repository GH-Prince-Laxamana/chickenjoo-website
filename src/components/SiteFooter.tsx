import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { companyContact } from "@/lib/contact";
import { publicNavigation } from "@/lib/navigation";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cj-navy/10 bg-cj-cream px-5 pb-6 pt-14 text-cj-navy sm:px-8 lg:pt-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-10 text-center md:grid-cols-[1fr_1fr_0.85fr] md:gap-8 md:text-left">
          <div>
            <p className="font-display text-3xl font-extrabold tracking-tight">CHICKEN JOO</p>
            <p className="mx-auto mt-4 max-w-sm leading-relaxed text-cj-charcoal md:mx-0">Korean-style boneless chicken for your lunch break and your next barkada meal. Find your flavor at Chicken Joo.</p>
            <nav aria-label="Footer navigation" className="mt-5 flex flex-wrap justify-center gap-x-5 md:justify-start">
              {publicNavigation.map(({ href, label }) => <Link key={href} href={href} className="inline-flex min-h-11 items-center text-sm font-semibold transition-colors hover:text-cj-red">{label}</Link>)}
            </nav>
          </div>
          <div className="min-w-0 md:justify-self-center">
            <Link href="/contact" className="inline-flex min-h-11 items-center text-xl font-bold hover:underline">Contact Us</Link>
            <div className="mt-3 flex flex-col items-center md:items-start">
              <a href={companyContact.phoneHref} className="inline-flex min-h-11 items-center gap-3 text-sm font-semibold hover:text-cj-red"><Phone size={19} aria-hidden="true" />{companyContact.phone}</a>
              <a href={`mailto:${companyContact.email}`} className="inline-flex min-h-11 items-center gap-3 break-all text-sm font-semibold hover:text-cj-red"><Mail size={19} className="shrink-0" aria-hidden="true" />{companyContact.email}</a>
            </div>
            <div className="mt-5 flex justify-center gap-3 md:justify-start">
              <a href={companyContact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Chicken Joo on Facebook (opens in a new tab)" className="footer-social"><SiFacebook size={20} aria-hidden="true" /></a>
              <a href={companyContact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Chicken Joo San Fernando on Instagram (opens in a new tab)" className="footer-social"><SiInstagram size={20} aria-hidden="true" /></a>
              <a href={`mailto:${companyContact.email}`} aria-label="Email Chicken Joo" className="footer-social"><Mail size={20} aria-hidden="true" /></a>
            </div>
          </div>
          <Link href="/" aria-label="Chicken Joo home" className="relative mx-auto block h-44 w-64 max-w-full overflow-hidden md:w-full">
            <Image src="/images/chicken-joo-logo.jpg" alt="Chicken Joo Korean Boneless Fried Chicken with mascot" fill sizes="(max-width: 767px) 256px, 320px" className="object-cover mix-blend-multiply" />
          </Link>
        </div>
        <hr className="mb-6 mt-12 border-cj-navy/15" />
        <p className="text-center text-sm text-cj-charcoal">© Chicken Joo. All Rights Reserved {new Date().getFullYear()}</p>
      </div>
    </footer>
  );
}
