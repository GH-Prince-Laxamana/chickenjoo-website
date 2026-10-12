import "server-only";
import { getAdmin } from "@/lib/auth/session";
import { isSameOrigin } from "@/lib/http/origin";

export class AdminError extends Error {
  status: number;
  constructor(message: string, status: number) { super(message); this.status = status; }
}
export function adminJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store, private", "Vary": "Cookie", "X-Content-Type-Options": "nosniff" } });
}
export function adminFailure(error: unknown) {
  return error instanceof AdminError ? adminJson({ error: { message: error.message } }, error.status)
    : adminJson({ error: { message: "The request could not be completed. Please try again shortly." } }, 503);
}
export function sameOrigin(request: Request) {
  if (!isSameOrigin(request)) throw new AdminError("Submit this request from the admin website.", 403);
}
export async function authorize(request?: Request) {
  const admin = await getAdmin();
  if (!admin) throw new AdminError("Sign in to continue.", 401);
  if (request) sameOrigin(request);
  return admin;
}
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  if (request.headers.get("content-type")?.split(";")[0].trim() !== "application/json") throw new AdminError("Use a JSON request.", 415);
  const reader = request.body?.getReader();
  if (!reader) throw new AdminError("A request body is required.", 400);
  const chunks: Uint8Array[] = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > 64 * 1024) { await reader.cancel(); throw new AdminError("The request is too large.", 413); }
    chunks.push(value);
  }
  try {
    const body = JSON.parse(Buffer.concat(chunks).toString("utf8"));
    if (!body || typeof body !== "object" || Array.isArray(body)) throw new Error();
    return body;
  } catch { throw new AdminError("Invalid JSON request.", 400); }
}
