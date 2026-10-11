import assert from "node:assert/strict";
import { randomUUID, randomBytes, createHash } from "node:crypto";
import { Types } from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase } from "../src/lib/db/connection.ts";
import { hashPassword } from "../src/lib/auth/password.ts";
import { defaults } from "../src/lib/admin/fields.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const origin = process.env.ADMIN_TEST_ORIGIN || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local test origin.");
const marker = `qa-${randomUUID()}`;
const adminId = new Types.ObjectId(), inquiryId = new Types.ObjectId();
const email = `${marker}@example.invalid`, password = randomBytes(32).toString("hex");
const ownedIds = { menuItems: [], branches: [], blogPosts: [], inquiries: [inquiryId] };
const ownedSessionIds = [];
let cookie = "", connection;
async function request(path, method = "GET", body, override = {}) {
  return fetch(`${origin}${path}`, { method, headers: { Origin: origin, ...(cookie ? { Cookie: cookie } : {}), ...(body ? { "Content-Type": "application/json" } : {}), ...override }, ...(body ? { body: JSON.stringify(body) } : {}), redirect: "manual" });
}
async function login(credentials) {
  const response = await request("/api/v1/auth/login", "POST", credentials);
  assert.equal(response.status, 200);
  const header = response.headers.get("set-cookie");
  assert.ok(header.includes("HttpOnly") && header.includes("SameSite=strict") && header.includes("Secure"));
  cookie = header.split(";")[0];
  ownedSessionIds.push(createHash("sha256").update(cookie.slice(cookie.indexOf("=") + 1)).digest("hex"));
}
async function current(resource, recordId) {
  const response = await request(`/api/v1/admin/${resource}`);
  assert.equal(response.status, 200); assert.ok(response.headers.get("cache-control").includes("no-store"));
  const data = (await response.json()).data;
  const record = data.find((entry) => entry.id === recordId);
  assert.ok(record); assert.ok(!("seedKey" in record));
  return record;
}
try {
  connection = await connectDatabase();
  const now = new Date();
  await connection.collection("admins").insertOne({ _id: adminId, email, passwordHash: await hashPassword(password), isActive: true, createdAt: now, updatedAt: now });
  await connection.collection("inquiries").insertOne({ _id: inquiryId, name: marker, email, subject: "Temporary test", message: "Temporary inquiry verification.", status: "new", createdAt: now, updatedAt: now });
  for (const resource of ["menu-items", "branches", "blog-posts", "inquiries"]) {
    assert.equal((await request(`/api/v1/admin/${resource}`)).status, 401);
    assert.equal((await request(`/api/v1/admin/${resource}`, "POST", {})).status, 401);
    assert.equal((await request(`/api/v1/admin/${resource}/${inquiryId}`, "PATCH", {})).status, 401);
    assert.equal((await request(`/api/v1/admin/${resource}/${inquiryId}`, "DELETE", {})).status, 401);
  }
  assert.equal((await request("/api/v1/auth/session")).status, 401);
  const protectedPage = await request("/admin");
  assert.equal(protectedPage.status, 307); assert.equal(protectedPage.headers.get("location"), "/admin/login");
  console.log("PASS: every admin list/create/update/delete endpoint denies anonymous requests.");
  assert.equal((await request("/api/v1/auth/login", "POST", { email, password: "wrong" })).status, 401);
  assert.equal((await request("/api/v1/auth/login", "POST", { email, password }, { Origin: "https://example.invalid" })).status, 403);
  await login({ email, password });
  const identity = (await (await request("/api/v1/auth/session")).json()).data;
  assert.deepEqual(Object.keys(identity).sort(), ["email", "id"]);
  assert.equal((await request("/api/v1/admin/menu-items", "POST", {}, { Origin: "https://example.invalid" })).status, 403);
  assert.equal((await request("/api/v1/admin/menu-items?page[$gt]=1")).status, 400);
  console.log("PASS: sign-in, secure cookie, minimal identity, same-origin mutation protection and bounded queries.");

  for (const [resource, collection] of [["menu-items", "menuItems"], ["branches", "branches"], ["blog-posts", "blogPosts"]]) {
    let payload = defaults(resource);
    if (resource === "menu-items") payload = { ...payload, name: marker, description: "Temporary dish", category: marker, priceCentavos: 12345 };
    if (resource === "branches") payload = { ...payload, name: marker, address: "Temporary test address", city: marker };
    if (resource === "blog-posts") payload = { ...payload, title: marker, slug: marker, excerpt: "Temporary excerpt", body: ["Temporary text."], publishedDate: "2026-01-01" };
    if (resource === "menu-items") {
      assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, priceCentavos: -1 })).status, 400);
      assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, flavorOptions: [], requiredFlavorCount: 2 })).status, 400);
      assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, image: "https://example.invalid/image.png" })).status, 400);
    }
    if (resource === "branches") assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, mapsUrl: "javascript:alert(1)" })).status, 400);
    if (resource === "blog-posts") assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, status: "published", publishedDate: "" })).status, 400);
    assert.equal((await request(`/api/v1/admin/${resource}`, "POST", { ...payload, seedKey: "tampered" })).status, 400);
    const created = await request(`/api/v1/admin/${resource}`, "POST", payload);
    assert.equal(created.status, 201);
    const recordId = (await created.json()).data.id;
    ownedIds[collection].push(new Types.ObjectId(recordId));
    const record = await current(resource, recordId);
    if (resource === "blog-posts") {
      const draft = await (await request(`/blog/${marker}`)).text(); assert.ok(!draft.includes("Temporary text."));
      assert.equal((await request(`/api/v1/admin/${resource}`, "POST", payload)).status, 409);
    }
    const updated = resource === "menu-items" ? { ...payload, priceCentavos: 23456, isFeatured: true }
      : resource === "branches" ? { ...payload, businessHours: "Temporary QA hours" }
        : { ...payload, status: "published" };
    assert.equal((await request(`/api/v1/admin/${resource}/${recordId}`, "PATCH", { ...updated, expectedUpdatedAt: record.updatedAt })).status, 200);
    assert.equal((await request(`/api/v1/admin/${resource}/${recordId}`, "PATCH", { ...updated, expectedUpdatedAt: record.updatedAt })).status, 409);
    const publicPath = resource === "menu-items" ? `/api/v1/menu-items?q=${marker}` : resource === "branches" ? `/api/v1/branches?q=${marker}` : `/blog/${marker}`;
    const visibleResponse = await request(publicPath);
    if (resource === "blog-posts") assert.ok((await visibleResponse.text()).includes("Temporary text."));
    else {
      const records = (await visibleResponse.json()).data;
      assert.equal(records.length, 1);
      if (resource === "menu-items") { assert.equal(records[0].priceCentavos, 23456); assert.ok((await (await request("/")).text()).includes(marker)); }
      else assert.equal(records[0].businessHours, "Temporary QA hours");
    }
    const latest = await current(resource, recordId);
    assert.equal((await request(`/api/v1/admin/${resource}/${recordId}`, "DELETE", { expectedUpdatedAt: latest.updatedAt })).status, 200);
    const after = await request(publicPath);
    if (resource === "blog-posts") assert.ok(!(await after.text()).includes("Temporary text."));
    else assert.equal((await after.json()).data.length, 0);
    if (resource !== "blog-posts") assert.equal((await current(resource, recordId)).isArchived, true);
  }
  console.log("PASS: create/edit, strict field validation, public freshness/featured selection, private drafts, unique slugs, stale-edit conflicts, archive and post deletion.");
  const inquiry = await current("inquiries", inquiryId.toString());
  assert.equal((await request(`/api/v1/admin/inquiries/${inquiryId}`, "PATCH", { status: "resolved", expectedUpdatedAt: inquiry.updatedAt })).status, 200);
  assert.equal((await current("inquiries", inquiryId.toString())).status, "resolved");
  assert.equal((await request(`/api/v1/admin/inquiries/${inquiryId}`, "DELETE", { expectedUpdatedAt: inquiry.updatedAt })).status, 405);
  console.log("PASS: inquiry inspection/resolution and prohibited inquiry deletion.");
  const originalCookie = cookie;
  assert.equal((await request("/api/v1/auth/logout", "POST")).status, 200);
  assert.equal((await request("/api/v1/auth/session")).status, 401);
  cookie = originalCookie; assert.equal((await request("/api/v1/auth/session")).status, 401);
  await login({ email, password });
  await connection.collection("adminSessions").updateOne({ _id: ownedSessionIds.at(-1) }, { $set: { expiresAt: new Date(0) } });
  assert.equal((await request("/api/v1/auth/session")).status, 401);
  await login({ email, password });
  await connection.collection("admins").updateOne({ _id: adminId }, { $set: { isActive: false } });
  assert.equal((await request("/api/v1/auth/session")).status, 401);
  cookie = "";
  for (let i = 0; i < 5; i++) assert.equal((await request("/api/v1/auth/login", "POST", { email, password: "wrong" })).status, 401);
  assert.equal((await request("/api/v1/auth/login", "POST", { email, password: "wrong" })).status, 429);
  console.log("PASS: logout/replay denial, expiration, disabled admin and atomic login attempt limit.");
  if (process.env.ADMIN_SEED_EMAIL && process.env.ADMIN_SEED_PASSWORD) {
    await login({ email: process.env.ADMIN_SEED_EMAIL, password: process.env.ADMIN_SEED_PASSWORD });
    assert.equal((await request("/api/v1/auth/session")).status, 200);
    assert.equal((await request("/api/v1/auth/logout", "POST")).status, 200);
    console.log("PASS: locally configured admin can sign in and sign out; credentials not printed.");
  }
} catch (error) {
  console.error(error instanceof assert.AssertionError ? `Admin check failed: ${error.message}` : "Admin checks failed. Check the local server/database configuration; no secrets are printed.");
  process.exitCode = 1;
} finally {
  if (connection) {
    try {
      for (const [collection, ids] of Object.entries(ownedIds)) await connection.collection(collection).deleteMany({ _id: { $in: ids } });
      await connection.collection("admins").deleteOne({ _id: adminId });
      await connection.collection("adminSessions").deleteMany({ $or: [{ adminId }, { _id: { $in: ownedSessionIds } }] });
      const bucket = Math.floor(Date.now() / (15 * 60_000));
      const limiterKeys = [bucket - 1, bucket, bucket + 1].map((b) => createHash("sha256").update(`${email}:${b}`).digest("hex"));
      await connection.collection("adminLoginAttempts").deleteMany({ _id: { $in: limiterKeys } });
      console.log("Exact temporary admin/content/inquiry/session fixtures removed.");
    } catch { console.error("Fixture cleanup could not complete. Inspect temporary QA records locally."); process.exitCode = 1; }
    await connection.close();
  }
}
