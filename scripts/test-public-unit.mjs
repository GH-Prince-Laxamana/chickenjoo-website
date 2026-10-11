import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { validateInquiry, isPublicationDate } from "../src/lib/public/content-validation.ts";

test("inquiries normalize safe strings and preserve plain text", () => {
  assert.deepEqual(validateInquiry({ name: " Demo ", email: " DEMO@EXAMPLE.COM ", subject: " Visit ", message: "<script>plain text</script>" }), {
    data: { name: "Demo", email: "demo@example.com", subject: "Visit", message: "<script>plain text</script>" }, errors: {},
  });
});
test("invalid inquiry fields are rejected individually", () => {
  for (const input of [null, [], { name: {}, email: "invalid", subject: " ", message: "" }]) {
    const result = validateInquiry(input);
    assert.equal(result.data, undefined);
    assert.equal(Object.keys(result.errors).length, 4);
  }
  const result = validateInquiry({ name: "N", email: "a@b.example", subject: "s".repeat(161), message: "bad\u0000" });
  assert.deepEqual(Object.keys(result.errors).sort(), ["message", "subject"]);
});
test("publication dates reject impossible calendar days", () => {
  assert.equal(isPublicationDate("2026-10-09"), true);
  for (const value of ["2026-02-30", "2026-13-01", "2026-1-1", "2026-10-09T00:00:00Z"]) assert.equal(isPublicationDate(value), false);
});
test("supplied updates remain three short articles without invented sources", async () => {
  const posts = JSON.parse(await readFile(new URL("../src/data/posts.seed.json", import.meta.url), "utf8"));
  assert.equal(posts.length, 3);
  assert.equal(new Set(posts.map((p) => p.seedKey)).size, 3);
  assert.deepEqual(posts.map((p) => p.publishedDate), ["2026-10-09", "2026-10-05", "2026-09-28"]);
  for (const post of posts) {
    assert.equal(post.type, "article"); assert.equal(post.status, "published");
    assert.equal(post.sourceUrl, ""); assert.equal(post.coverImage, "");
    assert.ok(post.body.length <= 3); assert.ok(["/menu", "/branches"].includes(post.ctaHref));
  }
});
