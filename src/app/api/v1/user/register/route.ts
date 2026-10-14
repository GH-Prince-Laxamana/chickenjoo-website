import { connectDatabase } from "@/lib/db";
import { getUserModel } from "@/lib/models/user";
import { hashPassword } from "@/lib/auth/password";
import { createUserSession } from "@/lib/auth/user-session";
import { credentials, AuthError } from "@/lib/auth/validation";
import { authFailure, throttleAuth } from "@/lib/auth/http";
import { adminJson, readJson, sameOrigin } from "@/lib/admin/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try {
    sameOrigin(request);
    const input = await readJson(request);
    const { name, email, password } = credentials(input, true);
    await throttleAuth("user-register", email, request);
    const users = getUserModel(await connectDatabase());
    const passwordHash = await hashPassword(password);
    try {
      const user = await users.create({ name, email, passwordHash });
      await createUserSession(user._id);
      return adminJson({ data: { id: user._id.toString(), name, email } }, 201);
    } catch (error) {
      if (error && typeof error === "object" && "code" in error && error.code === 11000) throw new AuthError("Unable to create this account. Check your details or try signing in.", 409);
      throw error;
    }
  } catch (error) { return authFailure(error); }
}
