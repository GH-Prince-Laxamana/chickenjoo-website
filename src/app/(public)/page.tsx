import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ContentImage from "@/components/ContentImage";
import MenuItemCard from "@/components/catalog/MenuItemCard";
import FeatureCarousel, { type FeatureSlide } from "@/components/FeatureCarousel";
import { getPublicMenu } from "@/lib/public/catalog";
import { getFeaturedPosts, type PublicPost } from "@/lib/public/posts";
import { isLaunchCampaignActive, launchCampaign } from "@/lib/orders/launch-campaign";
import type { PublicMenuItem } from "@/lib/public/types";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover Chicken Joo campaigns, offers, and news. Explore Korean-style boneless chicken meals, sharing boxes, and branches for your next chicken break.",
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  const videoUrl = "https://www.facebook.com/reel/1619386856563849/";
  let featured: PublicPost | undefined;
  let slides: FeatureSlide[] = [
    { title: "Joo time! Find your chicken fix", href: "/menu", image: "/images/campaign-joo-time.webp", alt: "Joo time! Kwentuhan. Kainan. Chicken Joo. A sharing tray of yangnyeom boneless chicken. Find your chicken fix." },
    { title: "Pick your flavor! Find your meal", href: "/menu", image: "/images/campaign-flavors.webp", alt: "Pick your flavor! Korean boneless chicken: Original, Yangnyeom, and Yangnyeom with Garlic. Find your meal." },
    { title: "Sarap i-share! Chicken Joo muna", href: "/menu", image: "/images/campaign-sharing.webp", alt: "Sarap i-share! Kasama ang barkada. Sharing trays of original and yangnyeom chicken. Chicken Joo muna." },
  ];
  try {
    const posts = await getFeaturedPosts();
    if (posts.length) slides = posts.map((post) => ({ title: post.title, href: `/news/${post.slug}`, image: post.coverImage!, alt: post.excerpt, square: true }));
    const promotions = posts.filter((post) => post.type === "promotion" && post.coverImage);
    featured = (isLaunchCampaignActive() ? promotions.find((post) => post.slug === launchCampaign.slug) : undefined)
      ?? promotions.find((post) => post.slug !== launchCampaign.slug);
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
      <header className="mx-auto max-w-3xl px-5 pb-2 pt-9 text-center sm:px-8 sm:pt-14">
        <p className="text-sm font-semibold text-cj-red">Chicken Joo</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.08] tracking-tight text-cj-navy sm:text-6xl">Make time for a chicken break.</h1>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cj-charcoal">Korean-style boneless chicken for your lunch break and barkada catch-ups. Discover the latest offers and Joo moments, then find something to crave.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link href="/news" className="cj-button bg-cj-red text-white hover:bg-cj-red/90">See what’s new</Link>
          <Link href="/menu" className="inline-flex min-h-11 items-center rounded-full border border-cj-navy/20 px-5 py-3 text-sm font-semibold text-cj-navy hover:bg-cj-cream">View menu</Link>
        </div>
      </header>
      <FeatureCarousel slides={slides} />
      <section className="mx-auto w-full max-w-6xl px-5 pb-12 pt-10 sm:px-8 sm:pb-16 sm:pt-14">
        <div className="flex flex-col gap-6 border-t border-cj-navy/10 pt-8 sm:flex-row sm:items-center sm:justify-between">
          <div><h2 className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">Good food for your everyday break.</h2><p className="mt-3 max-w-xl leading-relaxed">Chicken Joo serves Korean-style boneless chicken, solo meals, and sharing boxes. We make room for a satisfying lunch between busy hours and a generous box to share after the day is done.</p></div>
          <div className="flex flex-wrap gap-3">
            <Link href="/about-us" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline underline-offset-4">Get to know Chicken Joo</Link>
          </div>
        </div>
      </section>
      <section className="bg-cj-cream px-5 py-10 sm:px-8 sm:py-14" aria-labelledby="video-heading">
        <div className="mx-auto grid max-w-6xl items-center gap-8 md:grid-cols-2">
          <div className="max-w-lg">
            <h2 id="video-heading" className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">Take a little Joo time.</h2>
            <p className="mt-4 leading-relaxed">Watch our featured video, then explore the meals and flavors for your next Chicken Joo break.</p>
            <Link href="/menu" className="cj-button mt-6 bg-cj-red text-white hover:bg-cj-red/90">Find your meal <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
          <div className="w-full max-w-[360px] justify-self-center">
            <iframe
              src={`https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(videoUrl)}&show_text=false&width=360&height=640&autoplay=false`}
              title="Chicken Joo promotional video on Facebook"
              width="360"
              height="640"
              loading="lazy"
              allow="encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="aspect-[9/16] h-auto w-full rounded-2xl border-0 bg-white"
            />
            <p className="mt-3 text-sm leading-relaxed text-cj-charcoal">Player unavailable? <a href={videoUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline underline-offset-4">Open the video on Facebook</a></p>
          </div>
        </div>
      </section>
      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8 sm:py-16" aria-labelledby="home-news-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="home-news-heading" className="font-display text-3xl font-bold tracking-tight text-cj-navy">A reason to make it Chicken Joo</h2>
          <Link href="/news" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">See all news</Link>
        </div>
        {featured ? <article className="grid overflow-hidden rounded-3xl bg-cj-navy shadow-xl shadow-cj-navy/10 md:grid-cols-2">
          <Link href={`/news/${featured.slug}`} className="block bg-white" aria-label={`Read: ${featured.title}`}><ContentImage src={featured.coverImage} label={featured.title} poster /></Link>
          <div className="flex flex-col justify-center p-6 text-white sm:p-9">
            <p className="text-sm font-semibold text-cj-yellow">In the spotlight</p>
            <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><Link href={`/news/${featured.slug}`} className="hover:underline">{featured.title}</Link></h3>
            <p className="mt-4 leading-relaxed text-white/80">{featured.excerpt}</p>
            <Link href={`/news/${featured.slug}`} className="cj-button mt-6 self-start">Explore the campaign <ArrowRight size={18} aria-hidden="true" /></Link>
            <a href="https://www.facebook.com/profile.php?id=61574092604052" target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex min-h-11 items-center self-start text-sm font-semibold text-white underline underline-offset-4">Follow Chicken Joo on Facebook</a>
          </div>
        </article> : <div className="rounded-2xl bg-cj-cream p-6 sm:p-9"><p className="max-w-xl leading-relaxed">Explore Chicken Joo campaigns, offers, and stories from our ka-Joos.</p><Link href="/news" className="cj-button mt-5">Explore the news <ArrowRight size={18} aria-hidden="true" /></Link></div>}
      </section>
      <section className="mx-auto w-full max-w-6xl px-4 pb-16 sm:px-8 sm:pb-24" aria-labelledby="menu-preview-heading">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <h2 id="menu-preview-heading" className="font-display text-3xl font-bold tracking-tight text-cj-navy">Menu picks for your next break</h2>
          <Link href="/menu" className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4">See the full menu</Link>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-cj-charcoal/85">Choose your portion, pick your flavor, and add your favorites to the cart.</p>
        {items.length ? <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{items.map((item) => <MenuItemCard key={item.id} item={item} />)}</div> : (
          <p className="rounded-2xl border border-cj-navy/15 bg-white p-6 text-base leading-relaxed">{menuUnavailable ? "The menu preview is temporarily unavailable. Visit the Menu page to try again." : "We’re updating the menu. Check back soon for meals and prices."}</p>
        )}
      </section>
      <section className="bg-cj-cream px-5 py-10 sm:px-8 sm:py-14">
        <div className="mx-auto flex max-w-6xl flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"><div><h2 className="font-display text-2xl font-bold text-cj-navy">Make your next break a Chicken Joo visit.</h2><p className="mt-2 max-w-xl leading-relaxed">Find a branch, check its hours, and get directions. Your chicken break is one step closer.</p></div><Link href="/branches" className="cj-button shrink-0">Find a branch <ArrowRight size={18} aria-hidden="true" /></Link></div>
      </section>
    </div>
  );
}
