import { createHash } from "node:crypto";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";
import { getContentModels } from "@/lib/models/content";
import { validateInquiry } from "@/lib/public/content-validation";
import { publicJson } from "@/lib/public/response";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
const success = { message: "Thanks for your message. It has been saved for review." };
export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return publicJson({ error: { message: "Submit the form from this website." } }, 403);
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") return publicJson({ error: { message: "Use a JSON submission." } }, 415);
  let input: Record<string, unknown>;
  try {
    const reader = request.body?.getReader();
    if (!reader) return publicJson({ error: { message: "A submission is required." } }, 400);
    const chunks: Uint8Array[] = [];
    let length = 0;
    while (true) {
      const chunk = await reader.read();
      if (chunk.done) break;
      length += chunk.value.byteLength;
      if (length > 16_384) { await reader.cancel(); return publicJson({ error: { message: "Your submission is too large." } }, 413); }
      chunks.push(chunk.value);
    }
    input = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!input || typeof input !== "object" || Array.isArray(input)) throw new Error("Invalid object.");
  } catch { return publicJson({ error: { message: "We couldn’t read your submission. Please try again." } }, 400); }
  if (Object.keys(input).some((key) => !["name", "email", "subject", "message", "website", "submissionId"].includes(key))
    || typeof input.website !== "string" || input.website !== ""
    || typeof input.submissionId !== "string" || !/^[a-f0-9]{8}-[a-f0-9]{4}-4[a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(input.submissionId)) {
    return publicJson({ error: { message: "Invalid submission. Please reload the form and try again." } }, 400);
  }
  const result = validateInquiry(input);
  if (!result.data) return publicJson({ error: { message: "Check the highlighted fields.", fields: result.errors } }, 400);
  try {
    const { inquiries } = getContentModels(await connectDatabase());
    // Retry keys rely on MongoDB's built-in _id uniqueness, without a public read API.
    const _id = new Types.ObjectId(createHash("sha256").update(`inquiry:${input.submissionId}`).digest("hex").slice(0, 24));
    if (await inquiries.exists({ _id }).maxTimeMS(5000)) return publicJson(success);
    const recent = await inquiries.countDocuments({ email: result.data.email, createdAt: { $gte: new Date(Date.now() - 10 * 60_000) } }).maxTimeMS(5000);
    if (recent >= 3) return Response.json({ error: { message: "Please wait 10 minutes before sending another inquiry." } }, { status: 429, headers: { "Cache-Control": "no-store", "Retry-After": "600" } });
    await inquiries.updateOne({ _id }, { $setOnInsert: { ...result.data, status: "new" } }, { upsert: true, runValidators: true, maxTimeMS: 5000 });
    return publicJson(success, 201);
  } catch {
    return publicJson({ error: { message: "We couldn’t confirm that your inquiry was saved. Please try again. Your message is still in the form." } }, 503);
  }
}
