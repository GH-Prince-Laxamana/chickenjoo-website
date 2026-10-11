import "server-only";
import { readJson, adminFailure, adminJson } from "@/lib/admin/http";
import { OrderError } from "./domain";
export async function orderBody(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) throw new OrderError("Submit this request from the website.", 403);
  return readJson(request);
}
export { adminJson as orderJson };
export function orderFailure(error: unknown) {
  if (error instanceof OrderError) return adminJson({ error: { message: error.message }, ...(error.quote ? { quote: error.quote } : {}) }, error.status);
  return adminFailure(error);
}
