export const orderStatuses = ["pending", "preparing", "ready", "completed", "cancelled"] as const;
export type OrderStatus = typeof orderStatuses[number];
export type OrderLine = { menuItemId: string; quantity: number; flavors: string[] };
export type OrderInput = { branchId: string; items: OrderLine[] };
export type Quote = {
  hash: string;
  branch: { id: string; name: string; address: string };
  items: (OrderLine & { name: string; unitPriceCentavos: number; lineTotalCentavos: number })[];
  totalCentavos: number;
  promotion?: { id: string; name: string; discountCentavos: number };
};
export type Receipt = Quote & { reference: string; status: OrderStatus; createdAt: string };
export class OrderError extends Error {
  status: number;
  quote?: Quote;
  constructor(message: string, status = 400, quote?: Quote) { super(message); this.status = status; this.quote = quote; }
}
export function onlyKeys(value: Record<string, unknown>, keys: string[]) {
  if (Object.keys(value).some((key) => !keys.includes(key))) throw new OrderError("Unexpected request fields.");
}
export function parseOrderInput(value: Record<string, unknown>): OrderInput {
  if (value.launchVoucher !== undefined && typeof value.launchVoucher !== "boolean") throw new OrderError("Invalid launch voucher selection.");
  if (typeof value.branchId !== "string" || !/^[a-f0-9]{24}$/.test(value.branchId)) throw new OrderError("Choose a pickup branch.");
  if (!Array.isArray(value.items) || value.items.length < 1 || value.items.length > 20) throw new OrderError("Add between 1 and 20 cart items.");
  const items = value.items.map((line): OrderLine => {
    if (!line || typeof line !== "object" || Array.isArray(line)) throw new OrderError("Invalid cart item.");
    onlyKeys(line, ["menuItemId", "quantity", "flavors"]);
    if (typeof line.menuItemId !== "string" || !/^[a-f0-9]{24}$/.test(line.menuItemId) || !Number.isInteger(line.quantity) || line.quantity < 1 || line.quantity > 10) throw new OrderError("Each item must have a quantity from 1 to 10.");
    if (!Array.isArray(line.flavors) || line.flavors.length > 2 || line.flavors.some((flavor: unknown) => typeof flavor !== "string" || flavor.length > 80) || new Set(line.flavors).size !== line.flavors.length) throw new OrderError("Select distinct flavors for each item.");
    return { menuItemId: line.menuItemId, quantity: line.quantity, flavors: [...line.flavors].sort() };
  });
  if (items.reduce((sum, item) => sum + item.quantity, 0) > 50) throw new OrderError("Choose up to 50 items per order.");
  if (new Set(items.map((item) => JSON.stringify([item.menuItemId, item.flavors]))).size !== items.length) throw new OrderError("Combine matching cart items before checkout.");
  return { branchId: value.branchId, items };
}
export function parseGuest(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) throw new OrderError("Enter your name and email.");
  const guest = value as Record<string, unknown>;
  onlyKeys(guest, ["name", "email"]);
  if (typeof guest.name !== "string" || typeof guest.email !== "string") throw new OrderError("Enter your name and email.");
  const name = guest.name.trim(), email = guest.email.trim().toLowerCase();
  if (!name || name.length > 100 || /[\x00-\x1f\x7f]/.test(name + email) || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new OrderError("Enter a valid name (up to 100 characters) and email.");
  return { name, email };
}
export function canTransition(from: OrderStatus, to: OrderStatus) {
  return (from === "pending" && to === "preparing") || (from === "preparing" && to === "ready") || (from === "ready" && to === "completed") || (!["completed", "cancelled"].includes(from) && to === "cancelled");
}
export const peso = (centavos: number) => new Intl.NumberFormat("en-PH", { style: "currency", currency: "PHP" }).format(centavos / 100);
