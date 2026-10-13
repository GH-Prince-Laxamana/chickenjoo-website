import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ContentImage from "@/components/ContentImage";
import FeaturedVideo from "@/components/FeaturedVideo";
import MenuItemCard from "@/components/catalog/MenuItemCard";
import FeatureCarousel, {
  type FeatureSlide,
} from "@/components/FeatureCarousel";
import { getPublicMenu } from "@/lib/public/catalog";
import { getFeaturedPosts, type PublicPost } from "@/lib/public/posts";
import {
  isLaunchCampaignActive,
  launchCampaign,
} from "@/lib/orders/launch-campaign";
import type { PublicMenuItem } from "@/lib/public/types";
import HeroSlideshow from "@/components/HeroSlideshow";

export const metadata: Metadata = {
  title: "Home",
  description:
    "Discover Chicken Joo campaigns, offers, and news. Explore Korean-style boneless chicken meals, sharing boxes, and branches for your next chicken break.",
};
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function Home() {
  let featured: PublicPost | undefined;
  let slides: FeatureSlide[] = [
    {
      title: "Joo time! Find your chicken fix",
      href: "/menu",
      image: "/images/campaigns/campaign-joo-time.webp",
      alt: "Joo time! Kwentuhan. Kainan. Chicken Joo. A sharing tray of yangnyeom boneless chicken. Find your chicken fix.",
    },
    {
      title: "Pick your flavor! Find your meal",
      href: "/menu",
      image: "/images/campaigns/campaign-flavors.webp",
      alt: "Pick your flavor! Korean boneless chicken: Original, Yangnyeom, and Yangnyeom with Garlic. Find your meal.",
    },
    {
      title: "Sarap i-share! Chicken Joo muna",
      href: "/menu",
      image: "/images/campaigns/campaign-sharing.webp",
      alt: "Sarap i-share! Kasama ang barkada. Sharing trays of original and yangnyeom chicken. Chicken Joo muna.",
    },
  ];
  try {
    const posts = await getFeaturedPosts();
    if (posts.length)
      slides = posts.map((post) => ({
        title: post.title,
        href: `/news/${post.slug}`,
        image: post.coverImage!,
        alt: post.excerpt,
      }));
    const promotions = posts.filter(
      (post) => post.type === "promotion" && post.coverImage,
    );
    featured =
      (isLaunchCampaignActive()
        ? promotions.find((post) => post.slug === launchCampaign.slug)
        : undefined) ??
      promotions.find((post) => post.slug !== launchCampaign.slug);
  } catch {
    /* Campaigns still lead to the menu if stories are unavailable. */
  }
  let items: PublicMenuItem[] = [];
  let menuUnavailable = false;
  try {
    items = (
      await getPublicMenu({ q: "", filter: "", page: 1, limit: 3 }, true)
    ).data;
  } catch {
    menuUnavailable = true;
  }

  return (
    <div className="bg-white">
      <header className="home-hero">
        <div className="home-hero-inner">
          <div className="home-hero-copy">
            <h1>Make time for a chicken break.</h1>
            <p className="mt-6 max-w-lg text-base leading-relaxed text-white sm:text-lg">
              Korean-style boneless chicken for your lunch break and barkada
              catch-ups. Discover the latest offers and Joo moments, then find
              something to crave.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <Link href="/menu" className="cj-button bg-cj-red px-8 text-base text-white hover:bg-cj-red/90">
                Find your meal <ArrowRight size={20} aria-hidden="true" />
              </Link>
              <Link
                href="/news"
                className="inline-flex min-h-12 items-center rounded-full border border-white/60 px-6 py-3 font-semibold text-white transition-colors hover:bg-white hover:text-cj-red"
              >
                See what’s new
              </Link>
            </div>
          </div>
          <Link
            href="/menu"
            className="home-hero-art"
            aria-label="Explore Chicken Joo chicken boxes and flavors"
          >
            <span className="home-hero-stamp" aria-hidden="true">
              Joo
              <br />
              time!
            </span>
            <HeroSlideshow
              images={[
                {
                  src: "/images/hero/hero-image.png",
                  alt: "Chicken Joo boneless fried chicken box",
                },
              ]}
            />
            <span className="home-hero-caption">
              Find your flavor <ArrowRight size={20} aria-hidden="true" />
            </span>
          </Link>
        </div>
      </header>
      <section className="pt-12 sm:pt-16" aria-label="The latest Joo moments">
        <div className="mx-auto mb-4 max-w-7xl px-4 sm:mb-6 sm:px-8">
          <h2 className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl">
            <Link href="/news" className="inline-flex items-center gap-3 hover:text-cj-red">
              The latest Joo moments. <ArrowRight size={28} aria-hidden="true" />
            </Link>
          </h2>
        </div>
        <FeatureCarousel slides={slides} />
      </section>
      <section
        className="pt-12 text-cj-navy sm:pt-16"
        aria-labelledby="video-heading"
      >
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-8">
          <div className="max-w-3xl">
            <h2
              id="video-heading"
              className="font-display text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Take a little Joo time.
            </h2>
            <p className="mt-4 leading-relaxed">
              Watch our featured video, then explore the meals and flavors for
              your next Chicken Joo break.
            </p>
          </div>
          <div className="mt-8 sm:mt-10"><FeaturedVideo /></div>
        </div>
      </section>
      <section
        className="mx-auto max-w-7xl px-4 pt-12 sm:px-8 sm:pt-16"
        aria-labelledby="home-news-heading"
      >
        <div className="mb-6">
          <h2
            id="home-news-heading"
            className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl"
          >
            <Link href="/news" className="inline-flex items-center gap-3 hover:text-cj-red">
              A reason to make it Chicken Joo <ArrowRight size={28} aria-hidden="true" />
            </Link>
          </h2>
        </div>
        {featured ? (
          <article className="grid overflow-hidden rounded-3xl bg-cj-navy shadow-xl shadow-cj-navy/10 md:grid-cols-2">
            <Link
              href={`/news/${featured.slug}`}
              className="block bg-white"
              aria-label={`Read: ${featured.title}`}
            >
              <ContentImage
                src={featured.coverImage}
                label={featured.title}
                poster
                landscape
              />
            </Link>
            <div className="flex flex-col justify-center p-6 text-white sm:p-9">
              <p className="text-sm font-semibold text-white">
                In the spotlight
              </p>
              <h3 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                <Link
                  href={`/news/${featured.slug}`}
                  className="hover:underline"
                >
                  {featured.title}
                </Link>
              </h3>
              <p className="mt-4 leading-relaxed text-white/80">
                {featured.excerpt}
              </p>
              <Link
                href={`/news/${featured.slug}`}
                className="cj-button bg-cj-red text-white mt-6 self-start"
              >
                Explore the campaign <ArrowRight size={18} aria-hidden="true" />
              </Link>
            </div>
          </article>
        ) : (
          <div className="rounded-2xl bg-cj-cream p-6 sm:p-9">
            <p className="max-w-xl leading-relaxed">
              Explore Chicken Joo campaigns, offers, and stories from our
              ka-Joos.
            </p>
            <Link href="/news" className="cj-button mt-5">
              Explore the news <ArrowRight size={18} aria-hidden="true" />
            </Link>
          </div>
        )}
      </section>
      <section
        className="mx-auto w-full max-w-7xl px-4 pb-16 pt-12 sm:px-8 sm:pb-20 sm:pt-16"
        aria-labelledby="menu-preview-heading"
      >
        <div className="mb-6">
          <h2
            id="menu-preview-heading"
            className="font-display text-3xl font-bold tracking-tight text-cj-navy sm:text-4xl"
          >
            <Link href="/menu" className="inline-flex items-center gap-3 hover:text-cj-red">
              Menu picks for your next break <ArrowRight size={28} aria-hidden="true" />
            </Link>
          </h2>
        </div>
        <p className="mb-6 text-sm leading-relaxed text-cj-charcoal/85">
          Choose your portion, pick your flavor, and add your favorites to the
          cart.
        </p>
        {items.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <MenuItemCard key={item.id} item={item} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-cj-navy/15 bg-white p-6 text-base leading-relaxed">
            {menuUnavailable
              ? "The menu preview is temporarily unavailable. Visit the Menu page to try again."
              : "We’re updating the menu. Check back soon for meals and prices."}
          </p>
        )}
      </section>
    </div>
  );
}
