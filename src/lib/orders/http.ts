import "server-only";
import { readJson, adminFailure, adminJson } from "@/lib/admin/http";
import { isSameOrigin } from "@/lib/http/origin";
import { OrderError } from "./domain";
import { AuthError } from "@/lib/auth/validation";
export async function orderBody(request: Request) {
  if (!isSameOrigin(request)) throw new OrderError("Submit this request from the website.", 403);
  return readJson(request);
}
export { adminJson as orderJson };
export function orderFailure(error: unknown) {
  if (error instanceof AuthError) return adminJson({ error: { message: error.message } }, error.status);
  if (error instanceof OrderError) return adminJson({ error: { message: error.message }, ...(error.quote ? { quote: error.quote } : {}) }, error.status);
  return adminFailure(error);
}
