import { requireUser } from "@/lib/auth/user-session";
import { authFailure } from "@/lib/auth/http";
import { adminJson } from "@/lib/admin/http";
import { voucherStatus } from "@/lib/orders/service";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return adminJson({ data: await voucherStatus(await requireUser()) }); }
  catch (error) { return authFailure(error); }
}
