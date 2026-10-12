import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import mongoose from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase } from "../src/lib/db/connection.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
const origin = process.env.PUBLIC_TEST_ORIGIN || "http://localhost:3100";
if (!/^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(origin)) throw new Error("Use a local test origin.");
const marker = `qa-${randomUUID()}`;
const ids = Array.from({ length: 4 }, () => randomUUID());
const inquiryIds = ids.map((id) => new mongoose.Types.ObjectId(createHash("sha256").update(`inquiry:${id}`).digest("hex").slice(0, 24)));
const fixtureIds = [new mongoose.Types.ObjectId(), new mongoose.Types.ObjectId()];
let connection;
try {
  connection = await connectDatabase();
  const posts = connection.collection("blogPosts");
  const inquiries = connection.collection("inquiries");
  await posts.insertMany([
    { _id: fixtureIds[0], slug: `${marker}-draft`, title: `${marker}-private-title`, status: "draft", publishedDate: "2026-01-01", excerpt: "private", body: ["private"] },
    { _id: fixtureIds[1], slug: `${marker}-future`, title: `${marker}-future-title`, status: "published", publishedDate: "2099-01-01", excerpt: "future", body: ["future"] },
  ]);
  const listing = await (await fetch(`${origin}/news`)).text();
  assert.ok(listing.includes("Chicken Joo Muna, Adulting Ulit Pagkatapos"));
  assert.ok(!listing.includes(marker));
  for (const suffix of ["draft", "future", "missing"]) {
    const response = await fetch(`${origin}/news/${marker}-${suffix}`);
    const html = await response.text();
    assert.ok(html.includes("Update not found"));
    assert.ok(!html.includes(`${marker}-private-title`) && !html.includes(`${marker}-future-title`));
  }
  console.log("PASS: published listing; draft, future and missing slug privacy.");
  const article = await (await fetch(`${origin}/news/chicken-joo-muna-adulting-ulit-pagkatapos`)).text();
  assert.ok(article.includes("October 9, 2026") && article.includes("budget adjustment"));
  assert.ok(!article.includes("View original Facebook post"));
  console.log("PASS: supplied article body/date; missing source links omitted.");

  const payload = { name: "Automated QA", email: `${marker}@example.invalid`, subject: "Temporary verification inquiry", message: "This is a temporary test, removed after verification.", website: "", submissionId: ids[0] };
  const send = (body, headers = {}) => fetch(`${origin}/api/v1/inquiries`, { method: "POST", headers: { Origin: origin, "Content-Type": "application/json", ...headers }, body: JSON.stringify(body) });
  const invalid = await send({ ...payload, email: "invalid", message: " " });
  assert.equal(invalid.status, 400);
  assert.deepEqual(Object.keys((await invalid.json()).error.fields).sort(), ["email", "message"]);
  assert.equal((await send(payload, { Origin: "https://example.invalid" })).status, 403);
  assert.equal((await send({ ...payload, website: "spam" })).status, 400);
  assert.equal((await send({ ...payload, status: "reviewed" })).status, 400);
  assert.equal((await send({ ...payload, message: "x".repeat(17000) })).status, 413);
  assert.equal((await fetch(`${origin}/api/v1/inquiries`)).status, 405);
  console.log("PASS: validation, origin, honeypot, unknown-field, body-size and private GET protections.");

  const created = await send(payload);
  assert.equal(created.status, 201);
  assert.equal(created.headers.get("cache-control"), "no-store");
  assert.deepEqual(Object.keys(await created.json()), ["message"]);
  const record = await inquiries.findOne({ _id: inquiryIds[0] });
  assert.equal(record.message, payload.message); assert.equal(record.status, "new");
  assert.ok(record.createdAt instanceof Date && record.updatedAt instanceof Date);
  assert.equal((await send(payload)).status, 200);
  assert.equal(await inquiries.countDocuments({ _id: inquiryIds[0] }), 1);
  console.log("PASS: valid inquiry saved with server timestamps; retry does not duplicate.");
  for (let i = 1; i < 3; i++) assert.equal((await send({ ...payload, submissionId: ids[i] })).status, 201);
  const limited = await send({ ...payload, submissionId: ids[3] });
  assert.equal(limited.status, 429); assert.equal(limited.headers.get("retry-after"), "600");
  assert.equal(await inquiries.countDocuments({ _id: { $in: inquiryIds } }), 3);
  console.log("PASS: basic per-email submission limit.");
} catch {
  console.error("Public integration verification failed. Check the running local app and database configuration. No connection details are printed.");
  process.exitCode = 1;
} finally {
  if (connection) {
    // Delete only exact IDs owned by this run; never clear real content/inquiries.
    await connection.collection("blogPosts").deleteMany({ _id: { $in: fixtureIds } });
    await connection.collection("inquiries").deleteMany({ _id: { $in: inquiryIds } });
    await connection.close();
    console.log("Temporary verification records removed.");
  }
}
