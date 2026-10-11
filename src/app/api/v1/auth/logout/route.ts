import { revokeSession } from "@/lib/auth/session";
import { sameOrigin, adminFailure, adminJson } from "@/lib/admin/http";
export const runtime = "nodejs";
export async function POST(request: Request) {
  try { sameOrigin(request); await revokeSession(); return adminJson({ message: "Signed out." }); }
  catch (error) { return adminFailure(error); }
}
