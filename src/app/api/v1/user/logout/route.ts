import { revokeUserSession } from "@/lib/auth/user-session";
import { authFailure } from "@/lib/auth/http";
import { adminJson, sameOrigin } from "@/lib/admin/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { sameOrigin(request); await revokeUserSession(); return adminJson({ message: "Signed out." }); }
  catch (error) { return authFailure(error); }
}
