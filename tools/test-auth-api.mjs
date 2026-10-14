import assert from "node:assert/strict";
import { randomBytes, randomUUID, createHash } from "node:crypto";
import { Types } from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase } from "../src/lib/db/connection.ts";
import { hashPassword } from "../src/lib/auth/password.ts";
import { isLaunchCampaignActive } from "../src/lib/orders/launch-campaign.ts";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const origin = process.env.AUTH_TEST_ORIGIN || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local test origin.");
const marker = `qa-auth-${randomUUID()}`, password = randomBytes(32).toString("hex"), emails = [0, 1, 2, 3].map(i => `${marker}-${i}@example.invalid`);
const menuId = new Types.ObjectId(), branchId = new Types.ObjectId(), adminId = new Types.ObjectId(), tokens = [];
const digest = value => createHash("sha256").update(value).digest("hex");
let connection, cookie = "", adminCookie = "";
const sessions = [];
const request = (path, body, options = {}) => fetch(`${origin}${path}`, { method: body ? "POST" : "GET", headers: { Origin: options.origin || origin, ...(body ? { "Content-Type": "application/json" } : {}), Cookie: options.cookie ?? cookie }, ...(body ? { body: JSON.stringify(body) } : {}), redirect: "manual" });
function sessionCookie(response) {
  const value = response.headers.get("set-cookie"); assert.ok(value.includes("HttpOnly") && /SameSite=strict/i.test(value));
  const result = value.split(";")[0]; sessions.push(digest(result.slice(result.indexOf("=") + 1))); return result;
}
try {
  connection = await connectDatabase();
  for (const path of ["/", "/menu", "/login", "/register", "/admin/login"]) assert.equal((await request(path)).status, 200);
  assert.equal((await request("/api/v1/auth/register", {})).status, 404);
  for (const path of ["/cart", "/checkout", "/account"]) assert.ok([307, 308].includes((await request(path)).status));
  for (const path of ["/api/v1/user/voucher", "/api/v1/admin/customers"]) assert.equal((await request(path)).status, 401);
  for (const path of ["/api/v1/orders", "/api/v1/orders/confirmation"]) assert.equal((await request(path, {})).status, 401);
  assert.equal((await request("/api/v1/user/register", { name: marker, email: emails[0], password, role: "admin" })).status, 400);
  assert.equal((await request("/api/v1/user/register", { name: marker, email: emails[0], password }, { origin: "https://evil.invalid" })).status, 403);
  const registrations = await Promise.all([0, 1].map(() => request("/api/v1/user/register", { name: marker, email: emails[0].toUpperCase(), password })));
  assert.deepEqual(registrations.map(r => r.status).sort(), [201, 409]); cookie = sessionCookie(registrations.find(r => r.status === 201));
  const user = await connection.collection("users").findOne({ email: emails[0] });
  assert.ok(user.passwordHash.startsWith("scrypt-v1:") && !user.passwordHash.includes(password)); assert.equal(await connection.collection("users").countDocuments({ email: emails[0] }), 1);
  const session = await (await request("/api/v1/user/session")).json(); assert.equal(session.data.id, user._id.toString()); assert.ok(!JSON.stringify(session).includes("passwordHash"));
  assert.equal((await request("/api/v1/auth/session")).status, 401); assert.equal((await request("/api/v1/admin/customers")).status, 401);
  assert.equal((await request("/api/v1/user/login", { email: emails[0], password: "incorrect password" })).status, 401);
  const login = await request("/api/v1/user/login", { email: emails[0], password }); const priorCookie = cookie; cookie = sessionCookie(login); assert.notEqual(cookie, priorCookie);
  assert.equal((await (await request("/api/v1/user/session", undefined, { cookie: priorCookie })).json()).data, null);
  const now = new Date();
  await connection.collection("menuItems").insertOne({ _id: menuId, name: marker, priceCentavos: 10000, requiredFlavorCount: 0, flavorOptions: [], isAvailable: true, isArchived: false });
  await connection.collection("branches").insertOne({ _id: branchId, name: marker, address: "QA pickup", isActive: true, isArchived: false });
  const input = { branchId: branchId.toString(), items: [{ menuItemId: menuId.toString(), quantity: 1, flavors: [] }], launchVoucher: true };
  const quote = (await (await request("/api/v1/orders/quote", input)).json()).data;
  const payload = () => { const token = randomBytes(32).toString("hex"); tokens.push(token); return { ...input, submissionId: randomUUID(), confirmationToken: token, quoteHash: quote.hash }; };
  const first = payload(), second = payload();
  assert.equal((await request("/api/v1/orders", { ...first, guest: { name: "Forged", email: emails[1] } })).status, 400);
  if (isLaunchCampaignActive()) {
    assert.equal(quote.totalCentavos, 7500);
    const redemptions = await Promise.all([request("/api/v1/orders", first), request("/api/v1/orders", second)]);
    assert.deepEqual(redemptions.map(r => r.status).sort(), [201, 409]);
    assert.equal(await connection.collection("orders").countDocuments({ userId: user._id, "quote.promotion.id": "website-launch-2026" }), 1);
    const saved = redemptions[0].status === 201 ? first : second;
    assert.equal((await request("/api/v1/orders", saved)).status, 201);
    assert.equal((await (await request("/api/v1/user/voucher")).json()).data, "redeemed");
    assert.equal((await (await request("/api/v1/orders/quote", input)).json()).data.totalCentavos, 10000);
    assert.equal((await request("/api/v1/orders/confirmation", { token: saved.confirmationToken })).status, 200);
  } else { assert.equal(quote.totalCentavos, 10000); assert.equal((await request("/api/v1/orders", first)).status, 201); }
  const ownerCookie = cookie;
  const other = await request("/api/v1/user/register", { name: `${marker} other`, email: emails[1], password }, { cookie: "" }); cookie = sessionCookie(other);
  for (const token of tokens) assert.equal((await request("/api/v1/orders/confirmation", { token })).status, 404);
  if (isLaunchCampaignActive()) assert.equal((await (await request("/api/v1/user/voucher")).json()).data, "available");
  await connection.collection("users").updateOne({ email: emails[1] }, { $set: { isActive: false } }); assert.equal((await (await request("/api/v1/user/session")).json()).data, null);
  cookie = ownerCookie; await request("/api/v1/user/logout", {}); assert.equal((await (await request("/api/v1/user/session")).json()).data, null);
  console.log("PASS: registration races, password protection, cookie rotation, customer/admin isolation, disabled accounts, private receipts and single-use concurrent vouchers.");
  await connection.collection("admins").insertOne({ _id: adminId, email: emails[2], passwordHash: await hashPassword(password), isActive: true, createdAt: now, updatedAt: now });
  adminCookie = sessionCookie(await request("/api/v1/auth/login", { email: emails[2], password }, { cookie: "" })); cookie = adminCookie;
  assert.equal((await (await request("/api/v1/user/session")).json()).data, null);
  const customers = await request(`/api/v1/admin/customers?q=${encodeURIComponent(marker)}`); assert.equal(customers.status, 200);
  const listing = await customers.json(); assert.equal(listing.data.length, 2); assert.ok(!JSON.stringify(listing).includes("passwordHash"));
  const detail = await (await request(`/api/v1/admin/customers/${user._id}`)).json(); assert.equal(detail.data.orderCount, 1); assert.ok(!JSON.stringify(detail).includes("confirmationHash"));
  assert.equal((await request("/api/v1/admin/customers?page[$gt]=1")).status, 400);
  assert.equal((await request("/api/v1/admin/customers/not-an-id")).status, 404);
  const orders = await (await request(`/api/v1/admin/orders?customer=${user._id}`)).json(); assert.equal(orders.data.length, 1); assert.equal(orders.data[0].userId, user._id.toString());
  for (let i = 0; i < 6; i++) { const response = await request("/api/v1/user/login", { email: `${marker}-missing@example.invalid`, password: "wrong" }, { cookie: "" }); assert.equal(response.status, i < 5 ? 401 : 429); }
  console.log("PASS: private customer dashboard, safe search/filtering, customer links, no admin registration and throttling.");
} finally {
  if (connection) {
    const users = await connection.collection("users").find({ email: { $in: emails } }, { projection: { _id: 1 } }).toArray();
    await connection.collection("orders").deleteMany({ userId: { $in: users.map(u => u._id) } });
    await connection.collection("users").deleteMany({ email: { $in: emails } });
    await connection.collection("admins").deleteMany({ email: { $in: emails } });
    await connection.collection("menuItems").deleteOne({ _id: menuId }); await connection.collection("branches").deleteOne({ _id: branchId });
    for (const name of ["userSessions", "adminSessions"]) await connection.db.collection(name).deleteMany({ _id: { $in: sessions } });
    const bucket = Math.floor(Date.now() / (15 * 60_000)), attemptIds = [], orderLimitIds = [];
    for (const value of [bucket - 1, bucket, bucket + 1]) {
      for (const scope of ["user-register", "user-login", "admin-login"]) for (const email of [...emails, `${marker}-missing@example.invalid`]) attemptIds.push(digest(`${scope}:email:${email}:${value}`));
      for (const u of users) orderLimitIds.push(digest(`${u._id}:${value}`));
    }
    await connection.db.collection("authAttempts").deleteMany({ _id: { $in: attemptIds } }); await connection.db.collection("orderSubmissionLimits").deleteMany({ _id: { $in: orderLimitIds } });
    await connection.close();
  }
  console.log("Temporary auth fixtures removed; existing customer and order records preserved.");
}
