import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import { isMapsLink, isFacebookLink } from "../src/lib/public/links.ts";

const data = JSON.parse(await readFile(new URL("../src/data/catalog.seed.json", import.meta.url), "utf8"));
const menu = new Map(data.menuItems.map((item) => [item.seedKey, item]));
const branches = new Map(data.branches.map((branch) => [branch.seedKey, branch]));

test("supplied menu prices and serving corrections are retained", () => {
  assert.equal(menu.size, 7);
  for (const [key, price] of [["chicken-3-rice", 9900], ["joomami-fries", 7500], ["chicken-3-fries", 13500], ["japanese-rice", 2000], ["chicken-7", 19900], ["chicken-14-one-flavor", 38800], ["chicken-14-two-flavors", 39500]]) {
    assert.equal(menu.get(key).priceCentavos, price);
  }
  assert.match(menu.get("chicken-3-rice").description, /served with rice/);
  assert.doesNotMatch(menu.get("chicken-3-fries").description, /\d+g/);
  for (const key of ["chicken-7", "chicken-14-one-flavor", "chicken-14-two-flavors"]) {
    assert.match(menu.get(key).description, /Rice is not included/);
  }
});

test("flavors remain product choices rather than extra products", () => {
  for (const item of menu.values()) {
    assert.equal(item.image, "");
    assert.equal(item.isAvailable, true);
    if (item.category === "Sides") {
      assert.equal(item.requiredFlavorCount, 0);
      assert.deepEqual(item.flavorOptions, []);
    } else {
      assert.deepEqual(item.flavorOptions, ["Original", "Yangnyeom", "Yangnyeom Extra Spicy", "Yangnyeom with Garlic"]);
      assert.equal(item.requiredFlavorCount, item.seedKey === "chicken-14-two-flavors" ? 2 : 1);
    }
  }
});

test("midnight closing and missing branch contacts are preserved", () => {
  assert.equal(branches.size, 4);
  for (const key of ["hau-angeles", "auf-angeles"]) {
    assert.equal(branches.get(key).closingTime, "00:00");
    assert.equal(branches.get(key).closesNextDay, true);
  }
  for (const key of ["auf-angeles", "magalang"]) {
    assert.equal(branches.get(key).phone, null);
    assert.equal(branches.get(key).facebookUrl, null);
  }
  for (const branch of branches.values()) {
    assert.equal(isMapsLink(branch.mapsUrl), true);
    if (branch.facebookUrl) assert.equal(isFacebookLink(branch.facebookUrl), true);
  }
});

test("external links reject other hosts and executable schemes", () => {
  for (const url of ["javascript:alert(1)", "https://google.com.evil.example/maps", "https://facebook.com.evil.example/", "http://maps.google.com/maps"]) {
    assert.equal(isMapsLink(url), false);
    assert.equal(isFacebookLink(url), false);
  }
});
