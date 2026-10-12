import assert from "node:assert/strict";
import { test } from "node:test";
import { escapeSearchText, parsePublicListQuery, PublicQueryError } from "../src/lib/public/query.ts";
import { isLocalMenuImage } from "../src/lib/public/assets.ts";

test("public queries accept text and bounded pagination", () => {
  const query = parsePublicListQuery(new URLSearchParams("q=%20chicken%20&category=Rice&page=2&limit=24"), "category");
  assert.equal(query.q, "chicken");
  assert.equal(query.filter, "Rice");
  assert.equal(query.page, 2);
  assert.equal(query.limit, 24);
});

test("malformed or excessive pagination cannot reach database queries", () => {
  for (const query of ["page=0", "page=-1", "page=1.5", "page=1001", "limit=49", "limit=0", "limit=NaN", "limit=99999999999999999999"]) {
    assert.throws(() => parsePublicListQuery(new URLSearchParams(query), "city"), PublicQueryError, query);
  }
});

test("unknown, repeated, and oversized query fields are rejected", () => {
  for (const query of ["isArchived=true", "isActive=false", "q=a&q=b", "category%5B%24ne%5D=x", "q=" + "x".repeat(81), "city=" + "x".repeat(81)]) {
    assert.throws(() => parsePublicListQuery(new URLSearchParams(query), query.startsWith("city") ? "city" : "category"), PublicQueryError, query);
  }
});

test("regular-expression metacharacters are searched literally", () => {
  const text = "Chicken (hot)+ [meal] $5.00? \\";
  const regex = new RegExp(escapeSearchText(text), "i");
  assert.equal(regex.test(text), true);
  assert.equal(regex.test("Chicken hothot meal $5x00"), false);
  assert.equal(new RegExp(escapeSearchText(".*"), "i").test("anything"), false);
});

test("menu image paths reject remote URLs, traversal, and executable data", () => {
  assert.equal(isLocalMenuImage("/images/chicken-meal.webp"), true);
  assert.equal(isLocalMenuImage("/images/menu/chicken-meal.webp"), true);
  assert.equal(isLocalMenuImage("/images/menu/flavors/original.webp"), true);
  for (const path of ["https://example.com/image.jpg", "/images/../private.jpg", "/images/menu/../private.jpg", "data:image/svg+xml,script", "/images/a.svg", "/images/a.png?secret=x", "/images/menu/a b.webp"]) {
    assert.equal(isLocalMenuImage(path), false, path);
  }
});
