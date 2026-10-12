import nextEnv from "@next/env";
import { connectDatabase, DatabaseConfigurationError } from "../src/lib/db/connection.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });

const mappings = new Map([
  ["/images/blog-delivery.webp", "/images/blog/blog-delivery.webp"],
  ["/images/blog-work-break.webp", "/images/blog/blog-work-break.webp"],
  ["/images/blog-citrus-or-spicy.webp", "/images/blog/blog-citrus-or-spicy.webp"],
  ["/images/blog-customer-review.webp", "/images/blog/blog-customer-review.webp"],
  ["/images/blog-lunch-break.webp", "/images/blog/blog-lunch-break.webp"],
  ["/images/blog-bestsellers.webp", "/images/blog/blog-bestsellers.webp"],
  ["/images/blog-new-flavors.webp", "/images/blog/blog-new-flavors.webp"],
  ["/images/news-launch-campaign.png", "/images/brand/news-launch-campaign.png"],
]);

const apply = process.argv.includes("--apply");
let connection;
try {
  if (process.argv.slice(2).some((argument) => argument !== "--apply")) {
    throw new Error("Unsupported argument. Omit arguments to preview, or use --apply to update exact paths.");
  }

  connection = await connectDatabase();
  const collection = connection.collection("blogPosts");
  let matched = 0;
  let modified = 0;

  for (const [from, to] of mappings) {
    const result = apply
      ? await collection.updateMany({ coverImage: from }, { $set: { coverImage: to } })
      : { matchedCount: await collection.countDocuments({ coverImage: from }), modifiedCount: 0 };
    matched += result.matchedCount;
    modified += result.modifiedCount;
    if (result.matchedCount) console.log(`${from} -> ${to}: ${result.matchedCount} ${apply ? "updated" : "would update"}`);
  }

  console.log(`${apply ? "Updated" : "Found"} ${apply ? modified : matched} exact image path entr${apply ? "y" : "ies"}.`);
} catch (error) {
  console.error(error instanceof DatabaseConfigurationError
    ? error.message
    : "Image path migration failed. No connection details are printed.");
  process.exitCode = 1;
} finally {
  await connection?.close();
}
