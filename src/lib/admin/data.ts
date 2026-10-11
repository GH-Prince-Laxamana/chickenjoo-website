import "server-only";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";
import { getCatalogModels } from "@/lib/models/catalog";
import { getContentModels } from "@/lib/models/content";
import { fields, type Resource } from "./fields";
import { AdminError } from "./http";

const collectionNames = { "menu-items": "menuItems", branches: "branches", "blog-posts": "blogPosts", inquiries: "inquiries" };
function id(value: string) {
  if (!/^[a-f\d]{24}$/i.test(value)) throw new AdminError("Invalid record ID.", 400);
  return new Types.ObjectId(value);
}
export function parseAdminPage(request: Request) {
  const query = new URL(request.url).searchParams;
  if ([...query.keys()].some((key) => key !== "page") || query.getAll("page").length > 1) throw new AdminError("Unsupported query.", 400);
  const value = query.get("page") || "1";
  if (!/^[1-9]\d{0,3}$/.test(value) || Number(value) > 1000) throw new AdminError("Invalid page.", 400);
  return Number(value);
}
export async function listAdminRecords(resource: Resource, page: number) {
  const collection = (await connectDatabase()).collection(collectionNames[resource]);
  const publicFields = resource === "inquiries" ? ["name", "email", "subject", "message", "status"] : fields[resource].map((field) => field.key);
  const projection = Object.fromEntries([...publicFields, "createdAt", "updatedAt"].map((key) => [key, 1]));
  const [records, total] = await Promise.all([
    collection.find({}, { projection, maxTimeMS: 5000 }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).toArray(),
    collection.countDocuments({}, { maxTimeMS: 5000 }),
  ]);
  return { data: records.map(({ _id, ...record }) => ({ ...record, id: _id.toString() })), meta: { page, total, totalPages: Math.ceil(total / 20) } };
}
async function validated(resource: Resource, input: Record<string, unknown>) {
  const allowed = fields[resource];
  if (Object.keys(input).some((key) => key !== "expectedUpdatedAt" && !allowed.some((field) => field.key === key))) throw new AdminError("Unsupported record field.", 400);
  const data: Record<string, unknown> = {};
  for (const field of allowed) {
    const value = input[field.key];
    if (field.kind === "boolean") {
      if (typeof value !== "boolean") throw new AdminError(`${field.label} must be true or false.`, 400);
      data[field.key] = value;
    } else if (field.kind === "price" || field.key === "requiredFlavorCount") {
      if (typeof value !== "number" || !Number.isSafeInteger(value)) throw new AdminError(`${field.label} must be an integer.`, 400);
      data[field.key] = value;
    } else if (field.kind === "lines" || field.kind === "paragraphs") {
      if (!Array.isArray(value) || value.some((entry) => typeof entry !== "string")) throw new AdminError(`${field.label} must contain plain text.`, 400);
      data[field.key] = value.map((entry) => entry.trim());
    } else {
      if (typeof value !== "string" && value !== null) throw new AdminError(`${field.label} must be text.`, 400);
      const text = typeof value === "string" ? value.trim() : "";
      if ((field.required && !text) || (field.max && text.length > field.max) || (field.options && !field.options.includes(text))) throw new AdminError(`Check ${field.label.toLowerCase()}.`, 400);
      data[field.key] = text;
    }
  }
  if (resource === "inquiries") return data;
  const connection = await connectDatabase();
  try {
    if (resource === "menu-items") await new (getCatalogModels(connection).menuItems)(data).validate();
    if (resource === "branches") {
      for (const key of ["openingTime", "closingTime", "phone", "email", "mapsUrl", "facebookUrl"]) if (!data[key]) data[key] = null;
      if (typeof data.email === "string") data.email = data.email.toLowerCase();
      if (data.openingTime && data.closingTime && String(data.closingTime) <= String(data.openingTime) && !data.closesNextDay) throw new Error();
      await new (getCatalogModels(connection).branches)(data).validate();
    }
    if (resource === "blog-posts") {
      if (!data.publishedDate) data.publishedDate = null;
      if (data.status === "published" && !data.publishedDate) throw new Error();
      if (Boolean(data.ctaLabel) !== Boolean(data.ctaHref)) throw new Error();
      await new (getContentModels(connection).posts)(data).validate();
    }
  } catch { throw new AdminError("Check the record: use valid local image paths, supported links, dates, prices, and flavor counts. Published posts need a date; CTA label and destination must be supplied together.", 400); }
  return data;
}
function expectedDate(input: Record<string, unknown>) {
  if (typeof input.expectedUpdatedAt !== "string" || !/^\d{4}-\d{2}-\d{2}T/.test(input.expectedUpdatedAt) || Number.isNaN(Date.parse(input.expectedUpdatedAt))) throw new AdminError("Reload the record before saving.", 400);
  return new Date(input.expectedUpdatedAt);
}
export async function createAdminRecord(resource: Resource, input: Record<string, unknown>) {
  if (resource === "inquiries") throw new AdminError("Inquiries are submitted from Contact.", 405);
  if ("expectedUpdatedAt" in input) throw new AdminError("Unsupported record field.", 400);
  const data = await validated(resource, input);
  const now = new Date();
  try {
    const result = await (await connectDatabase()).collection(collectionNames[resource]).insertOne({ ...data, createdAt: now, updatedAt: now });
    return { id: result.insertedId.toString() };
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) throw new AdminError("This slug is already in use.", 409);
    throw error;
  }
}
export async function updateAdminRecord(resource: Resource, recordId: string, input: Record<string, unknown>) {
  const _id = id(recordId), updatedAt = expectedDate(input);
  const data = await validated(resource, input);
  try {
    const nextUpdatedAt = new Date(Math.max(Date.now(), updatedAt.getTime() + 1));
    const result = await (await connectDatabase()).collection(collectionNames[resource]).updateOne({ _id, updatedAt }, { $set: { ...data, updatedAt: nextUpdatedAt } }, { maxTimeMS: 5000 });
    if (!result.matchedCount) throw new AdminError("This record changed or was removed. Reload it before saving.", 409);
  } catch (error) {
    if (error && typeof error === "object" && "code" in error && error.code === 11000) throw new AdminError("This slug is already in use.", 409);
    throw error;
  }
}
export async function removeAdminRecord(resource: Resource, recordId: string, input: Record<string, unknown>) {
  if (resource === "inquiries") throw new AdminError("Resolve inquiries instead of deleting them.", 405);
  if (Object.keys(input).some((key) => key !== "expectedUpdatedAt")) throw new AdminError("Unsupported record field.", 400);
  const filter = { _id: id(recordId), updatedAt: expectedDate(input) };
  const collection = (await connectDatabase()).collection(collectionNames[resource]);
  const result = resource === "blog-posts" ? await collection.deleteOne(filter)
    : await collection.updateOne(filter, { $set: { isArchived: true, updatedAt: new Date(Math.max(Date.now(), filter.updatedAt.getTime() + 1)) } });
  if (!("deletedCount" in result ? result.deletedCount : result.matchedCount)) throw new AdminError("This record changed or was removed. Reload it before continuing.", 409);
}
