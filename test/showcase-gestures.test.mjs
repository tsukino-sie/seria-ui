import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

const compile = (file) =>
  ts.transpileModule(readFileSync(new URL(file, import.meta.url), 'utf8'), {
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
  }).outputText;
const position = { exports: {} };
vm.runInNewContext(compile('../showcase/sectionPosition.ts'), position);

// A deterministic event/animation clock exercises the real hook's gesture handling.
// It does not replace browser layout, touch-device or visual verification.
function fixture() {
  let clock = 0;
  let animationId = 0;
  let cleanup;
  const frames = new Map();
  const listeners = new Map();
  class Element {
    parentElement = null;
    interactive = false;
    closest() {
      return this.interactive ? this : null;
    }
  }
  class HTMLElement extends Element {
    scrollHeight = 0;
    clientHeight = 0;
    scrollTop = 0;
    style = { overflowY: 'visible', overscrollBehaviorY: 'auto' };
  }
  const body = new HTMLElement();
  const win = {
    scrollY: 0,
    innerHeight: 821,
    location: { hash: '' },
    history: { pushState() {} },
    matchMedia: () => ({ matches: false }),
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
    requestAnimationFrame: (callback) => {
      frames.set(++animationId, callback);
      return animationId;
    },
    cancelAnimationFrame: (id) => frames.delete(id),
    scrollTo: ({ top }) => {
      win.scrollY = top;
    },
  };
  const doc = {
    body,
    documentElement: { scrollHeight: 2335 },
    querySelector: (selector) =>
      selector === '.studio-header' ? { getBoundingClientRect: () => ({ height: 64 }) } : null,
    querySelectorAll: () =>
      [64, 821, 1578].map((top) => ({
        getBoundingClientRect: () => ({ top: top - win.scrollY, bottom: top + 757 - win.scrollY }),
      })),
    addEventListener: (name, listener) => listeners.set(name, listener),
    removeEventListener: (name) => listeners.delete(name),
  };
  const context = {
    exports: {},
    window: win,
    document: doc,
    Element,
    HTMLElement,
    performance: { now: () => clock },
    getComputedStyle: (element) => element.style,
    require: (id) =>
      id === 'react'
        ? {
            useEffect: (callback) => {
              cleanup = callback();
            },
          }
        : position.exports,
  };
  vm.runInNewContext(compile('../showcase/useSectionScroll.ts'), context);
  context.exports.default();
  const event = (type, props = {}) => {
    const result = {
      target: body,
      defaultPrevented: false,
      button: 0,
      preventDefault() {
        this.defaultPrevented = true;
      },
      ...props,
    };
    listeners.get(type)?.(result);
    return result;
  };
  const tick = (milliseconds) => {
    clock += milliseconds;
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach((callback) => callback(clock));
  };
  return {
    win,
    body,
    frames,
    event,
    tick,
    cleanup: () => cleanup(),
    wheel: (deltaY, props) => event('wheel', { deltaY, deltaX: 0, deltaMode: 0, ...props }),
    reader: () => {
      const reader = new HTMLElement();
      reader.parentElement = body;
      reader.style.overflowY = 'auto';
      reader.scrollHeight = 900;
      reader.clientHeight = 300;
      return reader;
    },
  };
}

test('wheel starts immediately and one momentum gesture cannot skip two sections', () => {
  const f = fixture();
  assert.equal(f.wheel(20).defaultPrevented, true);
  assert.equal(f.frames.size, 1);
  for (let i = 0; i < 10; i++) {
    f.tick(100);
    f.wheel(20);
  }
  assert.equal(f.win.scrollY, 757);
  assert.equal(f.frames.size, 0);
  f.tick(300);
  f.wheel(20);
  f.tick(1000);
  assert.equal(f.win.scrollY, 1514);
  f.cleanup();
});

test('reversing a wheel gesture redirects an in-progress move', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(400);
  assert.ok(f.win.scrollY > 0 && f.win.scrollY < 757);
  f.wheel(-100);
  f.tick(1000);
  assert.equal(f.win.scrollY, 0);
  f.cleanup();
});

test('a gesture from between sections continues in its direction without an idle timer', () => {
  const f = fixture();
  f.win.scrollY = 350;
  f.wheel(20);
  assert.equal(f.frames.size, 1);
  f.tick(1000);
  assert.equal(f.win.scrollY, 757);
  f.wheel(-20);
  f.tick(1000);
  assert.equal(f.win.scrollY, 0);
  f.cleanup();
  assert.equal(f.frames.size, 0);
});

test('preview scrolling, overscroll containment and browser zoom remain native', () => {
  const f = fixture();
  const reader = f.reader();
  reader.scrollTop = 200;
  assert.equal(f.wheel(100, { target: reader }).defaultPrevented, false);
  reader.scrollTop = 600;
  reader.style.overscrollBehaviorY = 'contain';
  assert.equal(f.wheel(100, { target: reader }).defaultPrevented, false);
  assert.equal(f.wheel(100, { ctrlKey: true }).defaultPrevented, false);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('one vertical swipe advances once and form keys keep their own behavior', () => {
  const f = fixture();
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] }).defaultPrevented,
    true,
  );
  f.tick(1000);
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 200 }] });
  f.tick(1000);
  assert.equal(f.win.scrollY, 757);
  const input = f.reader();
  input.interactive = true;
  assert.equal(f.event('keydown', { key: 'ArrowDown', target: input }).defaultPrevented, false);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});
