import assert from "node:assert/strict";
import test from "node:test";
import { parseOrderInput, parseGuest, canTransition, orderStatuses } from "../src/lib/orders/domain.ts";
import { isLaunchCampaignActive, launchPromotion } from "../src/lib/orders/launch-campaign.ts";
const line = { menuItemId: "a".repeat(24), quantity: 1, flavors: ["Original"] };
const input = { branchId: "b".repeat(24), items: [line] };
test("launch discount follows Philippine dates and rounds once in centavos", () => {
  const start = Date.parse("2026-09-15T00:00:00+08:00"), end = Date.parse("2026-10-16T00:00:00+08:00");
  assert.equal(isLaunchCampaignActive(start - 1), false);
  assert.equal(isLaunchCampaignActive(start), true);
  assert.equal(isLaunchCampaignActive(end - 1), true);
  assert.equal(isLaunchCampaignActive(end), false);
  assert.equal(launchPromotion(39900, start).discountCentavos, 9975);
  assert.equal(launchPromotion(102, start).discountCentavos, 26);
  assert.equal(launchPromotion(0, start).discountCentavos, 0);
  assert.equal(launchPromotion(39900, end), undefined);
  assert.deepEqual(parseOrderInput({ ...input, launchVoucher: true }), input);
  assert.throws(() => parseOrderInput({ ...input, launchVoucher: "true" }));
});
test("bounded cart quantities, IDs, distinct flavors and duplicate lines", () => {
  assert.deepEqual(parseOrderInput(input), input);
  for (const quantity of [0, -1, 1.5, 11, "1"]) assert.throws(() => parseOrderInput({ ...input, items: [{ ...line, quantity }] }));
  assert.throws(() => parseOrderInput({ ...input, items: [{ ...line, flavors: ["Original", "Original"] }] }));
  assert.throws(() => parseOrderInput({ ...input, items: [line, line] }));
  assert.throws(() => parseOrderInput({ ...input, items: [{ ...line, totalCentavos: 1 }] }));
  assert.throws(() => parseOrderInput({ ...input, branchId: { $ne: null } }));
  assert.throws(() => parseOrderInput({ ...input, items: [] }));
  assert.throws(() => parseOrderInput({ ...input, items: Array.from({ length: 6 }, (_, i) => ({ ...line, menuItemId: String(i).repeat(24), quantity: 10 })) }));
});
test("guest details are bounded and normalized", () => {
  assert.deepEqual(parseGuest({ name: " Demo Guest ", email: " DEMO@EXAMPLE.INVALID " }), { name: "Demo Guest", email: "demo@example.invalid" });
  assert.throws(() => parseGuest({ name: "demo", email: "a\u0000@b.c" }));
  for (const guest of [{ name: "", email: "a@b.c" }, { name: "demo\nname", email: "a@b.c" }, { name: "demo", email: "invalid" }, { name: "demo", email: "a@b.c", role: "admin" }]) assert.throws(() => parseGuest(guest));
});
test("demo lifecycle advances sequentially; terminal orders cannot change", () => {
  assert.ok(canTransition("pending", "preparing")); assert.ok(canTransition("preparing", "ready")); assert.ok(canTransition("ready", "completed"));
  for (const from of orderStatuses) for (const to of orderStatuses) {
    if (["completed", "cancelled"].includes(from) || from === to) assert.equal(canTransition(from, to), false);
  }
  assert.equal(canTransition("pending", "completed"), false);
  for (const from of ["pending", "preparing", "ready"]) assert.ok(canTransition(from, "cancelled"));
});
