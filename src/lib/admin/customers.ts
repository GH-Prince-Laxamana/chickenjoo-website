import "server-only";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";
import { AdminError } from "./http";
import { launchCampaign, isLaunchCampaignActive } from "@/lib/orders/launch-campaign";
export function customerId(id: string) {
  if (!/^[a-f0-9]{24}$/.test(id)) throw new AdminError("Customer not found.", 404);
  return new Types.ObjectId(id);
}
export function customerPage(params: URLSearchParams, allowed: string[]) {
  if ([...params.keys()].some(key => !allowed.includes(key) || params.getAll(key).length !== 1)) throw new AdminError("Invalid customer query.", 400);
  const raw = params.get("page") || "1";
  if (!/^[1-9]\d{0,3}$/.test(raw) || Number(raw) > 1000) throw new AdminError("Invalid customer page.", 400);
  return Number(raw);
}
export function publicCustomer(record: { _id: Types.ObjectId; name?: unknown; email?: unknown; isActive?: unknown; createdAt?: Date }) {
  return { id: record._id.toString(), name: String(record.name || "Customer"), email: String(record.email || ""), isActive: record.isActive === true, createdAt: record.createdAt?.toISOString() || null };
}
export async function customerStats(id: Types.ObjectId) {
  const connection = await connectDatabase();
  const [stats] = await connection.collection("orders").aggregate([
    { $match: { userId: id } },
    { $group: { _id: null, orderCount: { $sum: 1 }, completedCount: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, 1, 0] } }, totalCentavos: { $sum: { $cond: [{ $eq: ["$status", "completed"] }, "$quote.totalCentavos", 0] } }, voucherUsed: { $max: { $cond: [{ $eq: ["$quote.promotion.id", launchCampaign.id] }, 1, 0] } } } },
  ], { maxTimeMS: 5000 }).toArray();
  return { orderCount: stats?.orderCount ?? 0, completedCount: stats?.completedCount ?? 0, totalCentavos: stats?.totalCentavos ?? 0, voucherStatus: stats?.voucherUsed ? "redeemed" : isLaunchCampaignActive() ? "available" : "inactive" };
}
