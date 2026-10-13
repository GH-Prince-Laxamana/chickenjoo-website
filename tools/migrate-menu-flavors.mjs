import { readFile } from "node:fs/promises";
import nextEnv from "@next/env";
import { connectDatabase, DatabaseConfigurationError } from "../src/lib/db/connection.ts";
import { flavorArtwork } from "../src/lib/public/menu-artwork.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });

const apply = process.argv.includes("--apply");
let connection;
try {
  if (process.argv.slice(2).some((argument) => argument !== "--apply")) {
    throw new Error("Unsupported argument. Omit arguments to preview, or use --apply to update flavors.");
  }

  const { menuItems } = JSON.parse(await readFile(new URL("../src/data/catalog.seed.json", import.meta.url), "utf8"));
  connection = await connectDatabase();
  const collection = connection.collection("menuItems");
  let changed = 0;

  for (const item of menuItems.filter((entry) => entry.requiredFlavorCount > 0)) {
    const current = await collection.findOne({ seedKey: item.seedKey, isArchived: false }, { projection: { flavorOptions: 1, requiredFlavorCount: 1 } });
    if (!current || current.requiredFlavorCount < 1) continue;
    const missing = Object.keys(flavorArtwork).filter((flavor) => !current.flavorOptions?.includes(flavor));
    if (!missing.length) continue;
    if (apply) {
      await collection.updateOne({ _id: current._id }, { $addToSet: { flavorOptions: { $each: missing } } });
    }
    changed++;
    console.log(`${item.name}: ${missing.length} flavors ${apply ? "added" : "to add"}`);
  }

  console.log(`${changed} seeded chicken products ${apply ? "updated" : "need updating"}. Other catalog records were preserved.`);
} catch (error) {
  console.error(error instanceof DatabaseConfigurationError ? error.message : "Flavor migration failed. Check database permissions and network access locally; no connection details are printed.");
  process.exitCode = 1;
} finally {
  await connection?.close();
}
