import "server-only";
import { createHash } from "node:crypto";
import { connectDatabase } from "@/lib/db";
import { ensureAccountIndexes } from "@/lib/db/account-indexes";
import { adminFailure, adminJson } from "@/lib/admin/http";
import { AuthError } from "./validation";
export function authFailure(error: unknown) {
  return error instanceof AuthError ? adminJson({ error: { message: error.message, ...(error.fields ? { fields: error.fields } : {}) } }, error.status) : adminFailure(error);
}
export async function throttleAuth(scope: string, email: string, request: Request) {
  const connection = await connectDatabase();
  await ensureAccountIndexes(connection);
  const bucket = Math.floor(Date.now() / (15 * 60_000));
  // Only trust a client-IP header when the deployment proxy overwrites that header.
  const header = process.env.AUTH_TRUSTED_IP_HEADER;
  const ip = header ? request.headers.get(header)?.split(",")[0].trim().slice(0, 128) : undefined;
  const keys: [string, number][] = [[`email:${email}`, 5], ...(ip ? [[`ip:${ip}`, 30] as [string, number]] : [["global", 100] as [string, number]])];
  for (const [key, limit] of keys) {
    const id = createHash("sha256").update(`${scope}:${key}:${bucket}`).digest("hex");
    const attempt = await connection.db!.collection<{ _id: string; count: number; expiresAt: Date }>("authAttempts").findOneAndUpdate({ _id: id }, {
      $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 2) * 15 * 60_000) },
    }, { upsert: true, returnDocument: "after", maxTimeMS: 5000 });
    if (!attempt || attempt.count > limit) throw new AuthError("Too many attempts. Try again in 15 minutes.", 429);
  }
}
export async function clearAuthEmail(scope: string, email: string) {
  const bucket = Math.floor(Date.now() / (15 * 60_000));
  const ids = [bucket - 1, bucket].map(value => createHash("sha256").update(`${scope}:email:${email}:${value}`).digest("hex"));
  await (await connectDatabase()).db!.collection<{ _id: string }>("authAttempts").deleteMany({ _id: { $in: ids } });
}
