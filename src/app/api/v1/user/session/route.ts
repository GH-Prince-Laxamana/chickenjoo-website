import { getUser } from "@/lib/auth/user-session";
import { authFailure } from "@/lib/auth/http";
import { adminJson } from "@/lib/admin/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return adminJson({ data: await getUser() }); }
  catch (error) { return authFailure(error); }
}
