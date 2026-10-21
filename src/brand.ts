/* Seria UI · Copyright (c) 2026 Sie · See LICENSE. */
import type { CSSProperties } from 'react';

type RGB = readonly [number, number, number];

function parse(value: string): RGB {
  const text = value.replace(/^#/, '');
  if (!/^(?:[\da-f]{3}|[\da-f]{6})$/i.test(text)) {
    throw new TypeError('강조색은 #RGB 또는 #RRGGBB 형식으로 입력해 주세요.');
  }
  const expanded = text.length === 3 ? [...text].map((c) => c + c).join('') : text;
  return [0, 2, 4].map((i) => parseInt(expanded.slice(i, i + 2), 16)) as unknown as RGB;
}

function hex(value: RGB) {
  return '#' + value.map((n) => Math.round(n).toString(16).padStart(2, '0')).join('');
}

function mix(a: RGB, b: RGB, amount: number): RGB {
  return a.map((v, i) => Math.round(v + (b[i] - v) * amount)) as unknown as RGB;
}

function luminance(value: RGB) {
  return value
    .map((n) => {
      const s = n / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    })
    .reduce((sum, v, i) => sum + v * [0.2126, 0.7152, 0.0722][i], 0);
}

function contrast(a: RGB, b: RGB) {
  const x = luminance(a),
    y = luminance(b);
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}

/** Derive accent pairs for the default light and dark surfaces. */
export function createAccentTokens(accent: string, mode: 'light' | 'dark'): CSSProperties {
  const color = parse(accent),
    dark = parse('#10242f'),
    white = parse('#fff');
  const readableDark =
    Math.max(contrast(color, dark), contrast(color, white)) >= 4.5 ? dark : parse('#000');
  const onAccent = contrast(color, readableDark) >= contrast(color, white) ? readableDark : white;
  const soft = mix(
    parse(mode === 'dark' ? '#202f39' : '#edf2f4'),
    color,
    mode === 'dark' ? 0.2 : 0.07,
  );
  const target = parse(mode === 'dark' ? '#edf4f8' : '#203641');
  let ink = color;
  for (let step = 1; contrast(ink, soft) < 4.5 && step <= 20; step++) {
    ink = mix(color, target, step / 20);
  }
  return {
    '--pui-accent': hex(color),
    '--pui-on-accent': hex(onAccent),
    '--pui-accent-hover': hex(mix(color, onAccent === white ? parse('#000') : white, 0.1)),
    '--pui-accent-soft': hex(soft),
    '--pui-accent-ink': hex(ink),
  } as CSSProperties;
}
