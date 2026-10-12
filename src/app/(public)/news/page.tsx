import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ArrowLeft } from "lucide-react";
import ContentImage from "@/components/ContentImage";
import PostDate from "@/components/PostDate";
import { getPublicPosts } from "@/lib/public/posts";

export const metadata: Metadata = { title: "News", description: "Find your next Chicken Joo craving: flavor spotlights, lunch-break inspiration, and stories from our ka-Joo community." };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string; type?: string }> }) {
  const { page: rawPage, type: rawType } = await searchParams;
  const page = typeof rawPage === "string" && /^[1-9]\d{0,2}$/.test(rawPage) ? Number(rawPage) : 1;
  const type = rawType === "article" || rawType === "promotion" ? rawType : undefined;
  const pageHref = (number: number) => `/news?page=${number}${type ? `&type=${type}` : ""}`;
  let result;
  try { result = await getPublicPosts(page, type); } catch { /* Keep database errors private and let readers retry. */ }
  const featured = page === 1 ? result?.data.find((post) => post.isFeatured && post.coverImage && post.type === "promotion") : undefined;
  const updates = result?.data.filter((post) => post.slug !== featured?.slug) ?? [];

  return <div className="mx-auto max-w-6xl px-4 pb-16 pt-9 sm:px-8 sm:py-16">
    <header className="max-w-2xl">
      <p className="cj-eyebrow">CHICKEN JOO · BLOG</p>
      <h1 className="mt-3 font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-cj-navy sm:text-6xl">Good food.<br /><span className="text-cj-red">More Joo moments.</span></h1>
      <p className="mt-5 max-w-lg leading-relaxed">Your next flavor crush, a well-earned lunch break, and the little moments worth sharing. Catch up with Chicken Joo.</p>
    </header>
    <nav aria-label="Filter updates" className="my-8 flex flex-wrap gap-2">
      {[[undefined, "All updates"], ["promotion", "Flavor spotlights"], ["article", "Joo moments"]].map(([value, label]) => <Link key={label} href={value ? `/news?type=${value}` : "/news"} aria-current={type === value ? "page" : undefined} className={`inline-flex min-h-11 items-center rounded-full px-5 text-sm font-semibold transition-colors ${type === value ? "bg-cj-yellow text-cj-navy" : "bg-white text-cj-charcoal ring-1 ring-cj-navy/10 hover:bg-cj-yellow/20"}`}>{label}</Link>)}
    </nav>
    {!result ? <div role="alert" className="cj-surface p-6"><p>Updates are temporarily unavailable. Please try again shortly.</p><Link href={pageHref(page)} className="mt-3 inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Try again</Link></div>
      : !result.data.length ? <div className="cj-surface p-6"><p>{page > 1 ? "No updates on this page." : "More Joo moments are on the way. Check back soon."}</p>{page > 1 && <Link href={pageHref(1)} className="mt-3 inline-flex min-h-11 items-center font-semibold text-cj-red underline">Back to the latest updates</Link>}</div>
      : <>
        {featured && <article className="mb-12 grid overflow-hidden rounded-3xl bg-cj-navy shadow-xl shadow-cj-navy/10 md:grid-cols-2">
          <Link href={`/news/${featured.slug}`} className="block bg-white" aria-label={`Read: ${featured.title}`}><ContentImage src={featured.coverImage} label={featured.title} poster /></Link>
          <div className="flex flex-col justify-center p-6 text-white sm:p-9">
            <p className="text-xs font-bold tracking-widest text-cj-yellow">IN THE FLAVOR SPOTLIGHT</p>
            <h2 className="mt-4 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl"><Link href={`/news/${featured.slug}`} className="hover:underline">{featured.title}</Link></h2>
            <p className="mt-4 leading-relaxed text-white/80">{featured.excerpt}</p>
            <Link href={`/news/${featured.slug}`} className="cj-button mt-6 self-start">Meet the flavors <ArrowRight size={18} aria-hidden="true" /></Link>
          </div>
        </article>}
        <div className="mb-5 flex items-baseline justify-between gap-4"><h2 className="text-2xl font-bold tracking-tight text-cj-navy">{type === "promotion" ? "Flavor stories" : type === "article" ? "A little Joo time" : "Fresh from Chicken Joo"}</h2><span className="text-xs font-semibold text-cj-red">MADE TO SHARE</span></div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{updates.map((post) => <article key={post.slug} className="cj-surface flex min-w-0 flex-col overflow-hidden">
          {post.coverImage && <Link href={`/news/${post.slug}`} className="block" aria-label={`Read: ${post.title}`}><ContentImage src={post.coverImage} label={post.title} poster /></Link>}
          <div className="flex flex-1 flex-col p-5 sm:p-6">
            <p className="text-xs font-semibold text-cj-red">{post.type === "promotion" ? "Flavor spotlight" : "Joo moments"}<span className="mx-2 text-cj-navy/30">/</span><span className="font-normal text-cj-charcoal"><PostDate value={post.publishedDate} /></span></p>
            <h3 className="mt-3 text-xl font-bold leading-tight tracking-tight text-cj-navy"><Link href={`/news/${post.slug}`} className="hover:text-cj-red">{post.title}</Link></h3>
            <p className="mb-4 mt-3 text-sm leading-relaxed">{post.excerpt}</p>
            <Link href={`/news/${post.slug}`} className="mt-auto inline-flex min-h-11 items-center gap-2 self-start text-sm font-bold text-cj-red" aria-label={`Read story: ${post.title}`}>Read the story <ArrowRight size={17} aria-hidden="true" /></Link>
          </div>
        </article>)}</div>
      </>}
    {result && (page > 1 || page < result.totalPages) && <nav aria-label="Updates pages" className="mt-8 flex flex-wrap items-center justify-center gap-5">{page > 1 && <Link href={pageHref(page - 1)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cj-navy"><ArrowLeft size={18} aria-hidden="true" /> Previous</Link>}<span className="text-sm">Page {page}</span>{page < result.totalPages && <Link href={pageHref(page + 1)} className="inline-flex min-h-11 items-center gap-2 font-semibold text-cj-navy">Next <ArrowRight size={18} aria-hidden="true" /></Link>}</nav>}
    <aside className="mt-12 flex flex-col items-start justify-between gap-5 rounded-3xl bg-cj-yellow p-6 sm:flex-row sm:items-center sm:p-8"><div><h2 className="text-2xl font-extrabold tracking-tight text-cj-navy">Reading works up an appetite.</h2><p className="mt-2 text-sm text-cj-navy">Make your next break a Chicken Joo break.</p></div><Link href="/menu" className="inline-flex min-h-11 shrink-0 items-center gap-2 rounded-full bg-cj-red px-6 py-3 text-sm font-bold text-white hover:bg-cj-red/90">Find your next meal <ArrowRight size={18} aria-hidden="true" /></Link></aside>
  </div>;
}
