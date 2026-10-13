import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bike, ShoppingBag, Store, } from "lucide-react";
// import { BadgeCheck, MapPin, UtensilsCrossed } from "lucide-react";
// import ContentImage from "@/components/ContentImage";
// import { menuArtwork } from "@/lib/public/menu-artwork";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover why Chicken Joo fits your day: convenient Pampanga branches, generous boneless chicken servings, affordable meals, and flexible ways to order.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-9 sm:px-8 sm:pt-12">
      <header className="">
        <p className="text-sm font-semibold text-cj-red">About us</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-6xl">A <span className="text-cj-red">chicken break</span> that fits your day.</h1>
        <p className="mt-5 text-lg leading-relaxed text-cj-charcoal">Chicken Joo brings Korean-style boneless chicken to your everyday routine. Convenient branches, generous servings, and affordable meals give you a reason to step away from the busy hours.</p>
      </header>

      <section aria-labelledby="break-heading" className="mt-9 grid rounded-2xl overflow-hidden bg-cj-navy shadow-xl shadow-cj-navy/10 md:grid-cols-2 sm:mt-12">
        <figure className="flex min-w-0 flex-col bg-white">
          <div className="relative aspect-[3/2] flex-1 md:aspect-auto md:min-h-96">
            <Image src="/images/lifestyle/about-friends-chicken-joo.png" alt="Four friends sharing Chicken Joo chicken and rice around a table" fill sizes="(max-width: 767px) 100vw, 560px" className="object-cover object-center" />
          </div>
        </figure>
        <div className="flex flex-col justify-center p-6 text-white sm:p-9 lg:p-12">
          <h2 id="break-heading" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">A good break, close by.</h2>
          <p className="mt-5 leading-relaxed text-white/90">After back-to-back tasks, make room for a chicken break. With branches around Pampanga, your next meal can fit into lunch near campus or a catch-up after work.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">Bring your friends or ka-work, choose a box to share, and let the kwentuhan take over for a while. Find a branch that works for your day.</p>
          <Link href="/branches" className="cj-button bg-cj-red text-white mt-7 self-start">Find your Chicken Joo <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      {/* <section aria-labelledby="why-heading" className="mt-12 sm:mt-16">
        <div className="max-w-2xl">
          <h2 id="why-heading" className="mt-2 font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">Why Choose Chicken Joo?</h2>
          <p className="mt-3 leading-relaxed text-cj-charcoal">Great flavors, satisfying servings, and convenient ways to enjoy your favorite chicken.</p>
        </div>
        <div className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { icon: UtensilsCrossed, title: "Delicious Korean-Style Flavors", description: "Enjoy Korean-style boneless chicken with bold, flavorful options made for every craving." },
            { icon: BadgeCheck, title: "Generous Servings, Great Value", description: "Enjoy satisfying portions and affordable meal choices that are perfect for solo breaks or sharing with your barkada." },
            { icon: MapPin, title: "Convenient Chicken Breaks", description: "Whether you're dropping by a branch, arranging pickup, or exploring available delivery options, Chicken Joo fits your routine." },
          ].map(({ icon: Icon, title, description }) => <article key={title} className="h-full rounded-2xl border border-cj-navy/10 bg-white p-6 shadow-sm sm:p-7">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl text-cj-red"><Icon size={24} strokeWidth={2} aria-hidden="true" /></span>
            <h3 className="mt-6 text-xl font-bold leading-snug text-cj-navy">{title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-cj-charcoal">{description}</p>
          </article>)}
        </div>
      </section> */}



      <section aria-labelledby="order-heading" className="mt-12 sm:mt-16">
        <h2 id="order-heading" className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">Get your Chicken Joo your way.</h2>
        <p className="mt-3 leading-relaxed text-cj-charcoal">Drop by during your break, arrange a pickup, or check delivery options for a meal at home.</p>
        <div className="mt-7 grid gap-7 sm:grid-cols-3">
          <div className="border-t border-cj-navy/15 pt-5"><Store size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Drop by a branch</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Order in person and make your chicken break part of the day. Check the branch’s hours before visiting.</p></div>
          <div className="border-t border-cj-navy/15 pt-5"><ShoppingBag size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Pick it up</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Taking lunch back to work? Contact your chosen branch to arrange pickup and keep your meal plans moving.</p></div>
          <div className="border-t border-cj-navy/15 pt-5"><Bike size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Order online</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Check GrabFood or foodpanda for Chicken Joo at your address. Available menus and delivery areas depend on the branch.</p></div>
        </div>
      </section>
    </div>
  );
}
