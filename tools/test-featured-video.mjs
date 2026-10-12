import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../src/components/FeaturedVideo.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function elements(node) {
  if (Array.isArray(node)) return node.flatMap(elements);
  return node && typeof node === "object" && node.props ? [node, ...elements(node.props.children)] : [];
}

function setup() {
  let status = "loading", timeout;
  const context = {
    exports: {},
    window: { setTimeout: (callback) => { timeout = callback; return 1; }, clearTimeout: () => {} },
    require: (name) => {
      if (name === "react") return {
        useState: () => [status, (value) => { status = value; }],
        useEffect: (callback) => callback(),
      };
      if (name === "next/image") return { default: name };
      return require(name);
    },
  };
  vm.runInNewContext(source, context);
  return { render: () => elements(context.exports.default()), expire: () => timeout() };
}

test("YouTube is embedded without autoplay and always has a direct fallback", () => {
  const view = setup();
  const frame = view.render().find((element) => element.type === "iframe");
  const url = new URL(frame.props.src);
  assert.equal(url.hostname, "www.youtube-nocookie.com");
  assert.equal(url.pathname, "/embed/Vk5hliXm3p8");
  assert.equal(url.searchParams.has("autoplay"), false);
  assert.equal(frame.props.referrerPolicy, "strict-origin-when-cross-origin");
  frame.props.onLoad();
  assert.equal(view.render().find((element) => element.type === "iframe").props.tabIndex, 0);
  assert.ok(view.render().some((element) => element.type === "a" && element.props.href === "https://youtu.be/Vk5hliXm3p8"));
});

test("failed and stalled frames show a fallback; a late load can still recover", () => {
  for (const failure of ["error", "timeout"]) {
    const view = setup();
    const frame = view.render().find((element) => element.type === "iframe");
    if (failure === "error") frame.props.onError();
    else view.expire();
    assert.equal(view.render().find((element) => element.props.role === "status").props.children, "Watch this Joo moment on YouTube.");
    assert.equal(view.render().find((element) => element.type === "iframe").props.tabIndex, -1);
    frame.props.onLoad();
    assert.equal(view.render().find((element) => element.type === "iframe").props.className.includes("invisible"), false);
  }
});
