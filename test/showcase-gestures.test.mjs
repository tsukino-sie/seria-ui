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
function fixture({
  compact = false,
  sections = [64, 821, 1578].map((top) => ({ top, bottom: top + 757 })),
} = {}) {
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
    matchMedia: (query) => ({ matches: query === '(max-width: 1000px)' && compact }),
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
    documentElement: { scrollHeight: sections.at(-1)?.bottom ?? 821, dataset: {} },
    querySelector: (selector) =>
      selector === '.studio-header' ? { getBoundingClientRect: () => ({ height: 64 }) } : null,
    querySelectorAll: () =>
      sections.map(({ top, bottom }) => ({
        getBoundingClientRect: () => ({ top: top - win.scrollY, bottom: bottom - win.scrollY }),
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
      cancelable: true,
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
    doc,
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

test('a deliberate edge gesture starts once and momentum cannot skip two sections', () => {
  const f = fixture();
  assert.equal(f.wheel(60).defaultPrevented, true);
  assert.equal(f.frames.size, 1);
  for (let i = 0; i < 10; i++) {
    f.tick(100);
    f.wheel(20);
  }
  assert.equal(f.win.scrollY, 757);
  assert.equal(f.frames.size, 0);
  f.tick(300);
  f.wheel(60);
  f.tick(1000);
  assert.equal(f.win.scrollY, 1514);
  f.cleanup();
});

test('even a one-pixel reverse input immediately cancels movement without a rebound', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(400);
  assert.ok(f.win.scrollY > 0 && f.win.scrollY < 757);
  assert.equal(f.wheel(-1).defaultPrevented, false);
  assert.equal(f.frames.size, 0);
  f.win.scrollY -= 1;
  f.tick(20);
  assert.equal(f.wheel(1).defaultPrevented, false);
  f.tick(20);
  assert.equal(f.wheel(-60).defaultPrevented, false);
  f.win.scrollY -= 60;
  const nativePosition = f.win.scrollY;
  f.tick(1000);
  assert.equal(f.win.scrollY, nativePosition);
  f.cleanup();
});

test('small edge input remains native until a deliberate gesture is established', () => {
  const f = fixture();
  assert.equal(f.wheel(10).defaultPrevented, false);
  f.win.scrollY = 10;
  assert.equal(f.wheel(15).defaultPrevented, false);
  f.win.scrollY = 25;
  assert.equal(f.frames.size, 0);
  assert.equal(f.wheel(15).defaultPrevented, true);
  f.tick(1000);
  assert.equal(f.win.scrollY, 757);
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

test('touch scrolling is native and interrupts automatic section movement', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(400);
  const interrupted = f.win.scrollY;
  assert.ok(interrupted > 0 && interrupted < 757);
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] }).defaultPrevented,
    false,
  );
  f.tick(1000);
  assert.equal(f.win.scrollY, interrupted);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

const mobileSections = [
  { top: 64, bottom: 1664 },
  { top: 1664, bottom: 2421 },
];

test('compact screens allow native movement within long sections', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  for (const scrollY of [100, 350, 600, 800]) {
    // Model the browser's native scroll position without implementing its physics.
    f.win.scrollY = scrollY;
    f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
    assert.equal(
      f.event('touchmove', { touches: [{ clientX: 100, clientY: 150 }] }).defaultPrevented,
      false,
    );
    assert.equal(f.wheel(100).defaultPrevented, false);
    assert.equal(f.wheel(-100).defaultPrevented, false);
    assert.equal(f.event('keydown', { key: 'PageDown' }).defaultPrevented, false);
    f.tick(2000);
    assert.equal(f.win.scrollY, scrollY);
    assert.equal(f.frames.size, 0);
  }
  const reader = f.reader();
  reader.scrollTop = 200;
  assert.equal(f.wheel(100, { target: reader }).defaultPrevented, false);
  f.cleanup();
});

test('a new outward swipe at the edge advances one section and clears its motion state', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 843;
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] }).defaultPrevented,
    true,
  );
  assert.equal(f.doc.documentElement.dataset.sectionMotion, 'moving');
  f.tick(1000);
  assert.equal(f.win.scrollY, 1600);
  assert.equal(f.doc.documentElement.dataset.sectionMotion, undefined);
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 100 }] });
  assert.equal(f.frames.size, 0);
  f.event('touchend');
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 340 }] });
  f.tick(1000);
  assert.equal(f.win.scrollY, 843);
  f.cleanup();
});

test('reading gestures stay native until release, even when reaching the section edge', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 350;
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] }).defaultPrevented,
    false,
  );
  f.win.scrollY = 843;
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 100 }] }).defaultPrevented,
    false,
  );
  assert.equal(f.frames.size, 0);
  f.event('touchend');
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] });
  f.tick(1000);
  assert.equal(f.win.scrollY, 1600);
  f.cleanup();
});

test('mobile nested readers, horizontal gestures and pinch zoom do not change sections', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 843;
  const reader = f.reader();
  reader.style.overscrollBehaviorY = 'contain';
  reader.scrollTop = 600;
  const swipe = (target, touches) => {
    f.event('touchstart', { target, touches: [{ clientX: 100, clientY: 300 }] });
    return f.event('touchmove', { target, touches });
  };
  assert.equal(swipe(reader, [{ clientX: 100, clientY: 260 }]).defaultPrevented, false);
  assert.equal(swipe(f.body, [{ clientX: 40, clientY: 290 }]).defaultPrevented, false);
  assert.equal(
    swipe(f.body, [
      { clientX: 100, clientY: 260 },
      { clientX: 200, clientY: 260 },
    ]).defaultPrevented,
    false,
  );
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('mobile wheel and keyboard advance at boundaries and leave long content native', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 350;
  assert.equal(f.wheel(100).defaultPrevented, false);
  assert.equal(f.event('keydown', { key: 'PageDown' }).defaultPrevented, false);
  f.win.scrollY = 843;
  f.tick(300);
  assert.equal(f.wheel(60).defaultPrevented, true);
  f.tick(1000);
  assert.equal(f.win.scrollY, 1600);
  assert.equal(f.event('keydown', { key: 'PageUp' }).defaultPrevented, true);
  f.tick(1000);
  assert.equal(f.win.scrollY, 843);
  f.cleanup();
});

test('compact screens retain smooth navigation links and native input can cancel them', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  const anchor = f.reader();
  anchor.interactive = true;
  anchor.getAttribute = () => '#';
  f.win.scrollY = 350;
  assert.equal(f.event('click', { target: anchor }).defaultPrevented, true);
  assert.equal(f.frames.size, 1);
  f.tick(1000);
  assert.equal(f.win.scrollY, 0);
  f.win.scrollY = 350;
  f.event('click', { target: anchor });
  f.tick(400);
  const interrupted = f.win.scrollY;
  assert.equal(f.wheel(10).defaultPrevented, false);
  f.tick(1000);
  assert.equal(f.win.scrollY, interrupted);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('form keys keep their own behavior', () => {
  const f = fixture();
  const input = f.reader();
  input.interactive = true;
  assert.equal(f.event('keydown', { key: 'ArrowDown', target: input }).defaultPrevented, false);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('desktop reading remains native for a whole gesture, including when it reaches the edge', () => {
  const f = fixture({ sections: mobileSections });
  f.win.scrollY = 350;
  assert.equal(f.wheel(100).defaultPrevented, false);
  f.win.scrollY = 843;
  assert.equal(f.wheel(100).defaultPrevented, false);
  assert.equal(f.frames.size, 0);
  f.tick(300);
  assert.equal(f.wheel(60).defaultPrevented, true);
  f.tick(1000);
  assert.equal(f.win.scrollY, 1600);
  f.cleanup();
});

test('arrow keys and a scrollbar drag cancel immediately without later correction', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(400);
  assert.equal(f.event('keydown', { key: 'ArrowUp' }).defaultPrevented, false);
  f.win.scrollY -= 40;
  const arrowPosition = f.win.scrollY;
  f.tick(1500);
  assert.equal(f.win.scrollY, arrowPosition);
  assert.equal(f.frames.size, 0);
  f.win.scrollY = 0;
  f.wheel(100);
  f.tick(400);
  f.event('pointerdown');
  f.win.scrollY = 1100;
  f.tick(1500);
  assert.equal(f.win.scrollY, 1100);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('a fresh wheel gesture during a transition takes control instead of queuing another move', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(400);
  assert.equal(f.wheel(10).defaultPrevented, false);
  const interrupted = f.win.scrollY;
  f.tick(1500);
  assert.equal(f.win.scrollY, interrupted);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('native scrollbar movement without a pointer event is never overwritten by the next frame', () => {
  const f = fixture();
  f.wheel(100);
  f.tick(300);
  f.win.scrollY = 1100;
  f.tick(16);
  assert.equal(f.win.scrollY, 1100);
  assert.equal(f.frames.size, 0);
  assert.equal(f.doc.documentElement.dataset.sectionMotion, undefined);
  f.tick(1500);
  assert.equal(f.win.scrollY, 1100);
  f.cleanup();
});

test('reversing the finger within the same swipe stops the animation without another jump', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 843;
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] });
  f.tick(300);
  const interrupted = f.win.scrollY;
  assert.equal(
    f.event('touchmove', { touches: [{ clientX: 100, clientY: 280 }] }).defaultPrevented,
    false,
  );
  f.tick(1500);
  assert.equal(f.win.scrollY, interrupted);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});

test('a browser-cancelled touch never leaves an automatic movement running', () => {
  const f = fixture({ compact: true, sections: mobileSections });
  f.win.scrollY = 843;
  f.event('touchstart', { touches: [{ clientX: 100, clientY: 300 }] });
  f.event('touchmove', { touches: [{ clientX: 100, clientY: 260 }] });
  f.tick(300);
  f.event('touchcancel');
  const stopped = f.win.scrollY;
  f.tick(1500);
  assert.equal(f.win.scrollY, stopped);
  assert.equal(f.frames.size, 0);
  f.cleanup();
});
