import { randomBytes } from "node:crypto";
import { connectDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";
import { AdminError, adminJson, readJson, sameOrigin } from "@/lib/admin/http";
import { authFailure, throttleAuth, clearAuthEmail } from "@/lib/auth/http";
import { credentials } from "@/lib/auth/validation";

export const runtime = "nodejs";
const dummyHash = hashPassword(randomBytes(32).toString("hex"));
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { email, password } = credentials(await readJson(request));
    await throttleAuth("admin-login", email, request);
    const connection = await connectDatabase();
    const admin = await connection.collection("admins").findOne({ email, isActive: true }, { projection: { passwordHash: 1 }, maxTimeMS: 5000 });
    const valid = await verifyPassword(password, admin?.passwordHash || await dummyHash);
    if (!admin || !valid) throw new AdminError("Email or password is incorrect.", 401);
    await createSession(admin._id);
    await clearAuthEmail("admin-login", email);
    return adminJson({ message: "Signed in." });
  } catch (error) { return authFailure(error); }
}
