import assert from "node:assert/strict";
import { test } from "node:test";

const origin = process.env.CATALOG_TEST_ORIGIN || "http://localhost:3100";
if (!["localhost", "127.0.0.1", "[::1]"].includes(new URL(origin).hostname)) {
  throw new Error("Run catalog API checks against a local development server.");
}

const endpoints = [
  { path: "menu-items", fields: ["id", "name", "description", "category", "priceCentavos", "image", "isAvailable", "isFeatured", "flavorOptions", "requiredFlavorCount"] },
  { path: "branches", fields: ["id", "name", "address", "city", "province", "businessHours", "phone", "email", "directionsUrl", "facebookUrl"] },
];

for (const { path, fields } of endpoints) {
  test(`${path}: MongoDB reads return bounded public fields and fresh responses`, async () => {
    const response = await fetch(`${origin}/api/v1/${path}?limit=1`, { signal: AbortSignal.timeout(20_000) });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get("cache-control"), "no-store");
    const body = await response.json();
    assert.ok(Array.isArray(body.data));
    assert.ok(body.data.length <= 1);
    assert.equal(body.meta.limit, 1);
    assert.ok(Number.isInteger(body.meta.total) && body.meta.total >= 0);
    assert.ok(body.options.length <= 100);
    for (const item of body.data) assert.deepEqual(Object.keys(item).sort(), [...fields].sort());
  });

  test(`${path}: invalid input fails before database queries`, async () => {
    for (const query of ["limit=49", "isArchived=true", "q=a&q=b"]) {
      const response = await fetch(`${origin}/api/v1/${path}?${query}`);
      assert.equal(response.status, 400);
      const body = await response.json();
      assert.equal(typeof body.error.message, "string");
      assert.deepEqual(Object.keys(body), ["error"]);
    }
  });

  test(`${path}: public mutation methods are not available`, async () => {
    const response = await fetch(`${origin}/api/v1/${path}`, { method: "POST" });
    assert.equal(response.status, 405);
  });
}
