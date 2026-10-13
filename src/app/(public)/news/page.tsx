import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ContentImage from "@/components/ContentImage";
import PostDate from "@/components/PostDate";
import { getFeaturedPosts, getPublicPosts, type PublicPost } from "@/lib/public/posts";
import { isLaunchCampaignActive, launchCampaign } from "@/lib/orders/launch-campaign";

export const metadata: Metadata = { title: "News", description: "Catch up on Chicken Joo campaigns, offers, flavor stories, and news from our ka-Joos." };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function NewsPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
  const { page: rawPage, type: rawType } = await searchParams;
  const page = typeof rawPage === "string" && /^[1-9]\d{0,2}$/.test(rawPage) ? Number(rawPage) : 1;
  const type = rawType === "article" || rawType === "promotion" ? rawType : undefined;
  const pageHref = (number: number) => `/news?page=${number}${type ? `&type=${type}` : ""}`;
  let featured: PublicPost | undefined;
  try {
    const featuredPosts = type === "article" ? [] : (await getFeaturedPosts()).filter((post) => post.type === "promotion");
    featured = (isLaunchCampaignActive() ? featuredPosts.find((post) => post.slug === launchCampaign.slug) : undefined)
      ?? featuredPosts.find((post) => post.slug !== launchCampaign.slug);
  } catch { /* The post grid can still load when the spotlight is unavailable. */ }
  let result;
  try { result = await getPublicPosts(page, type, featured?.slug); } catch { /* Keep database errors private and let readers retry. */ }
  const updates = result?.data ?? [];

  return <>
    {result && page === 1 && featured && <section className="mx-auto w-full max-w-7xl px-4 sm:px-8">
      <article className="grid lg:grid-cols-[minmax(0,440px)_minmax(0,1fr)]">
        <Link href={`/news/${featured.slug}`} className="block" aria-label={`Read: ${featured.title}`}><ContentImage src={featured.coverImage} label={featured.title} banner /></Link>
        <div className="flex flex-col justify-center bg-cj-navy px-6 py-8 text-cj-navy sm:px-8 md:px-10 lg:px-14">
          <p className="text-xs font-bold tracking-wide text-white">CAMPAIGN SPOTLIGHT</p>
          <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><Link href={`/news/${featured.slug}`} className="text-white">{featured.title}</Link></h2>
          <p className="mt-4 leading-relaxed text-white">{featured.excerpt}</p>
          <Link href={`/news/${featured.slug}`} className="mt-6 inline-flex min-h-11 items-center gap-2 self-start rounded-full bg-cj-red px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-cj-red/90">Explore the campaign <ArrowRight size={18} aria-hidden="true" /></Link>
        </div>
      </article>
    </section>}
    <div className="mx-auto w-full max-w-7xl px-4 pb-16 pt-9 sm:px-8 sm:pt-12">
    <header>
      <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-cj-navy sm:text-5xl lg:whitespace-nowrap lg:text-6xl">Catch up with Chicken Joo</h1>
      <p className="mt-4 leading-relaxed lg:whitespace-nowrap">Campaigns, flavors, and Joo moments for your next chicken break.</p>
    </header>
    <nav aria-label="Filter updates" className="my-8 flex flex-wrap gap-2">
      {[[undefined, "All updates"], ["promotion", "Campaigns & offers"], ["article", "Joo moments"]].map(([value, label]) => <Link key={label} href={value ? `/news?type=${value}` : "/news"} aria-current={type === value ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors ${type === value ? "bg-cj-navy text-white hover:bg-cj-navy/90" : "bg-white text-cj-charcoal ring-1 ring-cj-navy/10 hover:bg-cj-navy/5"}`}>{label}</Link>)}
    </nav>
    {!result ? <div role="alert" className="cj-surface p-6"><p>Updates are temporarily unavailable. Please try again shortly.</p><Link href={pageHref(page)} className="mt-3 inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Try again</Link></div>
      : !result.data.length ? <div className="cj-surface p-6"><p>{page > 1 ? "No updates on this page." : "More Joo moments are on the way. Check back soon."}</p>{page > 1 && <Link href={pageHref(1)} className="mt-3 inline-flex min-h-11 items-center font-semibold text-cj-red underline">Back to the latest updates</Link>}</div>
      : <>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{updates.map((post) => <article key={post.slug} className="cj-surface flex min-w-0 flex-col overflow-hidden">
          <Link href={`/news/${post.slug}`} className="block" aria-label={`Read: ${post.title}`}><ContentImage src={post.coverImage} label={post.title} card /></Link>
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="text-xs font-semibold text-cj-red">{post.type === "promotion" ? "Campaign" : "Joo moments"}<span className="mx-2 text-cj-navy/30">/</span><span className="font-normal text-cj-charcoal"><PostDate value={post.publishedDate} /></span></p>
            <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-cj-navy"><Link href={`/news/${post.slug}`} className="hover:text-cj-red">{post.title}</Link></h3>
            <p className="mb-4 mt-3 text-sm leading-relaxed">{post.excerpt}</p>
            <Link href={`/news/${post.slug}`} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-cj-red" aria-label={`Read story: ${post.title}`}>Read the story <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </article>)}</div>
      </>}
    {result && result.totalPages > 1 && <nav aria-label="Updates pages" className="mt-10 flex items-center justify-between gap-4 border-t border-cj-navy/10 pt-5 text-sm">
      {page > 1 ? <Link href={pageHref(page - 1)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cj-navy hover:text-cj-red"><ArrowLeft size={16} aria-hidden="true" /> Previous</Link> : <span className="min-w-11" />}
      <span className="text-cj-charcoal">Page {page} of {result.totalPages}</span>
      {page < result.totalPages ? <Link href={pageHref(page + 1)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cj-navy hover:text-cj-red">Next <ArrowRight size={16} aria-hidden="true" /></Link> : <span className="min-w-11" />}
    </nav>}
    <aside className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-cj-navy p-6 sm:flex-row sm:items-center sm:p-8"><div><h2 className="text-2xl font-extrabold tracking-tight text-white">Found your next chicken craving?</h2><p className="mt-2 text-sm text-white">Choose a meal for yourself or a box for the barkada.</p></div><Link href="/menu" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-red px-6 py-3 text-sm font-bold text-white hover:bg-cj-red/90">Browse the menu <ArrowRight size={18} aria-hidden="true" /></Link></aside>
    </div>
  </>;
}
