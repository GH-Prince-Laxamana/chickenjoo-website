import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase } from "../src/lib/db/connection.ts";
nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
let connection;
try {
  const post = JSON.parse(await readFile(new URL("../src/data/launch-campaign.json", import.meta.url), "utf8"));
  assert.equal(post.seedKey, "website-launch-25-off");
  assert.equal(post.slug, post.seedKey);
  assert.equal(post.status, "published");
  assert.equal(post.isFeatured, true);
  await readFile(new URL(`../public${post.coverImage}`, import.meta.url));
  connection = await connectDatabase();
  const posts = connection.collection("blogPosts");
  const existing = await posts.findOne({ $or: [{ seedKey: post.seedKey }, { slug: post.slug }] });
  if (existing) {
    assert.equal(existing.status, "published", "An existing campaign draft needs publishing through the admin dashboard.");
    console.log("Existing published campaign preserved.");
  } else {
    const _id = new mongoose.Types.ObjectId(createHash("sha256").update(`chickenjoo:blogPosts:${post.seedKey}`).digest("hex").slice(0, 24));
    const now = new Date();
    await posts.updateOne({ _id }, { $setOnInsert: { ...post, createdAt: now, updatedAt: now } }, { upsert: true });
    const saved = await posts.findOne({ _id });
    assert.equal(saved.status, "published");
    assert.equal(saved.isFeatured, true);
    console.log("Launch campaign published and featured. Existing posts were preserved.");
  }
} catch (error) {
  console.error(error instanceof assert.AssertionError ? error.message : "Campaign publication failed. Check database access locally; connection details are withheld.");
  process.exitCode = 1;
} finally { await connection?.close(); }
