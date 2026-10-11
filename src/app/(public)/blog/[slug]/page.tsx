import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { cache } from "react";
import ContentImage from "@/components/ContentImage";
import PostDate from "@/components/PostDate";
import { getPublicPost } from "@/lib/public/posts";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const readPost = cache(getPublicPost);
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = await readPost((await params).slug);
  return post ? { title: post.title, description: post.excerpt } : { title: "Update not found", robots: { index: false } };
}
export default async function ArticlePage({ params }: Props) {
  const post = await readPost((await params).slug);
  if (!post) notFound();
  return <article className="mx-auto max-w-3xl px-4 py-12 sm:px-8 sm:py-20">
    <Link href="/blog" className="inline-flex min-h-11 items-center font-semibold text-cj-navy underline underline-offset-4">Back to updates</Link><p className="mt-6 text-sm text-cj-navy"><PostDate value={post.publishedDate} /></p><h1 className="mt-4 break-words font-display text-4xl font-semibold leading-tight text-cj-navy sm:text-5xl">{post.title}</h1>
    <div className="mt-8"><ContentImage src={post.coverImage} label="Update photo" /></div><div className="mt-8 space-y-5 text-lg leading-relaxed">{post.body.map((paragraph, index) => <p className="whitespace-pre-line break-words" key={index}>{paragraph}</p>)}</div>
    {post.ctaHref && post.ctaLabel && <Link href={post.ctaHref} className="mt-8 inline-flex min-h-11 items-center rounded-xl bg-cj-navy px-6 py-3 font-semibold text-white hover:bg-cj-navy/90">{post.ctaLabel}</Link>}
    {post.sourceUrl && <a href={post.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-6 block py-3 text-cj-navy underline underline-offset-4">View original Facebook post <span className="sr-only">(opens in a new tab)</span></a>}
  </article>;
}
