import { Types } from "mongoose";
import { authorize, adminJson, adminFailure, AdminError, readJson } from "@/lib/admin/http";
import { ordersCollection } from "@/lib/orders/service";
import { canTransition, orderStatuses, type OrderStatus } from "@/lib/orders/domain";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    await authorize(request);
    const { id } = await context.params, body = await readJson(request);
    if (!/^[a-f0-9]{24}$/.test(id) || Object.keys(body).some((key) => !["status", "expectedStatus"].includes(key)) || !orderStatuses.some((status) => status === body.status) || !orderStatuses.some((status) => status === body.expectedStatus)) throw new AdminError("Invalid order status request.", 400);
    if (!canTransition(body.expectedStatus as OrderStatus, body.status as OrderStatus)) throw new AdminError("This status transition is not allowed. Completed and cancelled orders are final.", 400);
    const result = await (await ordersCollection()).updateOne({ _id: new Types.ObjectId(id), status: body.expectedStatus as OrderStatus }, { $set: { status: body.status as OrderStatus, updatedAt: new Date() } });
    if (!result.matchedCount) throw new AdminError("The order changed or is unavailable. Refresh the list before updating it.", 409);
    return adminJson({ data: { id, status: body.status } });
  } catch (error) { return adminFailure(error); }
}
