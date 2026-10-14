import { authorize, adminJson, adminFailure, AdminError } from "@/lib/admin/http";
import { customerPage, publicCustomer } from "@/lib/admin/customers";
import { connectDatabase } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    await authorize();
    const params = new URL(request.url).searchParams, page = customerPage(params, ["page", "q"]), q = (params.get("q") || "").trim();
    if (q.length > 100 || /[\x00-\x1f\x7f]/.test(q)) throw new AdminError("Search must be up to 100 characters.", 400);
    const pattern = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const filter = q ? { $or: [{ name: { $regex: pattern, $options: "i" } }, { email: { $regex: pattern, $options: "i" } }] } : {};
    const users = (await connectDatabase()).collection("users");
    const [records, total] = await Promise.all([users.find(filter, { projection: { name: 1, email: 1, isActive: 1, createdAt: 1 }, maxTimeMS: 5000 }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).toArray(), users.countDocuments(filter, { maxTimeMS: 5000 })]);
    return adminJson({ data: records.map(publicCustomer), meta: { page, total, totalPages: Math.ceil(total / 20) } });
  } catch (error) { return adminFailure(error); }
}
