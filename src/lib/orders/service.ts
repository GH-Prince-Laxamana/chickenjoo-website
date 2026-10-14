import "server-only";
import { createHash, randomBytes } from "node:crypto";
import { Types } from "mongoose";
import { connectDatabase } from "@/lib/db";
import { onlyKeys, OrderError, parseOrderInput, type Quote, type Receipt, type OrderStatus } from "./domain";
import { isLaunchCampaignActive, launchCampaign, launchPromotion } from "./launch-campaign";
import { requireUser, type UserIdentity } from "@/lib/auth/user-session";
import { ensureAccountIndexes } from "@/lib/db/account-indexes";

const digest = (value: string) => createHash("sha256").update(value).digest("hex");
export type SavedOrder = {
  _id: Types.ObjectId; userId?: Types.ObjectId; reference: string; guest: { name: string; email: string };
  quote: Quote; status: OrderStatus; fingerprint: string; confirmationHash: string;
  confirmationExpiresAt: Date; createdAt: Date; updatedAt: Date;
};
export async function ordersCollection() { return (await connectDatabase()).db!.collection<SavedOrder>("orders"); }
export function receipt(order: SavedOrder): Receipt {
  return { ...order.quote, reference: order.reference, status: order.status, createdAt: order.createdAt.toISOString() };
}
export async function voucherStatus(user: UserIdentity) {
  if (!isLaunchCampaignActive()) return "inactive";
  const used = await (await ordersCollection()).findOne({ userId: new Types.ObjectId(user.id), "quote.promotion.id": launchCampaign.id }, { projection: { _id: 1 }, maxTimeMS: 5000 });
  return used ? "redeemed" : "available";
}
async function buildQuote(body: Record<string, unknown>, user: UserIdentity): Promise<Quote> {
  const input = parseOrderInput(body), connection = await connectDatabase();
  await ensureAccountIndexes(connection);
  const [branch, menu] = await Promise.all([
    connection.collection("branches").findOne({ _id: new Types.ObjectId(input.branchId), isActive: true, isArchived: false }, { projection: { name: 1, address: 1 }, maxTimeMS: 5000 }),
    connection.collection("menuItems").find({ _id: { $in: input.items.map((item) => new Types.ObjectId(item.menuItemId)) }, isAvailable: true, isArchived: false }, { projection: { name: 1, priceCentavos: 1, requiredFlavorCount: 1, flavorOptions: 1 }, maxTimeMS: 5000 }).toArray(),
  ]);
  if (!branch) throw new OrderError("This pickup branch is no longer available. Choose another branch.", 409);
  const items = input.items.map((line) => {
    const item = menu.find((entry) => entry._id.toHexString() === line.menuItemId);
    if (!item) throw new OrderError("A cart item is no longer available. Edit your cart before continuing.", 409);
    if (line.flavors.length !== item.requiredFlavorCount || line.flavors.some((flavor) => !item.flavorOptions.includes(flavor))) throw new OrderError(`Review the flavors for ${item.name}.`, 409);
    if (!Number.isSafeInteger(item.priceCentavos) || item.priceCentavos < 0 || item.priceCentavos > 100_000_000) throw new OrderError("An item price is unavailable. Please try again later.", 503);
    return { ...line, name: String(item.name), unitPriceCentavos: Number(item.priceCentavos), lineTotalCentavos: item.priceCentavos * line.quantity };
  });
  const subtotalCentavos = items.reduce((sum, item) => sum + item.lineTotalCentavos, 0);
  const promotion = body.launchVoucher === true && await voucherStatus(user) === "available" ? launchPromotion(subtotalCentavos) : undefined;
  const snapshot = { branch: { id: input.branchId, name: String(branch.name), address: String(branch.address) }, items, totalCentavos: subtotalCentavos - (promotion?.discountCentavos ?? 0), ...(promotion ? { promotion } : {}) };
  return { ...snapshot, hash: digest(JSON.stringify(snapshot)) };
}
export async function quoteOrder(body: Record<string, unknown>): Promise<Quote> {
  return buildQuote(body, await requireUser());
}
export async function submitOrder(body: Record<string, unknown>) {
  const user = await requireUser();
  onlyKeys(body, ["branchId", "items", "quoteHash", "submissionId", "confirmationToken", "launchVoucher"]);
  const input = parseOrderInput(body), guest = { name: user.name, email: user.email };
  if (typeof body.submissionId !== "string" || !/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(body.submissionId) || typeof body.confirmationToken !== "string" || !/^[0-9a-f]{64}$/.test(body.confirmationToken) || typeof body.quoteHash !== "string" || !/^[0-9a-f]{64}$/.test(body.quoteHash)) throw new OrderError("Review your order before submitting.");
  const _id = new Types.ObjectId(digest(`order:${user.id}:${body.submissionId}`).slice(0, 24));
  const confirmationHash = digest(body.confirmationToken), fingerprint = digest(JSON.stringify({ input, userId: user.id, quoteHash: body.quoteHash, launchVoucher: body.launchVoucher === true, confirmationHash }));
  const orders = await ordersCollection(), existing = await orders.findOne({ _id });
  if (existing) {
    if (existing.fingerprint !== fingerprint) throw new OrderError("This submission has already been used. Review the order again.", 409);
    return receipt(existing);
  }
  const quote = await buildQuote(body, user);
  if (quote.hash !== body.quoteHash) throw new OrderError("Menu prices or pickup details changed. Review the updated order and submit again.", 409, quote);
  const connection = await connectDatabase(), now = new Date();
  const bucket = Math.floor(now.getTime() / (15 * 60_000));
  const limits = connection.db!.collection<{ _id: string; count: number; expiresAt: Date }>("orderSubmissionLimits");
  const attempt = await limits.findOneAndUpdate({ _id: digest(`${user.id}:${bucket}`) }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * 15 * 60_000) } }, { upsert: true, returnDocument: "after" });
  if (!attempt || attempt.count > 5) throw new OrderError("You’ve reached the order limit. Please wait 15 minutes before placing another order.", 429);
  const order: SavedOrder = { _id, userId: new Types.ObjectId(user.id), reference: `CJ-${randomBytes(8).toString("hex").toUpperCase()}`, guest, quote, status: "pending", fingerprint, confirmationHash, confirmationExpiresAt: new Date(now.getTime() + 24 * 60 * 60_000), createdAt: now, updatedAt: now };
  try { await orders.insertOne(order); return receipt(order); }
  catch (error) {
    if (!(error && typeof error === "object" && "code" in error && error.code === 11000)) throw error;
    const saved = await orders.findOne({ _id });
    if (!saved && quote.promotion && await voucherStatus(user) === "redeemed") throw new OrderError("Your voucher has already been redeemed. Review your order at the updated price.", 409, await buildQuote(body, user));
    if (!saved || saved.fingerprint !== fingerprint) throw new OrderError("This submission has already been used. Review the order again.", 409);
    return receipt(saved);
  }
}
export async function findReceipt(body: Record<string, unknown>) {
  const user = await requireUser();
  onlyKeys(body, ["token"]);
  if (typeof body.token !== "string" || !/^[a-f0-9]{64}$/.test(body.token)) throw new OrderError("This private receipt is unavailable.", 404);
  const order = await (await ordersCollection()).findOne({ userId: new Types.ObjectId(user.id), confirmationHash: digest(body.token), confirmationExpiresAt: { $gt: new Date() } });
  if (!order) throw new OrderError("This private receipt has expired or is unavailable.", 404);
  return receipt(order);
}
