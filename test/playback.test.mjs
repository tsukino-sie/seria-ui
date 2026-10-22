import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PlaybackControls } from '../dist/index.js';

const props = {
  items: [
    { id: 'intro', label: '시작' },
    { id: 'layout', label: '구성', disabled: true },
    { id: 'style', label: '스타일' },
  ],
  activeId: 'intro',
  playing: false,
  onActiveChange() {},
  onPlayingChange() {},
};
const render = (overrides) =>
  renderToStaticMarkup(createElement(PlaybackControls, { ...props, ...overrides }));

test('controls can be embedded in a form without implicit submit buttons', () => {
  const html = render({});
  const buttons = html.match(/<button\b[^>]*>/g);
  assert.equal(buttons.length, 4);
  assert.ok(buttons.every((button) => button.includes('type="button"')));
  assert.equal(buttons.filter((button) => button.includes('disabled=""')).length, 1);
  assert.equal((html.match(/aria-current="step"/g) ?? []).length, 1);
});

test('host progress cannot overfill the track or produce invalid CSS transforms', () => {
  for (const [progress, expected] of [
    [-5, 0],
    [0.35, 0.35],
    [6, 1],
    [NaN, 0],
    [Infinity, 0],
  ]) {
    assert.ok(render({ progress }).includes(`scaleX(${expected})`));
  }
});

test('empty and stale chapter lists remain usable and labels can be localized', () => {
  assert.equal(render({ items: [] }), '');
  const html = render({
    activeId: 'removed',
    labels: { play: 'Play', goTo: (label) => `Go to ${label}` },
  });
  assert.ok(html.includes('aria-label="Play"'));
  assert.ok(html.includes('aria-current="step" aria-label="Go to 시작"'));
  const allDisabled = render({ items: props.items.map((item) => ({ ...item, disabled: true })) });
  assert.equal((allDisabled.match(/disabled=""/g) ?? []).length, 4);
});
