import { authorize, adminJson, adminFailure, AdminError } from "@/lib/admin/http";
import { ordersCollection } from "@/lib/orders/service";
import { orderStatuses } from "@/lib/orders/domain";
import { customerId } from "@/lib/admin/customers";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request) {
  try {
    await authorize();
    const params = new URL(request.url).searchParams;
    if ([...params.keys()].some((key) => !["page", "status", "customer"].includes(key) || params.getAll(key).length !== 1)) throw new AdminError("Invalid order query.", 400);
    const pageValue = params.get("page") || "1", status = params.get("status") || "";
    if (!/^[1-9]\d{0,3}$/.test(pageValue) || Number(pageValue) > 1000 || (status && !orderStatuses.some((value) => value === status))) throw new AdminError("Invalid page or status.", 400);
    const page = Number(pageValue), filter = { ...(status ? { status: status as typeof orderStatuses[number] } : {}), ...(params.has("customer") ? { userId: customerId(params.get("customer")!) } : {}) }, orders = await ordersCollection();
    const [records, total] = await Promise.all([orders.find(filter, { projection: { userId: 1, reference: 1, guest: 1, quote: 1, status: 1, createdAt: 1, updatedAt: 1 }, maxTimeMS: 5000 }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).toArray(), orders.countDocuments(filter, { maxTimeMS: 5000 })]);
    return adminJson({ data: records.map(({ _id, ...record }) => ({ ...record, id: _id.toHexString() })), meta: { page, totalPages: Math.ceil(total / 20), total } });
  } catch (error) { return adminFailure(error); }
}
