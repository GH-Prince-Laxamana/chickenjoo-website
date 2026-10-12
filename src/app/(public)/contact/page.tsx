import type { Metadata } from "next";
import { ArrowRight, Mail, MessageCircle, Phone } from "lucide-react";
import InquiryForm from "@/components/InquiryForm";
export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Chicken Joo for general questions, campaign inquiries, and feedback. Reach us by email, phone, Facebook, or our inquiry form.",
};
export default function ContactPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-cj-red">Contact us</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-6xl">Let’s talk Chicken Joo.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cj-charcoal">Have a question, an idea, or feedback on your Chicken Joo experience? Get in touch using the details below or leave us a message.</p>
      </header>

      <div className="mt-9 grid items-start gap-7 sm:mt-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
        <div className="space-y-7">
          <section aria-labelledby="direct-contact-heading" className="rounded-3xl bg-cj-navy p-6 text-white sm:p-8">
            <MessageCircle size={28} className="text-cj-yellow" aria-hidden="true" />
            <h2 id="direct-contact-heading" className="mt-4 font-display text-2xl font-bold tracking-tight sm:text-3xl">We’re here to help.</h2>
            <p className="mt-4 leading-relaxed text-white/90">Ask about Chicken Joo, our campaigns, or share something you’d like us to hear.</p>
            <dl className="mt-6 space-y-4">
              <div>
                <dt className="text-sm font-semibold text-white/80">Email</dt>
                <dd><a href="mailto:jooservice@chickenjoo.com" className="inline-flex min-h-11 items-center gap-2 break-all font-semibold underline underline-offset-4"><Mail size={18} className="shrink-0" aria-hidden="true" />jooservice@chickenjoo.com</a></dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-white/80">Phone</dt>
                <dd><a href="tel:+639762002000" className="inline-flex min-h-11 items-center gap-2 font-semibold underline underline-offset-4"><Phone size={18} aria-hidden="true" />0976 200 2000</a></dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-white/80">Address</dt>
                <dd className="mt-2"><address className="not-italic leading-relaxed">Lot 5 Blk 7 Japan Street Phase 2<br />Barangay Pinagsama, Taguig City, 1636</address></dd>
              </div>
              <div>
                <dt className="text-sm font-semibold text-white/80">Support hours</dt>
                <dd className="mt-2 leading-relaxed">9 AM – 9 PM</dd>
              </div>
            </dl>
            <a href="https://www.facebook.com/profile.php?id=61574092604052" target="_blank" rel="noopener noreferrer" className="cj-button mt-6">Chicken Joo on Facebook <ArrowRight size={18} className="shrink-0" aria-hidden="true" /><span className="sr-only"> (opens in a new tab)</span></a>
          </section>

          <section aria-labelledby="general-inquiry-heading" className="px-1">
            <h2 id="general-inquiry-heading" className="mt-3 text-xl font-bold text-cj-navy">We’d like to hear from you.</h2>
            <p className="mt-3 leading-relaxed text-cj-charcoal">Tell us about your experience or ask a general question. Add a short subject so we can understand what your message is about.</p>
            <p className="mt-3 text-sm leading-relaxed text-cj-charcoal">Messages sent through the form are saved privately for the admin to review.</p>
          </section>
        </div>
        <InquiryForm />
      </div>

    </div>
  );
}
