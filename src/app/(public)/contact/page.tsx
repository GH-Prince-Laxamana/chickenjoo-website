import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
import { companyContact } from "@/lib/contact";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Chicken Joo for general questions, campaign inquiries, and feedback. Reach us by email, phone, or our inquiry form.",
};
export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
      <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <section aria-labelledby="contact-heading" className="text-cj-navy lg:self-center lg:pr-8">
          <h1 id="contact-heading" className="font-display text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl">We’re here to help.</h1>
          <p className="mt-4 max-w-lg leading-relaxed text-cj-charcoal">Ask about Chicken Joo, our campaigns, or share something you’d like us to hear.</p>
          <ul className="mt-7 divide-y divide-cj-navy/10 border-t border-cj-navy/10">
            <li className="flex items-center gap-4 py-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cj-cream text-cj-red"><Mail size={21} aria-hidden="true" /></span>
              <a href={`mailto:${companyContact.email}`} className="min-w-0 break-all font-semibold leading-relaxed transition-colors hover:text-cj-red">{companyContact.email}</a>
            </li>
            <li className="flex items-center gap-4 py-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cj-cream text-cj-red"><Phone size={21} aria-hidden="true" /></span>
              <div className="min-w-0">
                <a href={companyContact.phoneHref} className="font-semibold transition-colors hover:text-cj-red">{companyContact.phone}</a>
                <p className="mt-1 text-sm text-cj-charcoal">Available {companyContact.supportHours}</p>
              </div>
            </li>
            <li className="flex items-center gap-4 py-5">
              <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-cj-cream text-cj-red"><MapPin size={21} aria-hidden="true" /></span>
              <address className="min-w-0 not-italic leading-relaxed">{companyContact.address}</address>
            </li>
          </ul>
        </section>
        <InquiryForm />
      </div>
    </div>
  );
}
