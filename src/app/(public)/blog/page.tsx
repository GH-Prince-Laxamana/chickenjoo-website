import type { Metadata } from "next";
import Link from "next/link";
import ContentImage from "@/components/ContentImage";
import PostDate from "@/components/PostDate";
import { getPublicPosts } from "@/lib/public/posts";
export const metadata: Metadata = { title: "Blog / Updates", description: "Short updates and moments to share from Chicken Joo." };
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export default async function BlogPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page: rawPage } = await searchParams;
  const page = typeof rawPage === "string" && /^[1-9]\d{0,2}$/.test(rawPage) ? Number(rawPage) : 1;
  let result;
  try { result = await getPublicPosts(page); } catch { /* Show a recoverable state without driver details. */ }
  return <div className="mx-auto max-w-6xl px-4 py-16 sm:px-8 sm:py-24">
    <h1 className="font-display text-4xl font-semibold text-cj-navy sm:text-5xl">Blog / Updates</h1><p className="mt-5 max-w-2xl text-lg leading-relaxed">A little Joo time, shared moments, and the latest updates.</p>
    {!result ? <div role="alert" className="mt-8 rounded-2xl bg-white p-6"><p>Updates are temporarily unavailable. Please try again shortly.</p><Link href={`/blog?page=${page}`} className="mt-3 inline-flex min-h-11 items-center font-semibold text-cj-navy underline">Try again</Link></div>
      : !result.data.length ? <p className="mt-8 rounded-2xl bg-white p-6">{page > 1 ? "No updates on this page." : "Updates are on the way. Please check back soon."}</p>
      : <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">{result.data.map((post) => <article key={post.slug} className="flex flex-col rounded-3xl bg-white p-6 ring-1 ring-cj-navy/10"><ContentImage src={post.coverImage} label="Update photo" /><p className="mt-5 text-sm text-cj-navy"><span className="capitalize">{post.type}</span> · <PostDate value={post.publishedDate} /></p><h2 className="mt-3 font-display text-2xl font-semibold leading-snug text-cj-navy"><Link href={`/blog/${post.slug}`} className="hover:underline">{post.title}</Link></h2><p className="mt-4 leading-relaxed">{post.excerpt}</p><Link href={`/blog/${post.slug}`} className="mt-auto inline-flex min-h-11 items-center pt-5 font-semibold text-cj-navy underline underline-offset-4" aria-label={`Read update: ${post.title}`}>Read update</Link></article>)}</div>}
    {result && (page > 1 || page < result.totalPages) && <nav aria-label="Updates pages" className="mt-8 flex flex-wrap items-center gap-5">{page > 1 && <Link href={`/blog?page=${page - 1}`} className="inline-flex min-h-11 items-center underline">Previous page</Link>}<span>Page {page}</span>{page < result.totalPages && <Link href={`/blog?page=${page + 1}`} className="inline-flex min-h-11 items-center underline">Next page</Link>}</nav>}
  </div>;
}
