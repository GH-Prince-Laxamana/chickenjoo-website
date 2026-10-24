import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);

function setup(storage = new Map(), blocked = false) {
  const effects = [];
  const dialog = { open: false, showModal() { this.open = true; }, close() { this.open = false; } };
  const context = {
    exports: {},
    localStorage: {
      getItem(key) { if (blocked) throw Error("Storage blocked"); return storage.get(key) ?? null; },
      setItem(key, value) { if (blocked) throw Error("Storage blocked"); storage.set(key, value); },
    },
    require(name) {
      if (name === "react") return {
        useEffect: callback => effects.push(callback),
        useRef: () => ({ current: dialog }),
        useId: () => "disclaimer",
      };
      return require(name);
    },
  };
  const source = ts.transpileModule(readFileSync(new URL("../src/components/SiteDisclaimer.tsx", import.meta.url), "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
  }).outputText;
  vm.runInNewContext(source, context);
  function elements(node) {
    if (Array.isArray(node)) return node.flatMap(elements);
    return node && typeof node === "object" && node.props ? [node, ...elements(node.props.children)] : [];
  }
  const nodes = elements(context.exports.default());
  const cleanup = effects[0]();
  return { dialog, cleanup, effects, acknowledge: () => nodes.find(node => node.type === "button" && node.props.children === "I Understand").props.onClick(), reopen: () => nodes.find(node => node.props["aria-haspopup"] === "dialog").props.onClick() };
}

test("first visit opens, acknowledgment persists across visits, info reopens, and clearing storage resets it", () => {
  const storage = new Map();
  const first = setup(storage);
  assert.equal(first.dialog.open, true);
  first.acknowledge();
  assert.equal(first.dialog.open, false);
  const returning = setup(storage);
  assert.equal(returning.dialog.open, false);
  returning.reopen();
  assert.equal(returning.dialog.open, true);
  returning.acknowledge();
  assert.equal(returning.dialog.open, false);
  storage.clear();
  assert.equal(setup(storage).dialog.open, true);
});

test("blocked storage still allows reading, dismissal, and reopening", () => {
  const view = setup(new Map(), true);
  assert.equal(view.dialog.open, true);
  assert.doesNotThrow(view.acknowledge);
  assert.equal(view.dialog.open, false);
  view.reopen();
  assert.equal(view.dialog.open, true);
});

test("effect cleanup and replay leave the first-visit dialog open", () => {
  const view = setup();
  view.cleanup();
  assert.equal(view.dialog.open, false);
  view.effects[0]();
  assert.equal(view.dialog.open, true);
});
