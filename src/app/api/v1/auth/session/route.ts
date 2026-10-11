import { authorize, adminFailure, adminJson } from "@/lib/admin/http";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export async function GET() {
  try { return adminJson({ data: await authorize() }); }
  catch (error) { return adminFailure(error); }
}
