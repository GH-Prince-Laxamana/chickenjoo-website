import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { getRedirectUrl, unstable_getResponseFromNextConfig } from "next/experimental/testing/server.js";
const require = createRequire(import.meta.url);
function load(path, mocks) {
  const source = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX } }).outputText;
  const context = { exports: {}, require: name => Object.hasOwn(mocks, name) ? mocks[name] : require(name) };
  vm.runInNewContext(source, context);
  return context.exports;
}
function repository() {
  const calls = [];
  const posts = { find(filter) {
    const call = { filter }; calls.push(call);
    const query = {};
    for (const method of ["select", "sort", "skip", "limit", "maxTimeMS", "lean"]) query[method] = value => { call[method] = value; return query; };
    query.exec = async () => [];
    return query;
  }, countDocuments(filter) { calls.push({ count: filter }); return { maxTimeMS: () => ({ exec: async () => 0 }) }; } };
  const api = load("../src/lib/public/posts.ts", {
    "server-only": {}, "@/lib/db": { connectDatabase: async () => ({}) },
    "@/lib/models/content": { getContentModels: () => ({ posts }) },
    "./content-validation": { slugPattern: /^[a-z0-9-]+$/ },
    "./assets": { isLocalMenuImage: () => true }, "./links": { isFacebookLink: () => false },
  });
  return { api, calls };
}
test("old blog links redirect to news and preserve article paths and filters", async () => {
  const nextConfig = load("../next.config.ts", {}).default;
  for (const path of ["", "/chicken-joo-muna-adulting-ulit-pagkatapos", "?page=2&type=promotion"]) {
    const response = await unstable_getResponseFromNextConfig({ url: `https://example.com/blog${path}`, nextConfig });
    assert.equal(response.status, 308);
    assert.equal(getRedirectUrl(response), `https://example.com/news${path}`);
  }
});
test("homepage selects only published, non-future, featured local artwork and caps at five", async () => {
  const { api, calls } = repository();
  await api.getFeaturedPosts();
  const { filter, limit } = calls[0];
  assert.equal(filter.status, "published");
  assert.equal(filter.publishedDate.$lte, api.todayDate());
  assert.equal(filter.isFeatured, true);
  assert.ok(filter.coverImage.$regex.test("/images/blog/blog-delivery.webp"));
  assert.equal(filter.coverImage.$regex.test("https://other.example/image.webp"), false);
  assert.equal(filter.coverImage.$regex.test("/images/../private.webp"), false);
  assert.equal(limit, 5);
});
test("news categories and pagination share the publication filter", async () => {
  const { api, calls } = repository();
  await api.getPublicPosts(2, "promotion");
  assert.equal(calls[0].filter.type, "promotion");
  assert.equal(calls[0].filter.status, "published");
  assert.equal(calls[0].skip, 12);
  assert.equal(calls[0].limit, 12);
  assert.equal(calls[1].count, calls[0].filter);
});
test("news rejects invalid filters and preserves valid category in pagination", async () => {
  let received;
  const Page = load("../src/app/(public)/news/page.tsx", {
    "@/lib/orders/launch-campaign": { isLaunchCampaignActive: () => false, launchCampaign: { slug: "website-launch-25-off" } },
    "next/link": { default: "a" }, "@/components/ContentImage": { default: "img" }, "@/components/PostDate": { default: "time" },
    "@/lib/public/posts": { getPublicPosts: async (...args) => { received = args; return { data: [], totalPages: 3 }; } },
  }).default;
  await Page({ searchParams: Promise.resolve({ page: "-1", type: "draft" }) });
  assert.deepEqual(received, [1, undefined]);
  const tree = await Page({ searchParams: Promise.resolve({ page: "2", type: "promotion" }) });
  const hrefs = [];
  function visit(node) {
    if (Array.isArray(node)) return node.forEach(visit);
    if (!node?.props) return;
    if (node.props.href) hrefs.push(node.props.href);
    visit(node.props.children);
  }
  visit(tree);
  assert.ok(hrefs.includes("/news?page=1&type=promotion"));
  assert.ok(hrefs.includes("/news?page=3&type=promotion"));
});

test("catalog clear action recovers a later page without a search or category", () => {
  const Controls = load("../src/components/catalog/CatalogControls.tsx", {
    react: { useState: initial => [initial, () => {}] },
  }).default;
  function clearButton(node) {
    if (Array.isArray(node)) return node.map(clearButton).find(Boolean);
    if (!node?.props) return undefined;
    return node.type === "button" && node.props.children === "Clear filters" ? node : clearButton(node.props.children);
  }
  for (const kind of ["menu", "branches"]) {
    let applied;
    const props = { kind, options: [], onApply: (...args) => { applied = args; } };
    assert.equal(clearButton(Controls(props)), undefined);
    const clear = clearButton(Controls({ ...props, hasFilters: true }));
    assert.ok(clear);
    clear.props.onClick();
    assert.deepEqual(applied, ["", ""]);
  }
});
