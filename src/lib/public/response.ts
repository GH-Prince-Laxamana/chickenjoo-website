import "server-only";
import { PublicQueryError } from "./query";

export function publicJson(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export function publicReadError(error: unknown) {
  return error instanceof PublicQueryError
    ? publicJson({ error: { message: error.message } }, 400)
    : publicJson({ error: { message: "We couldn’t load this information. Please try again shortly." } }, 503);
}
