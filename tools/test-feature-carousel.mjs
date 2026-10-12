import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../src/components/FeatureCarousel.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

// Exercise the component's scroll handlers with layout measurements, without a browser.
function render(width, reducedMotion = false) {
  const cardWidth = Math.min(width * .74, 400);
  const gap = width >= 640 ? 24 : 12;
  let active = 1;
  let requested;
  const track = {
    clientWidth: width,
    scrollLeft: 0,
    children: Array.from({ length: 3 }, (_, i) => ({ offsetLeft: (width - cardWidth) / 2 + i * (cardWidth + gap), clientWidth: cardWidth })),
    scrollTo: (options) => { requested = options; },
  };
  const context = {
    exports: {},
    window: { matchMedia: () => ({ matches: reducedMotion }) },
    require: (name) => name === "react" ? {
      useRef: () => ({ current: track }),
      useState: () => [active, (value) => { active = value; }],
      useLayoutEffect: (callback) => callback(),
    } : name === "next/link" || name === "next/image" ? { default: name } : require(name),
  };
  vm.runInNewContext(source, context);
  const slides = [0, 1, 2].map((i) => ({ title: `Poster ${i}`, image: `/poster-${i}.webp`, alt: `Artwork ${i}`, href: "/menu" }));
  const tree = context.exports.default({ slides });
  return { track, cardWidth, gap, scroll: tree.props.children[1], controls: tree.props.children[2], active: () => active, requested: () => requested };
}

test("poster starts centered and navigation aligns at mobile and desktop widths", () => {
  for (const width of [320, 382, 768, 1440]) {
    const view = render(width);
    assert.ok(Math.abs(view.track.scrollLeft - (view.cardWidth + view.gap)) < .01);
    view.controls.props.children[2].props.onClick();
    assert.ok(Math.abs(view.requested().left - 2 * (view.cardWidth + view.gap)) < .01);
    assert.equal(view.requested().behavior, "smooth");
    view.controls.props.children[0].props.onClick();
    assert.equal(view.requested().left, 0);
    view.track.scrollLeft = 2 * (view.cardWidth + view.gap);
    view.scroll.props.onScroll({ currentTarget: view.track });
    assert.equal(view.active(), 2);
  }
});

test("keyboard navigation respects reduced motion and ignores keys from card links", () => {
  const view = render(382, true);
  let prevented = false;
  const target = {};
  view.scroll.props.onKeyDown({ key: "ArrowRight", target, currentTarget: target, preventDefault: () => { prevented = true; } });
  assert.equal(prevented, true);
  assert.equal(view.requested().behavior, "instant");
  const requested = view.requested();
  view.scroll.props.onKeyDown({ key: "ArrowLeft", target: {}, currentTarget: target });
  assert.equal(view.requested(), requested);
});
