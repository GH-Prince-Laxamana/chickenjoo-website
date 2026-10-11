import { isResource } from "@/lib/admin/fields";
import { authorize, AdminError, adminFailure, adminJson, readJson } from "@/lib/admin/http";
import { listAdminRecords, createAdminRecord, parseAdminPage } from "@/lib/admin/data";
export const runtime = "nodejs";
export const dynamic = "force-dynamic";
type Context = { params: Promise<{ resource: string }> };
export async function GET(request: Request, context: Context) {
  try {
    await authorize();
    const { resource } = await context.params;
    if (!isResource(resource)) throw new AdminError("Not found.", 404);
    return adminJson(await listAdminRecords(resource, parseAdminPage(request)));
  } catch (error) { return adminFailure(error); }
}
export async function POST(request: Request, context: Context) {
  try {
    await authorize(request);
    const { resource } = await context.params;
    if (!isResource(resource)) throw new AdminError("Not found.", 404);
    return adminJson({ data: await createAdminRecord(resource, await readJson(request)) }, 201);
  } catch (error) { return adminFailure(error); }
}
