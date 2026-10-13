import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { notFound } from "next/navigation";
import { cache } from "react";
import ContentImage from "@/components/ContentImage";
import PostDate from "@/components/PostDate";
import { getPublicPost } from "@/lib/public/posts";
import { isLaunchCampaignEnded, launchCampaign } from "@/lib/orders/launch-campaign";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const readPost = cache(getPublicPost);
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await readPost((await params).slug);
  return post
    ? { title: post.title, description: post.excerpt }
    : { title: "Story not found", robots: { index: false } };
}
export default async function ArticlePage({ params }: Props) {
  const post = await readPost((await params).slug);
  if (!post) notFound();
  const launchOfferEnded = post.slug === launchCampaign.slug && isLaunchCampaignEnded();
  return (
    <article className="mx-auto max-w-6xl px-4 py-8 sm:px-8 sm:py-12">
      <Link
        href="/news"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-cj-navy hover:text-cj-red"
      >
        <ArrowLeft size={18} aria-hidden="true" /> Back to news
      </Link>
      <header className="mx-auto mb-8 mt-5 max-w-3xl sm:mb-12">
        <p className="cj-eyebrow">
          {post.type === "promotion" ? "CAMPAIGN SPOTLIGHT" : "JOO MOMENTS"}
        </p>
        <h1 className="mt-3 break-words font-display text-4xl font-extrabold leading-[1.1] tracking-tight text-cj-navy sm:text-5xl">
          {post.title}
        </h1>
        <p className="mt-5 text-lg leading-relaxed">{post.excerpt}</p>
        <p className="mt-5 text-xs text-cj-charcoal">
          From Chicken Joo{" "}
          <span className="mx-2" aria-hidden="true">
            /
          </span>
          <PostDate value={post.publishedDate} />
        </p>
      </header>
      <div
        className={`grid items-start gap-8 lg:gap-12 ${post.coverImage ? "md:grid-cols-2" : "mx-auto max-w-3xl"}`}
      >
        {post.coverImage && (
          <figure className="min-w-0">
            <ContentImage src={post.coverImage} label={post.title} poster landscape={post.slug === launchCampaign.slug} />
            <figcaption className="mt-3 text-xs leading-relaxed text-cj-charcoal">
              Chicken Joo{" "}
              {post.type === "promotion"
                ? "campaign artwork"
                : "community update"}
              .{" "}
              {post.type === "promotion" &&
                "Read the campaign details for availability, dates, and applicable terms."}
            </figcaption>
            <a
              href={post.coverImage}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center text-xs font-semibold text-cj-navy underline underline-offset-4"
            >
              View full-size artwork
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </figure>
        )}
        <div>
          {launchOfferEnded && (
            <p className="mb-6 rounded-2xl bg-cj-yellow/25 p-4 font-semibold text-cj-navy">
              This website-launch offer ended on October 15, 2026. You can still
              explore our current menu.
            </p>
          )}
          <div className="space-y-6 text-base leading-[1.85] sm:text-lg">
            {post.body.map((paragraph, index) => (
              <p className="whitespace-pre-line break-words" key={index}>
                {paragraph}
              </p>
            ))}
          </div>
          {post.ctaHref && post.ctaLabel && (
            <div className="mt-8 rounded-2xl bg-white p-6 shadow-sm">
              <p className="mb-4 text-xl font-bold text-cj-navy">
                Plan your next chicken break.
              </p>
              <Link
                href={post.ctaHref}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-cj-red px-6 py-3 text-sm font-bold text-white hover:bg-cj-red/90"
              >
                {post.ctaLabel}
                <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
              </Link>
            </div>
          )}
          {post.sourceUrl && (
            <a
              href={post.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 block py-3 text-cj-navy underline underline-offset-4"
            >
              View original Facebook post{" "}
              <span className="sr-only">(opens in a new tab)</span>
            </a>
          )}
        </div>
      </div>
      <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-cj-navy/10 pt-6">
        <Link
          href="/news"
          className="inline-flex min-h-11 items-center gap-2 font-bold text-cj-red"
        >
          Read more Chicken Joo stories{" "}
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <a
          href="https://www.facebook.com/profile.php?id=61574092604052"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center text-sm font-semibold text-cj-navy underline underline-offset-4"
        >
          Follow Chicken Joo on Facebook
          <span className="sr-only"> (opens in a new tab)</span>
        </a>
      </div>
    </article>
  );
}
