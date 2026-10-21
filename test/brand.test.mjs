import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createAccentTokens } from '../dist/brand.js';

function luminance(hex) {
  const c = hex
    .slice(1)
    .match(/../g)
    .map((v) => parseInt(v, 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return c[0] * 0.2126 + c[1] * 0.7152 + c[2] * 0.0722;
}
function ratio(a, b) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

test('accent text remains readable in both themes, including extreme and mid-tone colors', () => {
  const colors = ['#000000', '#ffffff', '#6ccdee', '#794de8', '#19885b', '#ed886b', '#808080'];
  for (let n = 0; n < 256; n++)
    colors.push('#' + ((n * 65713) & 0xffffff).toString(16).padStart(6, '0'));
  for (const mode of ['light', 'dark'])
    for (const accent of colors) {
      const tokens = createAccentTokens(accent, mode);
      assert.ok(
        ratio(tokens['--pui-on-accent'], tokens['--pui-accent']) >= 4.5,
        accent + ' button',
      );
      assert.ok(
        ratio(tokens['--pui-on-accent'], tokens['--pui-accent-hover']) >= 4.5,
        accent + ' hover',
      );
      assert.ok(
        ratio(tokens['--pui-accent-ink'], tokens['--pui-accent-soft']) >= 4.5,
        accent + ' soft surface',
      );
    }
});
test('short hex colors are expanded and malformed CSS is rejected', () => {
  assert.equal(createAccentTokens('#ABC', 'light')['--pui-accent'], '#aabbcc');
  for (const invalid of ['red', '#12', '#zzzzzz', 'var(--color)', '#fff; color:red'])
    assert.throws(() => createAccentTokens(invalid, 'light'), TypeError);
});
