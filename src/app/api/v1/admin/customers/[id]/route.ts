import { authorize, adminJson, adminFailure, AdminError } from "@/lib/admin/http";
import { customerId, customerPage, customerStats, publicCustomer } from "@/lib/admin/customers";
import { connectDatabase } from "@/lib/db";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    await authorize();
    const id = customerId((await params).id), page = customerPage(new URL(request.url).searchParams, ["page"]), connection = await connectDatabase();
    const user = await connection.collection("users").findOne({ _id: id }, { projection: { name: 1, email: 1, isActive: 1, createdAt: 1 }, maxTimeMS: 5000 });
    if (!user) throw new AdminError("Customer not found.", 404);
    const [stats, orders] = await Promise.all([customerStats(id), connection.collection("orders").find({ userId: id }, { projection: { reference: 1, status: 1, createdAt: 1, "quote.branch.name": 1, "quote.totalCentavos": 1, "quote.promotion": 1 }, maxTimeMS: 5000 }).sort({ createdAt: -1, _id: -1 }).skip((page - 1) * 20).limit(20).toArray()]);
    return adminJson({ data: { ...publicCustomer(user), ...stats, orders: orders.map(({ _id, ...order }) => ({ ...order, id: _id.toString() })) }, meta: { page, totalPages: Math.ceil(stats.orderCount / 20) } });
  } catch (error) { return adminFailure(error); }
}
