import "server-only";
import { Schema, type Connection, type InferSchemaType, type Model } from "mongoose";
import { isLocalMenuImage } from "@/lib/public/assets";
import { isFacebookLink } from "@/lib/public/links";
import { isPublicationDate, slugPattern, inquiryLimits } from "@/lib/public/content-validation";

const postSchema = new Schema({
  seedKey: { type: String, maxlength: 80 },
  title: { type: String, required: true, trim: true, maxlength: 160 },
  slug: { type: String, required: true, maxlength: 160, match: slugPattern },
  excerpt: { type: String, required: true, trim: true, maxlength: 500 },
  body: { type: [String], required: true, validate: (value: string[]) => value.length > 0 && value.length <= 100 && value.every((p) => p.trim().length > 0 && p.length <= 5000) },
  type: { type: String, enum: ["article"], default: "article", required: true },
  status: { type: String, enum: ["draft", "published"], default: "draft", required: true },
  publishedDate: { type: String, default: null, validate: (value: string | null) => !value || isPublicationDate(value) },
  coverImage: { type: String, default: "", validate: (value: string) => !value || isLocalMenuImage(value) },
  sourceUrl: { type: String, default: "", maxlength: 1000, validate: (value: string) => !value || isFacebookLink(value) },
  ctaLabel: { type: String, default: "", maxlength: 80 },
  ctaHref: { type: String, enum: ["", "/menu", "/branches"], default: "" },
}, { timestamps: true, collection: "blogPosts", autoCreate: false, autoIndex: false });
postSchema.index({ slug: 1 }, { unique: true });
postSchema.index({ status: 1, publishedDate: -1 });
postSchema.index({ seedKey: 1 }, { unique: true, sparse: true });

const inquirySchema = new Schema({
  name: { type: String, required: true, maxlength: inquiryLimits.name },
  email: { type: String, required: true, maxlength: inquiryLimits.email },
  subject: { type: String, required: true, maxlength: inquiryLimits.subject },
  message: { type: String, required: true, maxlength: inquiryLimits.message },
  status: { type: String, enum: ["new", "reviewed"], default: "new", required: true },
}, { timestamps: true, collection: "inquiries", autoCreate: false, autoIndex: false });
inquirySchema.index({ email: 1, createdAt: -1 });
type PostRecord = InferSchemaType<typeof postSchema>;
type InquiryRecord = InferSchemaType<typeof inquirySchema>;
export function getContentModels(connection: Connection) {
  return {
    posts: (connection.models.BlogPost as Model<PostRecord> | undefined) ?? connection.model<PostRecord>("BlogPost", postSchema),
    inquiries: (connection.models.Inquiry as Model<InquiryRecord> | undefined) ?? connection.model<InquiryRecord>("Inquiry", inquirySchema),
  };
}
