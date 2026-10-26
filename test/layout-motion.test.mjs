import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

function rearrange(reduced = false) {
  const refs = [],
    calls = [];
  let cursor = 0,
    effect,
    cleanup,
    swapped = false;
  const child = (side) => ({
    getBoundingClientRect: () => ({ left: (swapped ? 1 - side : side) * 300, top: 0 }),
    animate: (frames, options) => {
      calls.push({ frames, options });
      return { cancel() {} };
    },
  });
  const children = [child(0), child(1)];
  const grid = {};
  const page = { querySelector: () => grid, querySelectorAll: () => children };
  const root = { querySelector: () => page };
  const context = {
    exports: {},
    require: () => ({
      useCallback: (fn) => fn,
      useRef: (value) => (refs[cursor++] ??= { current: value }),
      useLayoutEffect: (fn) => {
        effect = fn;
      },
    }),
    ResizeObserver: class {
      observe() {}
      disconnect() {}
    },
    getComputedStyle: () => ({ gridTemplateColumns: '300px 300px' }),
    matchMedia: () => ({ matches: reduced }),
  };
  vm.runInNewContext(
    ts.transpileModule(
      readFileSync(new URL('../src/useLayoutTransition.ts', import.meta.url), 'utf8'),
      {
        compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
      },
    ).outputText,
    context,
  );
  const render = (scene) => {
    cleanup?.();
    cursor = 0;
    context.exports.useLayoutTransition(scene)(root);
    cleanup = effect();
  };
  render(0);
  swapped = true;
  render(1);
  cleanup();
  return calls;
}

test('layout changes move the existing text and image without opacity or replacement snapshots', () => {
  const calls = rearrange();
  assert.equal(calls.length, 2);
  for (const { frames, options } of calls) {
    assert.ok(options.duration >= 800);
    assert.equal(frames.length, 2);
    assert.ok(frames.every((frame) => !('opacity' in frame) && !('filter' in frame)));
  }
  assert.notEqual(calls[0].frames[0].translate, calls[1].frames[0].translate);
});

test('reduced motion preserves the new layout without a spatial animation', () => {
  assert.equal(rearrange(true).length, 0);
});
