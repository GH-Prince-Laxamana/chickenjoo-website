import nextEnv from "@next/env";
import { connectDatabase, DatabaseConfigurationError } from "../src/lib/db/connection.ts";

nextEnv.loadEnvConfig(process.cwd(), true, { info() {}, error() {} });

let connection;
try {
  connection = await connectDatabase();
  const [reused, concurrent] = await Promise.all([connectDatabase(), connectDatabase()]);
  if (reused !== connection || concurrent !== connection) {
    throw new Error("Database connection reuse failed.");
  }
  if (!connection.db) throw new Error("Database connection is not ready.");
  await connection.db.command({ ping: 1 });
  console.log("MongoDB smoke check passed. Connection reuse and ping succeeded; no records were written.");
} catch (error) {
  console.error(
    error instanceof DatabaseConfigurationError
      ? error.message
      : "MongoDB smoke check failed. Check your local URI, credentials, database permissions, and network access. Connection details are intentionally omitted.",
  );
  process.exitCode = 1;
} finally {
  await connection?.close();
}
