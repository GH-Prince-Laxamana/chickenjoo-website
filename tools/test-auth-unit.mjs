import test from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import { credentials, safeReturnTo } from "../src/lib/auth/validation.ts";
import { userSchema } from "../src/lib/models/user.ts";
import { isSameOrigin } from "../src/lib/http/origin.ts";
import { addToCart, setCartUser, resumePendingCart } from "../src/lib/orders/cart.ts";

test("registration validates boundaries and rejects privilege injection", () => {
  const input = { name: " Customer ", email: " CUSTOMER@EXAMPLE.COM ", password: "A memorable passphrase!" };
  assert.deepEqual(credentials(input, true), { name: "Customer", email: "customer@example.com", password: input.password });
  for (const patch of [{ role: "admin" }, { isActive: true }, { email: { $ne: null } }, { name: "x\nadmin" }, { password: "short" }, { password: "x".repeat(257) }, { email: "a\0@b.c" }]) assert.throws(() => credentials({ ...input, ...patch }, true));
  assert.equal(credentials({ email: "a@b.c", password: "incorrect" }).password, "incorrect");
});
test("return destinations cannot escape customer routes", () => {
  for (const value of ["https://evil.example", "//evil.example", "/\\evil", "/admin", "/menu/../admin", "/login", undefined]) assert.equal(safeReturnTo(value), "/menu");
  for (const value of ["/cart", "/checkout", "/confirmation", "/account", `/menu#dish-${"a".repeat(24)}`]) assert.equal(safeReturnTo(value), value);
});
test("user schema has a unique email and hidden password, without roles", async () => {
  const connection = mongoose.createConnection(), User = connection.model("User", userSchema);
  const user = new User({ name: " Customer ", email: "CUSTOMER@EXAMPLE.COM", passwordHash: `scrypt-v1:${"a".repeat(32)}:${"b".repeat(128)}` });
  await user.validate(); assert.equal(user.email, "customer@example.com"); assert.equal(user.name, "Customer"); assert.equal(user.isActive, true);
  assert.equal(userSchema.path("passwordHash").options.select, false);
  assert.ok(userSchema.indexes().some(([keys, options]) => keys.email === 1 && options.unique));
  assert.throws(() => new User({ name: "x", role: "admin" }));
  await connection.close();
});
test("CSRF origin cannot be forged with forwarding headers", () => {
  const original = process.env.APP_ORIGIN; delete process.env.APP_ORIGIN;
  try {
    const request = headers => new Request("https://shop.example/api", { headers });
    assert.equal(isSameOrigin(request({ Origin: "https://shop.example" })), true);
    assert.equal(isSameOrigin(request({})), false);
    assert.equal(isSameOrigin(request({ Origin: "https://evil.example", "X-Forwarded-Host": "evil.example", "X-Forwarded-Proto": "https" })), false);
    assert.equal(isSameOrigin(request({ Origin: "https://shop.example", "Sec-Fetch-Site": "cross-site" })), false);
    process.env.APP_ORIGIN = "https://public.example";
    assert.equal(isSameOrigin(request({ Origin: "https://public.example" })), true);
  } finally { if (original === undefined) delete process.env.APP_ORIGIN; else process.env.APP_ORIGIN = original; }
});
test("adding requires a server session, preserves pending choice, and separates carts", async () => {
  const original = { fetch: globalThis.fetch, window: globalThis.window, localStorage: globalThis.localStorage, sessionStorage: globalThis.sessionStorage };
  const local = new Map(), session = new Map();
  const storage = map => ({ getItem: key => map.get(key) ?? null, setItem: (key, value) => map.set(key, value), removeItem: key => map.delete(key) });
  const item = { menuItemId: "a".repeat(24), name: "Chicken", quantity: 2, flavors: ["Spicy"], priceCentavos: 10000 };
  let user = null;
  globalThis.localStorage = storage(local); globalThis.sessionStorage = storage(session);
  globalThis.fetch = async () => Response.json({ data: user });
  try {
    assert.equal(await addToCart(item), false); assert.equal(local.size, 0); assert.equal(JSON.parse(session.get("cj-pending-cart")).item.flavors[0], "Spicy");
    user = { id: "b".repeat(24) }; await resumePendingCart();
    assert.deepEqual(JSON.parse(local.get(`cj-cart-v2:${user.id}`)), [item]); assert.equal(session.size, 0);
    user = { id: "c".repeat(24) }; await addToCart(item); assert.equal(local.size, 2);
    globalThis.fetch = async () => new Response(null, { status: 503 }); await assert.rejects(addToCart(item));
  } finally { setCartUser(null); Object.assign(globalThis, original); }
});
