import "server-only";
import { connectDatabase } from "@/lib/db";
import { getContentModels } from "@/lib/models/content";
import { slugPattern } from "./content-validation";
import { isLocalMenuImage } from "./assets";
import { isFacebookLink } from "./links";

export type PublicPost = {
  title: string; slug: string; excerpt: string; body: string[];
  type: "article" | "promotion";
  publishedDate: string; coverImage: string | null; sourceUrl: string | null;
  isFeatured: boolean;
  ctaLabel: string; ctaHref: "/menu" | "/branches" | null;
};
export function todayDate() { return new Date().toISOString().slice(0, 10); }
function visible() { return { status: "published" as const, publishedDate: { $type: "string" as const, $lte: todayDate(), $regex: /^\d{4}-\d{2}-\d{2}$/ } }; }
const selection = "title slug excerpt body type publishedDate coverImage isFeatured sourceUrl ctaLabel ctaHref";
const postsPerPage = 6;
type PostProjection = { title: string; slug: string; excerpt: string; body: string[]; type?: string; publishedDate?: string | null; coverImage?: string; isFeatured?: boolean; sourceUrl?: string; ctaLabel?: string; ctaHref?: string };
function publicPost(post: PostProjection): PublicPost {
  return {
    title: post.title, slug: post.slug, excerpt: post.excerpt, body: post.body,
    type: post.type === "promotion" ? "promotion" : "article",
    publishedDate: post.publishedDate!,
    coverImage: post.coverImage && isLocalMenuImage(post.coverImage) ? post.coverImage : null,
    isFeatured: post.isFeatured === true,
    sourceUrl: post.sourceUrl && isFacebookLink(post.sourceUrl) ? post.sourceUrl : null,
    ctaLabel: post.ctaLabel || "",
    ctaHref: post.ctaHref === "/menu" || post.ctaHref === "/branches" ? post.ctaHref : null,
  };
}
export async function getPublicPosts(page = 1, type?: "article" | "promotion", excludeSlug?: string) {
  const { posts } = getContentModels(await connectDatabase());
  const filter = { ...visible(), ...(type ? { type } : {}), ...(excludeSlug ? { slug: { $ne: excludeSlug } } : {}) };
  const [records, total] = await Promise.all([
    posts.find(filter).select(selection).sort({ type: -1, publishedDate: -1, slug: 1 }).skip((page - 1) * postsPerPage).limit(postsPerPage).maxTimeMS(5000).lean().exec(),
    posts.countDocuments(filter).maxTimeMS(5000).exec(),
  ]);
  return { data: records.map(publicPost), page, totalPages: Math.ceil(total / postsPerPage) };
}
export async function getFeaturedPosts() {
  const { posts } = getContentModels(await connectDatabase());
  const records = await posts.find({ ...visible(), isFeatured: true, coverImage: { $regex: /^\/images\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+\.(png|jpe?g|webp|avif)$/i } })
    .select(selection).sort({ publishedDate: -1, slug: 1 }).limit(5).maxTimeMS(5000).lean().exec();
  return records.map(publicPost);
}
export async function getPublicPost(slug: string) {
  if (slug.length > 160 || !slugPattern.test(slug)) return null;
  const { posts } = getContentModels(await connectDatabase());
  const post = await posts.findOne({ ...visible(), slug }).select(selection).maxTimeMS(5000).lean().exec();
  return post ? publicPost(post) : null;
}
