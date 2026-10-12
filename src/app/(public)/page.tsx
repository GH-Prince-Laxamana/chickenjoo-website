import type { Metadata } from "next";
import Link from "next/link";
import MenuItemCard from "@/components/catalog/MenuItemCard";
import FeatureCarousel, { type FeatureSlide } from "@/components/FeatureCarousel";
import { getPublicMenu } from "@/lib/public/catalog";
import { getFeaturedPosts } from "@/lib/public/posts";
import type { PublicMenuItem } from "@/lib/public/types";

export const metadata: Metadata = {
  title: "Home",
  description: "Explore Chicken Joo's chicken, meals, sides, and Pampanga branches on this student demonstration website.",
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  let slides: FeatureSlide[] = [
    { title: "Joo time! Find your chicken fix", href: "/menu", image: "/images/campaign-joo-time.webp", alt: "Joo time! Kwentuhan. Kainan. Chicken Joo. A sharing tray of yangnyeom boneless chicken. Find your chicken fix." },
    { title: "Pick your flavor! Explore the menu", href: "/menu", image: "/images/campaign-flavors.webp", alt: "Pick your flavor! Korean boneless chicken: Original, Yangnyeom, and Yangnyeom with Garlic. Explore the menu." },
    { title: "Sarap i-share! Chicken Joo muna", href: "/menu", image: "/images/campaign-sharing.webp", alt: "Sarap i-share! Kasama ang barkada. Sharing trays of original and yangnyeom chicken. Chicken Joo muna." },
  ];
  try {
    const posts = await getFeaturedPosts();
    if (posts.length) slides = posts.map((post) => ({ title: post.title, href: `/news/${post.slug}`, image: post.coverImage!, alt: post.excerpt, square: true }));
  } catch { /* Campaigns still lead to the menu if stories are unavailable. */ }
  let items: PublicMenuItem[] = [];
  let menuUnavailable = false;
  try {
    items = (await getPublicMenu({ q: "", filter: "", page: 1, limit: 3 }, true)).data;
  } catch {
    menuUnavailable = true;
  }

  return (
    <div className="bg-white">
      <FeatureCarousel slides={slides} />
      <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        <div className="flex flex-col gap-6 border-t border-cj-navy/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">Make it a Joo kind of day.</h2><p className="mt-3 max-w-lg leading-relaxed">Chicken meals for your lunch break. Sharing boxes for the whole barkada. Find your pick on the menu.</p></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/menu" className="cj-button bg-cj-red text-white hover:bg-cj-red/90">Explore the menu</Link>
            <Link href="/branches" className="inline-flex min-h-11 items-center rounded-full border border-cj-navy/20 px-5 py-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream">Find a branch</Link>
          </div>
        </div>
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="menu-preview-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="menu-preview-heading" className="font-display text-3xl font-bold tracking-tight text-cj-navy">What are you craving?</h2>
          <Link href="/menu" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">See the full menu</Link>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-cj-charcoal/85">Demo pickup ordering. No payment or food preparation takes place. Availability is for the demonstration.</p>
        {items.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <MenuItemCard key={item.id} item={item} />)}</div> : (
          <p className="rounded-2xl border border-cj-navy/15 bg-white p-6 text-base leading-relaxed">{menuUnavailable ? "The menu preview is temporarily unavailable. Visit the Menu page to try again." : "Menu details are on the way. Please check back soon."}</p>
        )}
      </section>
      <section className="bg-cj-cream px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-2xl font-bold text-cj-navy">A little more Chicken Joo</h2><p className="mt-2 leading-relaxed">Catch up on the stories and moments we share.</p></div><Link href="/news" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline underline-offset-4">Read our updates</Link></div>
      </section>
    </div>
  );
}
