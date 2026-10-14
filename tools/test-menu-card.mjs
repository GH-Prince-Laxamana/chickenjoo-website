import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, existsSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";
import { menuArtwork, flavorArtwork } from "../src/lib/public/menu-artwork.ts";
import { isLocalMenuImage } from "../src/lib/public/assets.ts";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../src/components/catalog/MenuItemCard.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;
const meal = { id: "012345678901234567890123", name: "14-Piece Chicken, Two Flavors", description: "A sharing box.", category: "Chicken", priceCentavos: 39550, image: null, isAvailable: true, requiredFlavorCount: 2, flavorOptions: ["Original", "Yangnyeom"] };

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  return node && typeof node === "object" && node.props ? [node, ...elements(node.props.children)] : [];
}

function setup(item = meal, fail = false) {
  const state = [], added = [];
  let cursor = 0, opens = 0, closes = 0;
  const context = {
    exports: {},
    Error,
    requestAnimationFrame: (callback) => callback(),
    require: (name) => {
      if (name === "react") return {
        useState: (initial) => { const index = cursor++; if (!(index in state)) state[index] = initial; return [state[index], (value) => { state[index] = typeof value === "function" ? value(state[index]) : value; }]; },
        useId: () => "test-meal-title",
        useRef: initial => ({ current: initial === false ? false : { showModal: () => opens++, close: () => closes++, querySelector: () => null } }),
      };
      if (name === "@/lib/orders/cart") return { addToCart: async (line) => { if (fail) throw Error("Storage is unavailable."); added.push(line); return true; } };
      if (name === "next/navigation") return { useRouter: () => ({ push() {} }) };
      if (name === "@/lib/public/menu-artwork") return { menuArtwork, flavorArtwork };
      if (name === "@/lib/public/assets") return { isLocalMenuImage };
      if (name === "next/link" || name === "next/image") return { default: name };
      return require(name);
    },
  };
  vm.runInNewContext(source, context);
  const render = () => { cursor = 0; return elements(context.exports.default({ item })); };
  return { render, added, opens: () => opens, closes: () => closes };
}

test("meal panel opens and closes, validates distinct flavors, and preserves centavos and quantity", async () => {
  const view = setup();
  view.render().find((e) => e.props["aria-haspopup"] === "dialog").props.onClick();
  assert.equal(view.opens(), 1);
  const add = () => view.render().find((e) => e.type === "button" && String(e.props.children).startsWith("Add to cart")).props.onClick();
  const pick = (index, flavor) => view.render().find((e) => e.type === "input" && e.props.type === "radio" && e.props.name.endsWith(`-${index}`) && e.props.value === flavor).props.onChange();
  await add();
  assert.equal(view.added.length, 0);
  assert.ok(view.render().some((e) => e.props.role === "alert" && e.props.children === "Choose Flavor 1 to continue."));
  pick(0, "Original");
  pick(1, "Original");
  await add();
  assert.equal(view.added.length, 0);
  assert.ok(view.render().some((e) => e.props.role === "alert" && e.props.children === "Choose a different flavor for this box."));
  pick(1, "Yangnyeom");
  view.render().find((e) => e.props["aria-label"] === "Increase quantity of 14-Piece Chicken, Two Flavors").props.onClick();
  assert.ok(view.render().some((e) => e.props.children === "Add to cart · ₱791"));
  await add();
  assert.equal(view.added[0].priceCentavos, 39550);
  assert.equal(view.added[0].quantity, 2);
  assert.equal(view.added[0].flavors.join(","), "Original,Yangnyeom");
  assert.ok(view.render().some((e) => e.props.href === "/checkout" && e.props.children === "Order now"));
  view.render().find((e) => e.props["aria-label"] === "Close meal options").props.onClick();
  assert.equal(view.closes(), 1);
});

test("unavailable items disable ordering and storage failures remain visible", async () => {
  const unavailable = setup({ ...meal, isAvailable: false }).render();
  assert.ok(unavailable.filter((e) => e.type === "input" && e.props.type === "radio").every((e) => e.props.disabled));
  assert.equal(unavailable.find((e) => e.props.children === "Unavailable for ordering").props.disabled, true);
  const view = setup({ ...meal, requiredFlavorCount: 0 }, true);
  await view.render().find((e) => e.type === "button" && String(e.props.children).startsWith("Add to cart")).props.onClick();
  assert.equal(view.render().find((e) => e.props.role === "alert").props.children, "Storage is unavailable.");
});

test("both flavor choices expose all eight gallery flavors and save the chosen names", async () => {
  const view = setup({ ...meal, flavorOptions: Object.keys(flavorArtwork) });
  const radios = view.render().filter((e) => e.type === "input" && e.props.type === "radio");
  assert.equal(radios.length, 16);
  radios.find((e) => e.props.name.endsWith("-0") && e.props.value === "Snow Cheese").props.onChange();
  view.render().find((e) => e.type === "input" && e.props.type === "radio" && e.props.name.endsWith("-1") && e.props.value === "Lemon Glaze").props.onChange();
  await view.render().find((e) => e.type === "button" && String(e.props.children).startsWith("Add to cart")).props.onClick();
  assert.deepEqual(Array.from(view.added[0].flavors), ["Snow Cheese", "Lemon Glaze"]);
});

test("all supplied artwork exists, rice uses the supplied photo, and uploaded photos win", () => {
  assert.equal(Object.keys(menuArtwork).length, 7);
  assert.equal(Object.keys(flavorArtwork).length, 8);
  assert.equal(Object.hasOwn(menuArtwork, "Japanese Rice"), true);
  for (const path of [...Object.values(menuArtwork), ...Object.values(flavorArtwork)]) {
    assert.equal(isLocalMenuImage(path), true);
    assert.equal(existsSync(new URL(`../public${path}`, import.meta.url)), true);
  }
  const image = setup({ ...meal, image: "/images/custom-photo.webp" }).render().find((e) => e.type === "next/image");
  assert.equal(image.props.src, "/images/custom-photo.webp");
});

