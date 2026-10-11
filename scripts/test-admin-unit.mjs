import test from "node:test";
import assert from "node:assert/strict";
import { hashPassword, verifyPassword } from "../src/lib/auth/password.ts";
import { defaults, fields, isResource } from "../src/lib/admin/fields.ts";
test("salted passwords verify without storing plaintext", async () => {
  const password = "Temporary verification password only";
  const first = await hashPassword(password), second = await hashPassword(password);
  assert.notEqual(first, second); assert.ok(!first.includes(password));
  assert.equal(await verifyPassword(password, first), true);
  assert.equal(await verifyPassword("incorrect", first), false);
  assert.equal(await verifyPassword(password, "malformed"), false);
  await assert.rejects(hashPassword("short"));
  await assert.rejects(hashPassword("a".repeat(257)));
});
test("only explicit content resources and editable fields are exposed", () => {
  for (const value of ["admins", "adminSessions", "orders", "__proto__"]) assert.equal(isResource(value), false);
  assert.equal(isResource("menu-items"), true);
  assert.equal(defaults("menu-items").requiredFlavorCount, 0);
  for (const resource of ["menu-items", "branches", "blog-posts", "inquiries"]) {
    assert.ok(!fields[resource].some((field) => ["seedKey", "_id", "createdAt", "passwordHash"].includes(field.key)));
  }
  assert.deepEqual(fields.inquiries.map((field) => field.key), ["status"]);
});
