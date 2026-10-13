import Image from "next/image";
import Link from "next/link";
import { Mail, Phone } from "lucide-react";
import { SiFacebook, SiInstagram } from "react-icons/si";
import { companyContact } from "@/lib/contact";
import { publicNavigation } from "@/lib/navigation";

export default function SiteFooter() {
  return (
    <footer className="border-t border-cj-navy/10 bg-cj-cream pb-8 pt-10 text-cj-navy lg:pt-12">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
        <div className="grid items-center gap-7 text-center md:grid-cols-[1fr_1fr_0.85fr] md:gap-8 md:text-left">
          <div>
            <p className="font-display text-2xl font-extrabold tracking-tight">CHICKEN JOO</p>
            <p className="mx-auto mt-2 max-w-sm text-sm leading-5 text-cj-charcoal md:mx-0">Korean-style boneless chicken for your lunch break and your next barkada meal. Find your flavor at Chicken Joo.</p>
            <nav aria-label="Footer navigation" className="mt-3 flex flex-wrap justify-center gap-x-4 md:justify-start">
              {publicNavigation.map(({ href, label }) => <Link key={href} href={href} className="inline-flex min-h-11 items-center text-[13px] font-semibold transition-colors hover:text-cj-red">{label}</Link>)}
            </nav>
            <p className="mt-2 text-xs text-cj-charcoal">© Chicken Joo. All Rights Reserved {new Date().getFullYear()}</p>
          </div>
          <div className="min-w-0 md:justify-self-center">
            <Link href="/contact" className="inline-flex min-h-11 items-center text-lg font-bold hover:underline">Contact Us</Link>
            <div className="mt-1 flex flex-col items-center md:items-start">
              <a href={companyContact.phoneHref} className="inline-flex min-h-11 items-center gap-2 text-[13px] font-semibold hover:text-cj-red"><Phone size={17} aria-hidden="true" />{companyContact.phone}</a>
              <a href={`mailto:${companyContact.email}`} className="inline-flex min-h-11 items-center gap-2 break-all text-[13px] font-semibold hover:text-cj-red"><Mail size={17} className="shrink-0" aria-hidden="true" />{companyContact.email}</a>
            </div>
            <div className="mt-3 flex justify-center gap-2 md:justify-start">
              <a href={companyContact.facebook} target="_blank" rel="noopener noreferrer" aria-label="Chicken Joo on Facebook (opens in a new tab)" className="footer-social"><SiFacebook size={18} aria-hidden="true" /></a>
              <a href={companyContact.instagram} target="_blank" rel="noopener noreferrer" aria-label="Chicken Joo San Fernando on Instagram (opens in a new tab)" className="footer-social"><SiInstagram size={18} aria-hidden="true" /></a>
            </div>
          </div>
          <Link href="/" aria-label="Chicken Joo home" className="relative mx-auto block h-32 w-48 max-w-full overflow-hidden md:h-36 md:w-60">
            <Image src="/images/brand/chicken-joo-logo.jpg" alt="Chicken Joo Korean Boneless Fried Chicken with mascot" fill sizes="(max-width: 767px) 192px, 240px" className="object-cover mix-blend-multiply" />
          </Link>
        </div>
      </div>
    </footer>
  );
}
