import { createHash, randomBytes } from "node:crypto";
import { connectDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { adminFailure, AdminError, adminJson, readJson, sameOrigin } from "@/lib/admin/http";

export const runtime = "nodejs";
const dummyHash = hashPassword(randomBytes(32).toString("hex"));
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const input = await readJson(request);
    if (Object.keys(input).some((key) => !["email", "password"].includes(key)) || typeof input.email !== "string" || typeof input.password !== "string"
      || input.email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email.trim()) || !input.password || input.password.length > 256) throw new AdminError("Enter a valid email address and password.", 400);
    const email = input.email.trim().toLowerCase();
    const connection = await connectDatabase();
    const bucket = Math.floor(Date.now() / (15 * 60_000));
    const key = createHash("sha256").update(`${email}:${bucket}`).digest("hex");
    // Atomic attempts are shared across app instances. TTL cleanup is explicit setup.
    const attempts = connection.db!.collection<{ _id: string; count: number; expiresAt: Date }>("adminLoginAttempts");
    const attempt = await attempts.findOneAndUpdate({ _id: key }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date((bucket + 1) * 15 * 60_000) } }, { upsert: true, returnDocument: "after", maxTimeMS: 5000 });
    if (!attempt || attempt.count > 5) throw new AdminError("Too many sign-in attempts. Try again in 15 minutes.", 429);
    const admin = await connection.collection("admins").findOne({ email, isActive: true }, { projection: { passwordHash: 1 }, maxTimeMS: 5000 });
    const valid = await verifyPassword(input.password, admin?.passwordHash || await dummyHash);
    if (!admin || !valid) throw new AdminError("Email or password is incorrect.", 401);
    await createSession(admin._id);
    await attempts.deleteOne({ _id: key });
    return adminJson({ message: "Signed in." });
  } catch (error) { return adminFailure(error); }
}
