import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Bike, ShoppingBag, Store } from "lucide-react";
import ContentImage from "@/components/ContentImage";
import { menuArtwork } from "@/lib/public/menu-artwork";

export const metadata: Metadata = {
  title: "About Us",
  description: "Discover why Chicken Joo fits your day: convenient Pampanga branches, generous boneless chicken servings, affordable meals, and flexible ways to order.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
      <header className="max-w-3xl">
        <p className="text-sm font-semibold text-cj-red">About us</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-6xl">A chicken break that fits your day.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-cj-charcoal">Chicken Joo brings Korean-style boneless chicken to your everyday routine. Convenient branches, generous servings, and affordable meals give you a reason to step away from the busy hours.</p>
      </header>

      <section aria-labelledby="break-heading" className="mt-9 grid overflow-hidden rounded-3xl bg-cj-navy shadow-xl shadow-cj-navy/10 md:grid-cols-2 sm:mt-12">
        <figure className="flex min-w-0 flex-col bg-white">
          <div className="relative aspect-[3/2] flex-1 md:aspect-auto md:min-h-96">
            <Image src="/images/about-workday-break.webp" alt="Illustration of coworkers sharing a chicken meal during a break outside their workplace" fill sizes="(max-width: 767px) 100vw, 560px" className="object-cover" />
          </div>
          <figcaption className="p-4 text-sm leading-relaxed text-cj-charcoal">A little time away from work. A meal with your ka-work.</figcaption>
        </figure>
        <div className="flex flex-col justify-center p-6 text-white sm:p-9 lg:p-12">
          <h2 id="break-heading" className="font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">A good break, close by.</h2>
          <p className="mt-5 leading-relaxed text-white/90">After back-to-back tasks, make room for a chicken break. With branches around Pampanga, your next meal can fit into lunch near campus or a catch-up after work.</p>
          <p className="mt-4 text-sm leading-relaxed text-white/80">Bring your ka-work, choose a box to share, and let the kwentuhan take over for a while. Find a branch that works for your day.</p>
          <Link href="/branches" className="cj-button mt-7 self-start">Find your Chicken Joo <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-labelledby="value-heading" className="mt-12 grid items-center gap-6 border-t border-cj-navy/10 pt-8 sm:mt-16 sm:gap-10 sm:pt-10 md:grid-cols-[1fr_2fr]">
        <div className="mx-auto w-full max-w-sm">
          <ContentImage src={menuArtwork["14-Piece Chicken, Two Flavors"]} label="Generous Chicken Joo sharing box with two boneless chicken flavors" poster />
        </div>
        <div className="max-w-xl">
          <h2 id="value-heading" className="font-display text-2xl font-bold tracking-tight text-cj-navy sm:text-3xl">Big on servings, easy on your budget.</h2>
          <p className="mt-4 leading-relaxed text-cj-charcoal">Enjoy quality boneless chicken in portions for a solo lunch or the whole barkada. Our affordable menu makes it easy to choose a filling meal without stretching your everyday food budget.</p>
          <p className="mt-3 text-sm leading-relaxed text-cj-charcoal">Choose your flavor, compare portions, and check current prices on the menu. Rice and Joomami Fries can be added separately to sharing boxes.</p>
          <Link href="/menu" className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-bold text-cj-red hover:underline">Find your meal <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </section>

      <section aria-labelledby="order-heading" className="mt-12 sm:mt-16">
        <h2 id="order-heading" className="font-display text-2xl font-bold tracking-tight text-cj-navy sm:text-3xl">Get your Chicken Joo your way.</h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-cj-charcoal">Drop by during your break, arrange a pickup, or check delivery options for a meal at home.</p>
        <div className="mt-7 grid gap-7 sm:grid-cols-3">
          <div className="border-t border-cj-navy/15 pt-5"><Store size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Drop by a branch</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Order in person and make your chicken break part of the day. Check the branch’s hours before visiting.</p></div>
          <div className="border-t border-cj-navy/15 pt-5"><ShoppingBag size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Pick it up</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Taking lunch back to work? Contact your chosen branch to arrange pickup and keep your meal plans moving.</p></div>
          <div className="border-t border-cj-navy/15 pt-5"><Bike size={26} className="text-cj-red" aria-hidden="true" /><h3 className="mt-3 text-lg font-bold text-cj-navy">Order online</h3><p className="mt-2 text-sm leading-relaxed text-cj-charcoal">Check GrabFood or foodpanda for Chicken Joo at your address. Available menus and delivery areas depend on the branch.</p></div>
        </div>
      </section>

      <aside aria-labelledby="visit-heading" className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-cj-yellow p-6 sm:mt-16 sm:flex-row sm:items-center sm:p-8">
        <div className="max-w-xl">
          <h2 id="visit-heading" className="text-2xl font-extrabold tracking-tight text-cj-navy">Make your next stop Chicken Joo.</h2>
          <p className="mt-2 text-sm leading-relaxed text-cj-navy">Find a Pampanga branch and check its hours and directions before heading over.</p>
        </div>
        <Link href="/branches" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-navy px-6 py-3 text-sm font-bold text-white hover:bg-cj-navy/90">Find a branch <ArrowRight size={18} aria-hidden="true" /></Link>
      </aside>
    </div>
  );
}
