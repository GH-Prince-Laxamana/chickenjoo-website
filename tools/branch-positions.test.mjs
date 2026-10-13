import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { branchPosition } from "../src/components/branches/positions.ts";

test("each maintained branch has a distinct schematic pin within the overview", async () => {
  const { branches } = JSON.parse(await readFile(new URL("../src/data/catalog.seed.json", import.meta.url), "utf8"));
  const positions = branches.map(branchPosition);
  assert.equal(new Set(positions.map(JSON.stringify)).size, branches.length);
  for (const position of positions) {
    assert.ok(position);
    assert.ok(position.every((value) => value > 0 && value < 100));
  }
});

test("new branches are never silently mapped to another branch", () => {
  assert.equal(branchPosition({ name: "Chicken Joo New Branch", city: "Angeles City" }), null);
  assert.equal(branchPosition({ name: "Chicken Joo Magalang", city: "Another city" }), null);
});
