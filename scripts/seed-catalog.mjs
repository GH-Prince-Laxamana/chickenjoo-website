import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import mongoose from "mongoose";
import nextEnv from "@next/env";
import { connectDatabase, DatabaseConfigurationError } from "../src/lib/db/connection.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });

const dryRun = process.argv.includes("--dry-run");
let connection;
try {
  if (process.argv.slice(2).some((argument) => argument !== "--dry-run")) throw new Error("Unsupported seed argument.");
  const data = JSON.parse(await readFile(new URL("../src/data/catalog.seed.json", import.meta.url), "utf8"));
  // This command accepts only the maintained, reviewed seed file, not user input.
  for (const records of [data.menuItems, data.branches]) {
    if (!Array.isArray(records) || new Set(records.map((record) => record.seedKey)).size !== records.length) {
      throw new Error("Seed keys must be unique within each collection.");
    }
    for (const record of records) {
      if (!/^[a-z0-9-]+$/.test(record.seedKey) || !record.name?.trim()) throw new Error("Invalid catalog seed record.");
    }
  }
  for (const item of data.menuItems) {
    if (!Number.isSafeInteger(item.priceCentavos) || item.priceCentavos < 0 ||
      ![0, 1, 2].includes(item.requiredFlavorCount) ||
      item.flavorOptions.length < item.requiredFlavorCount ||
      (item.requiredFlavorCount === 0 && item.flavorOptions.length !== 0)) {
      throw new Error("Invalid price or flavor metadata in the seed file.");
    }
  }

  connection = await connectDatabase();
  for (const [collectionName, records] of [["menuItems", data.menuItems], ["branches", data.branches]]) {
    const collection = connection.collection(collectionName);
    let inserted = 0;
    let skipped = 0;
    for (const record of records) {
      if (dryRun) {
        if (await collection.findOne({ seedKey: record.seedKey }, { projection: { _id: 1 } })) skipped++;
        else inserted++;
        continue;
      }
      // Deterministic IDs also use MongoDB's built-in uniqueness protection.
      const id = new mongoose.Types.ObjectId(createHash("sha256").update(`chickenjoo:${collectionName}:${record.seedKey}`).digest("hex").slice(0, 24));
      const now = new Date();
      const result = await collection.updateOne(
        { seedKey: record.seedKey },
        { $setOnInsert: { _id: id, ...record, createdAt: now, updatedAt: now } },
        { upsert: true },
      );
      if (result.upsertedCount) inserted++;
      else skipped++;
    }
    console.log(`${collectionName}: ${inserted} ${dryRun ? "would be inserted" : "inserted"}, ${skipped} existing records preserved.`);
  }
  console.log(dryRun ? "Dry run complete. No records were written." : "Catalog seed complete. Existing edits and unrelated records were preserved.");
} catch (error) {
  console.error(error instanceof DatabaseConfigurationError ? error.message : "Catalog seeding failed. Check the seed file, database permissions, and network access locally. No connection details are printed; rerunning preserves existing records.");
  process.exitCode = 1;
} finally {
  await connection?.close();
}
