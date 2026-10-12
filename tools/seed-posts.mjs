import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import mongoose from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase, DatabaseConfigurationError } from "../src/lib/db/connection.ts";
import { isPublicationDate, slugPattern } from "../src/lib/public/content-validation.ts";
import { isLocalMenuImage } from "../src/lib/public/assets.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });
let connection;
try {
  const dryRun = process.argv.includes("--dry-run");
  if (process.argv.slice(2).some((arg) => arg !== "--dry-run")) throw new Error("Unsupported argument.");
  const records = JSON.parse(await readFile(new URL("../src/data/posts.seed.json", import.meta.url), "utf8"));
  for (const field of ["seedKey", "slug"]) {
    if (new Set(records.map((r) => r[field])).size !== records.length) throw new Error("Duplicate seed entry.");
  }
  for (const record of records) {
    if (!slugPattern.test(record.seedKey) || !slugPattern.test(record.slug) || !isPublicationDate(record.publishedDate)
      || !["article", "promotion"].includes(record.type) || record.status !== "published" || !record.title?.trim()
      || !record.excerpt?.trim() || !Array.isArray(record.body) || !record.body.length || record.body.some((p) => typeof p !== "string" || !p.trim())
      || (record.coverImage !== "" && !isLocalMenuImage(record.coverImage))
      || (record.isFeatured !== undefined && typeof record.isFeatured !== "boolean")
      || (record.isFeatured && !record.coverImage)
      || record.sourceUrl !== "" || !["/menu", "/branches"].includes(record.ctaHref)) throw new Error("Invalid maintained seed content.");
    if (record.coverImage) await readFile(new URL(`../public${record.coverImage}`, import.meta.url));
  }
  connection = await connectDatabase();
  const collection = connection.collection("blogPosts");
  let inserted = 0, preserved = 0;
  for (const record of records) {
    // Also preserve a pre-existing post using the supplied slug.
    if (await collection.findOne({ $or: [{ seedKey: record.seedKey }, { slug: record.slug }] }, { projection: { _id: 1 } })) { preserved++; continue; }
    if (dryRun) { inserted++; continue; }
    const _id = new mongoose.Types.ObjectId(createHash("sha256").update(`chickenjoo:blogPosts:${record.seedKey}`).digest("hex").slice(0, 24));
    const now = new Date();
    const result = await collection.updateOne({ _id }, { $setOnInsert: { ...record, createdAt: now, updatedAt: now } }, { upsert: true });
    if (result.upsertedCount) inserted++; else preserved++;
  }
  console.log(`blogPosts: ${inserted} ${dryRun ? "would be inserted" : "inserted"}, ${preserved} existing records preserved.`);
} catch (error) {
  console.error(error instanceof DatabaseConfigurationError ? error.message : "Post seeding failed. Check the maintained seed file, database permissions, and network access locally.");
  process.exitCode = 1;
} finally { await connection?.close(); }
