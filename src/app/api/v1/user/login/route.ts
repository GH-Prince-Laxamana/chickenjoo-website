import { randomBytes } from "node:crypto";
import { connectDatabase } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/user-session";
import { credentials, AuthError } from "@/lib/auth/validation";
import { authFailure, throttleAuth, clearAuthEmail } from "@/lib/auth/http";
import { adminJson, readJson, sameOrigin } from "@/lib/admin/http";
export const runtime = "nodejs";
const dummyHash = hashPassword(randomBytes(32).toString("hex"));
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const { email, password } = credentials(await readJson(request));
    await throttleAuth("user-login", email, request);
    const user = await (await connectDatabase()).collection("users").findOne({ email, isActive: true }, { projection: { passwordHash: 1, name: 1, email: 1 }, maxTimeMS: 5000 });
    const valid = await verifyPassword(password, user?.passwordHash || await dummyHash);
    if (!user || !valid) throw new AuthError("Email or password is incorrect.", 401);
    await createUserSession(user._id);
    await clearAuthEmail("user-login", email);
    return adminJson({ data: { id: user._id.toString(), name: user.name, email: user.email } });
  } catch (error) { return authFailure(error); }
}
