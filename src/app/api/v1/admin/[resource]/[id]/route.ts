import { isResource } from "@/lib/admin/fields";
import { authorize, AdminError, adminFailure, adminJson, readJson } from "@/lib/admin/http";
import { updateAdminRecord, removeAdminRecord } from "@/lib/admin/data";
export const runtime = "nodejs";
type Context = { params: Promise<{ resource: string; id: string }> };
export async function PATCH(request: Request, context: Context) {
  try {
    await authorize(request);
    const { resource, id } = await context.params;
    if (!isResource(resource)) throw new AdminError("Not found.", 404);
    await updateAdminRecord(resource, id, await readJson(request));
    return adminJson({ message: "Saved." });
  } catch (error) { return adminFailure(error); }
}
export async function DELETE(request: Request, context: Context) {
  try {
    await authorize(request);
    const { resource, id } = await context.params;
    if (!isResource(resource)) throw new AdminError("Not found.", 404);
    await removeAdminRecord(resource, id, await readJson(request));
    return adminJson({ message: resource === "blog-posts" ? "Deleted." : "Archived." });
  } catch (error) { return adminFailure(error); }
}
