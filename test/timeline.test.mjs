import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';
import ts from 'typescript';

// A deterministic hook clock, like the section gesture fixture. Browser QA covers layout.
function fixture(name, options, reduced = false) {
  const source = ts.transpileModule(
    readFileSync(new URL(`../src/${name}.ts`, import.meta.url), 'utf8'),
    {
      compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.CommonJS },
    },
  ).outputText;
  const slots = [],
    timers = new Map(),
    events = new Map();
  let cursor = 0,
    dirty = true,
    pending = [],
    value,
    clock = 0,
    timerId = 0,
    observer;
  let args = options;
  const changed = (a, b) =>
    !a || a.length !== b.length || a.some((item, i) => !Object.is(item, b[i]));
  const effect = (callback, dependencies) => {
    const i = cursor++;
    if (changed(slots[i]?.dependencies, dependencies)) {
      pending.push(() => {
        slots[i]?.cleanup?.();
        slots[i] = { dependencies, cleanup: callback() };
      });
    }
  };
  const react = {
    useCallback: (callback, dependencies) => {
      const i = cursor++;
      if (changed(slots[i]?.dependencies, dependencies)) slots[i] = { dependencies, callback };
      return slots[i].callback;
    },
    useRef: (initial) => {
      const i = cursor++;
      return (slots[i] ??= { current: initial });
    },
    useState: (initial) => {
      const i = cursor++;
      if (!(i in slots)) slots[i] = typeof initial === 'function' ? initial() : initial;
      return [
        slots[i],
        (next) => {
          const updated = typeof next === 'function' ? next(slots[i]) : next;
          if (!Object.is(updated, slots[i])) {
            slots[i] = updated;
            dirty = true;
          }
        },
      ];
    },
    useEffect: effect,
    useLayoutEffect: effect,
  };
  const media = {
    matches: reduced,
    addEventListener: (type, fn) => events.set('motion', fn),
    removeEventListener: () => events.delete('motion'),
  };
  const document = {
    hidden: false,
    addEventListener: (type, fn) => events.set(type, fn),
    removeEventListener: (type) => events.delete(type),
  };
  const addTimer = (fn, delay, repeat = false) => {
    const id = ++timerId;
    timers.set(id, { fn, delay, at: clock + delay, repeat });
    return id;
  };
  const window = {
    matchMedia: () => media,
    setInterval: (fn, delay) => addTimer(fn, delay, true),
    clearInterval: (id) => timers.delete(id),
    setTimeout: (fn, delay) => addTimer(fn, delay),
    clearTimeout: (id) => timers.delete(id),
  };
  class IntersectionObserver {
    constructor(fn) {
      observer = fn;
    }
    observe() {}
    disconnect() {}
  }
  const context = {
    exports: {},
    require: () => react,
    window,
    document,
    IntersectionObserver,
    performance: { now: () => clock },
  };
  vm.runInNewContext(source, context);
  const flush = () => {
    for (let limit = 0; dirty; limit++) {
      assert.ok(limit < 30, 'hook must settle');
      dirty = false;
      cursor = 0;
      pending = [];
      value = context.exports[name](args);
      pending.forEach((fn) => fn());
    }
    return value;
  };
  flush();
  return {
    get value() {
      return flush();
    },
    update(next) {
      args = next;
      dirty = true;
      return flush();
    },
    tick(ms) {
      flush();
      const until = clock + ms;
      while (true) {
        const next = [...timers.entries()]
          .filter(([, timer]) => timer.at <= until)
          .sort((a, b) => a[1].at - b[1].at)[0];
        if (!next) break;
        const [id, timer] = next;
        clock = timer.at;
        if (timer.repeat) timer.at += timer.delay;
        else timers.delete(id);
        timer.fn();
        flush();
      }
      clock = until;
      return flush();
    },
    visible(visible) {
      document.hidden = !visible;
      events.get('visibilitychange')?.();
      return flush();
    },
    inView(visible) {
      observer?.([{ isIntersecting: visible }]);
      return flush();
    },
    dispose() {
      slots.forEach((slot) => slot?.cleanup?.());
      assert.equal(timers.size, 0);
    },
  };
}
const items = [
  { id: 'one', label: '하나' },
  { id: 'two', label: '둘' },
];

test('playback runs once, retains its final frame, then explicitly replays', () => {
  const f = fixture('usePlayback', { items, duration: 160, autoPlay: true });
  assert.equal(f.value.activeId, 'one');
  f.tick(160);
  assert.equal(f.value.activeId, 'two');
  f.tick(160);
  assert.equal(f.value.completed, true);
  assert.equal(f.value.progress, 1);
  f.tick(1000);
  assert.equal(f.value.activeId, 'two');
  assert.equal(f.value.playing, false);
  f.value.replay();
  assert.equal(f.value.activeId, 'one');
  assert.equal(f.value.progress, 0);
  assert.equal(f.value.completed, false);
  assert.equal(f.value.running, true);
  f.dispose();
});

test('hidden tabs, offscreen regions and control exploration preserve elapsed reading time', () => {
  const f = fixture('usePlayback', { items, duration: 800, autoPlay: true });
  f.tick(160);
  const before = f.value.progress;
  f.visible(false);
  f.tick(1600);
  assert.equal(f.value.progress, before);
  f.visible(true);
  f.inView(false);
  f.tick(1600);
  assert.equal(f.value.progress, before);
  f.inView(true);
  f.value.setInteracting(true);
  f.tick(1600);
  assert.equal(f.value.progress, before);
  f.value.setInteracting(false);
  f.tick(160);
  assert.equal(f.value.progress, before + 0.2);
  f.dispose();
});

test('selection resets completion and changed or empty chapter lists cannot leave a stale id', () => {
  const f = fixture('usePlayback', { items, duration: 160, autoPlay: true });
  f.tick(320);
  f.value.select('one');
  assert.equal(f.value.completed, false);
  assert.equal(f.value.playing, false);
  f.value.select('unknown');
  assert.equal(f.value.activeId, 'one');
  f.update({ items: [{ id: 'replacement', label: '새 내용' }] });
  assert.equal(f.value.activeId, 'replacement');
  f.update({ items: [] });
  assert.equal(f.value.activeId, '');
  assert.equal(f.value.running, false);
  f.dispose();
});

test('reduced motion suppresses auto start while manual playback is available', () => {
  const f = fixture('usePlayback', { items, autoPlay: true, initialProgress: 0.58 }, true);
  assert.equal(f.value.playing, false);
  assert.equal(f.value.progress, 0.58);
  f.value.setPlaying(true);
  assert.equal(f.value.running, true);
  f.tick(80);
  assert.ok(f.value.progress > 0.58);
  f.dispose();
});

test('rapid caption choices cancel stale text and retain the chosen travel direction', () => {
  const f = fixture('useSceneTransition', 0);
  f.update(1);
  f.tick(100);
  f.update(2);
  f.tick(300);
  assert.equal(f.value.presentedIndex, 0);
  assert.equal(f.value.leaving, true);
  f.tick(60);
  assert.equal(f.value.presentedIndex, 2);
  assert.equal(f.value.leaving, false);
  f.update(1);
  assert.equal(f.value.direction, 'backward');
  f.tick(360);
  assert.equal(f.value.presentedIndex, 1);
  f.dispose();
});
