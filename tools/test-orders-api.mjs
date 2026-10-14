import assert from "node:assert/strict";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { Types } from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase } from "../src/lib/db/connection.ts";
import { hashPassword } from "../src/lib/auth/password.ts";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const origin = process.env.ORDERS_TEST_ORIGIN || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local test origin.");
const marker = `qa-${randomUUID()}`, email = `${marker}@example.invalid`, password = randomBytes(32).toString("hex");
const menuId = new Types.ObjectId(), branchId = new Types.ObjectId(), adminId = new Types.ObjectId(), userId = new Types.ObjectId(), orderIds = [], hashes = [];
let connection, cookie = "", userCookie = "";
const hash = (value) => createHash("sha256").update(value).digest("hex");
async function request(path, body, options = {}) {
  return fetch(`${origin}${path}`, { method: options.method || (body ? "POST" : "GET"), headers: { Origin: options.origin || origin, ...(body ? { "Content-Type": "application/json" } : {}), Cookie: options.admin ? cookie : options.anonymous ? "" : userCookie }, ...(body ? { body: JSON.stringify(body) } : {}), redirect: "manual" });
}
const input = { branchId: branchId.toHexString(), items: [{ menuItemId: menuId.toHexString(), quantity: 2, flavors: ["Original", "Spicy"] }] };
async function quote() { const response = await request("/api/v1/orders/quote", input); assert.equal(response.status, 200); return (await response.json()).data; }
function submission(quoteHash) {
  const submissionId = randomUUID(), confirmationToken = randomBytes(32).toString("hex");
  orderIds.push(new Types.ObjectId(hash(`order:${userId}:${submissionId}`).slice(0, 24)));
  return { ...input, submissionId, confirmationToken, quoteHash };
}
try {
  connection = await connectDatabase();
  const now = new Date();
  await connection.collection("menuItems").insertOne({ _id: menuId, name: marker, description: "Temporary ordering fixture", category: marker, priceCentavos: 12345, isAvailable: true, isArchived: false, isFeatured: false, image: "", flavorOptions: ["Original", "Spicy"], requiredFlavorCount: 2, createdAt: now, updatedAt: now });
  await connection.collection("branches").insertOne({ _id: branchId, name: marker, address: "Temporary pickup address", city: marker, isActive: true, isArchived: false, createdAt: now, updatedAt: now });
  await connection.collection("admins").insertOne({ _id: adminId, email, passwordHash: await hashPassword(password), isActive: true, createdAt: now, updatedAt: now });
  await connection.collection("users").insertOne({ _id: userId, name: marker, email, passwordHash: await hashPassword(password), isActive: true, createdAt: now, updatedAt: now });
  assert.equal((await request("/api/v1/orders/quote", input, { anonymous: true })).status, 401);
  const userLogin = await request("/api/v1/user/login", { email, password }); assert.equal(userLogin.status, 200);
  userCookie = userLogin.headers.get("set-cookie").split(";")[0]; hashes.push(hash(userCookie.slice(userCookie.indexOf("=") + 1)));
  assert.equal((await request("/api/v1/orders")).status, 405);
  assert.equal((await request("/api/v1/orders/confirmation")).status, 405);
  assert.equal((await request("/api/v1/admin/orders")).status, 401);
  assert.equal((await request(`/api/v1/admin/orders/${menuId}`, { status: "preparing", expectedStatus: "pending" }, { method: "PATCH" })).status, 401);
  assert.equal((await request("/api/v1/orders/quote", input, { origin: "https://example.invalid" })).status, 403);
  assert.equal((await request("/api/v1/orders/quote", { ...input, totalCentavos: 1 })).status, 400);
  for (const flavors of [[], ["Original"], ["Original", "Original"], ["Original", "Invented"]]) assert.ok([400, 409].includes((await request("/api/v1/orders/quote", { ...input, items: [{ ...input.items[0], flavors }] })).status));
  for (const [collection, flag] of [["menuItems", "isAvailable"], ["branches", "isActive"]]) {
    const id = collection === "menuItems" ? menuId : branchId;
    await connection.collection(collection).updateOne({ _id: id }, { $set: { [flag]: false } });
    assert.equal((await request("/api/v1/orders/quote", input)).status, 409);
    await connection.collection(collection).updateOne({ _id: id }, { $set: { [flag]: true } });
  }
  const firstQuote = await quote(); assert.equal(firstQuote.totalCentavos, 24690);
  const payload = submission(firstQuote.hash);
  assert.equal((await request("/api/v1/orders", { ...payload, totalCentavos: 1 })).status, 400);
  await connection.collection("menuItems").updateOne({ _id: menuId }, { $set: { priceCentavos: 15000 } });
  const changed = await request("/api/v1/orders", payload); assert.equal(changed.status, 409);
  const changedQuote = (await changed.json()).quote; assert.equal(changedQuote.totalCentavos, 30000);
  assert.equal(await connection.collection("orders").countDocuments({ _id: { $in: orderIds } }), 0);
  payload.quoteHash = changedQuote.hash;
  const concurrent = await Promise.all([request("/api/v1/orders", payload), request("/api/v1/orders", payload)]);
  for (const response of concurrent) assert.equal(response.status, 201);
  const saved = (await concurrent[0].json()).data;
  assert.equal(saved.totalCentavos, 30000); assert.equal(saved.status, "pending"); assert.ok(!("guest" in saved));
  assert.equal((await concurrent[1].json()).data.reference, saved.reference);
  assert.equal(await connection.collection("orders").countDocuments({ _id: { $in: orderIds } }), 1);
  assert.equal((await request("/api/v1/orders", { ...payload, guest: { name: "changed", email } })).status, 400);
  assert.equal((await request("/api/v1/orders", { ...payload, items: [{ ...input.items[0], quantity: 1 }] })).status, 409);
  assert.equal((await request("/api/v1/orders/confirmation", { token: randomBytes(32).toString("hex") })).status, 404);
  assert.equal((await request("/api/v1/orders/confirmation", { reference: saved.reference })).status, 400);
  const receipt = await request("/api/v1/orders/confirmation", { token: payload.confirmationToken });
  assert.equal(receipt.status, 200); assert.ok(receipt.headers.get("cache-control").includes("no-store"));
  assert.ok(!(JSON.stringify(await receipt.json()).includes(email)));
  await connection.collection("menuItems").updateOne({ _id: menuId }, { $set: { name: "Changed fixture", isArchived: true, priceCentavos: 99900 } });
  await connection.collection("branches").updateOne({ _id: branchId }, { $set: { name: "Changed branch", isActive: false } });
  assert.equal((await request("/api/v1/orders", payload)).status, 201);
  const historical = (await (await request("/api/v1/orders/confirmation", { token: payload.confirmationToken })).json()).data;
  assert.equal(historical.items[0].name, marker); assert.equal(historical.branch.name, marker); assert.equal(historical.totalCentavos, 30000);
  console.log("PASS: server pricing, flavor/availability checks, explicit price review, concurrent retry deduplication, private receipts and historical snapshots.");
  const login = await request("/api/v1/auth/login", { email, password }); assert.equal(login.status, 200);
  cookie = login.headers.get("set-cookie").split(";")[0]; hashes.push(hash(cookie.slice(cookie.indexOf("=") + 1)));
  assert.equal((await request("/api/v1/admin/orders?page[$gt]=1", undefined, { admin: true })).status, 400);
  assert.equal((await request("/api/v1/admin/orders?status=unknown", undefined, { admin: true })).status, 400);
  const list = await request("/api/v1/admin/orders", undefined, { admin: true }); assert.equal(list.status, 200);
  const privateOrder = (await list.json()).data.find((order) => order.reference === saved.reference); assert.equal(privateOrder.guest.email, email);
  assert.ok(!("confirmationHash" in privateOrder)); assert.ok(!("fingerprint" in privateOrder));
  const path = `/api/v1/admin/orders/${privateOrder.id}`;
  const patch = (expectedStatus, status, extra = {}) => request(path, { expectedStatus, status }, { method: "PATCH", admin: true, ...extra });
  assert.equal((await patch("pending", "completed")).status, 400);
  assert.equal((await patch("pending", "preparing", { origin: "https://example.invalid" })).status, 403);
  assert.equal((await patch("pending", "preparing")).status, 200);
  assert.equal((await patch("pending", "preparing")).status, 409);
  assert.equal((await patch("preparing", "ready")).status, 200);
  assert.equal((await patch("ready", "completed")).status, 200);
  assert.equal((await patch("completed", "cancelled")).status, 400);
  await connection.collection("orders").updateOne({ _id: orderIds[0] }, { $set: { confirmationExpiresAt: new Date(0) } });
  assert.equal((await request("/api/v1/orders/confirmation", { token: payload.confirmationToken })).status, 404);
  await connection.collection("menuItems").updateOne({ _id: menuId }, { $set: { isArchived: false } });
  await connection.collection("branches").updateOne({ _id: branchId }, { $set: { isActive: true } });
  const freshQuote = await quote();
  const limitId = hash(`${userId}:${Math.floor(Date.now() / (15 * 60_000))}`);
  await connection.db.collection("orderSubmissionLimits").updateOne({ _id: limitId }, { $set: { count: 5, expiresAt: new Date(Date.now() + 30 * 60_000) } }, { upsert: true });
  assert.equal((await request("/api/v1/orders", submission(freshQuote.hash))).status, 429);
  // Cancellation is tested without consuming submission limits or touching existing orders.
  await connection.collection("orders").updateOne({ _id: orderIds[0] }, { $set: { status: "pending" } });
  assert.equal((await patch("pending", "cancelled")).status, 200);
  assert.equal((await patch("cancelled", "preparing")).status, 400);
  console.log("PASS: authenticated private order list, bounded filters, same-origin updates, sequential/terminal statuses, stale-update protection, receipt expiry and persistent submission limit.");
} finally {
  if (connection) {
    await connection.collection("orders").deleteMany({ _id: { $in: orderIds } });
    await connection.collection("menuItems").deleteOne({ _id: menuId });
    await connection.collection("branches").deleteOne({ _id: branchId });
    await connection.collection("admins").deleteOne({ _id: adminId });
    await connection.collection("users").deleteOne({ _id: userId });
    await connection.db.collection("adminSessions").deleteMany({ _id: { $in: hashes } });
    await connection.db.collection("userSessions").deleteMany({ _id: { $in: hashes } });
    const bucket = Math.floor(Date.now() / (15 * 60_000));
    await connection.db.collection("orderSubmissionLimits").deleteMany({ _id: { $in: [bucket - 1, bucket, bucket + 1].map((value) => hash(`${userId}:${value}`)) } });
    await connection.db.collection("authAttempts").deleteMany({ _id: { $in: ["admin-login", "user-login"].flatMap(scope => [bucket - 1, bucket, bucket + 1].map(value => hash(`${scope}:email:${email}:${value}`))) } });
    await connection.db.collection("adminLoginAttempts").deleteMany({ _id: { $in: [bucket - 1, bucket, bucket + 1].map((value) => hash(`${email}:${value}`)) } });
    await connection.close();
  }
  console.log("Temporary ordering fixtures removed; existing content preserved.");
}
