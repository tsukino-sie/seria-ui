import { readFileSync } from 'node:fs';
const css = readFileSync(new URL('./src/tokens.css', import.meta.url), 'utf8');
const start = css.indexOf(':root.dark'),
  maps = [css.slice(0, start), css.slice(start, css.indexOf('\n}', start))].map((s) =>
    Object.fromEntries([...s.matchAll(/--pui-([\w-]+):\s*(#[\da-f]+)/gi)].map((m) => [m[1], m[2]])),
  );
function rgb(hex) {
  const raw = hex.slice(1),
    s = raw.length === 3 ? [...raw].map((c) => c + c).join('') : raw;
  return [0, 2, 4].map((i) => parseInt(s.slice(i, i + 2), 16));
}
function luminance(values) {
  return values
    .map((n) => {
      const s = n / 255;
      return s <= 0.04045 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
    })
    .reduce((n, v, i) => n + v * [0.2126, 0.7152, 0.0722][i], 0);
}
function contrast(a, b) {
  const x = luminance(rgb(a)),
    y = luminance(rgb(b));
  return (Math.max(x, y) + 0.05) / (Math.min(x, y) + 0.05);
}
let failures = 0;
for (const [i, map] of maps.entries())
  for (const [fg, bg, min] of [
    ['ink', 'panel', 7],
    ['muted', 'panel', 4.5],
    ['muted', 'bg', 4.5],
    ['muted', 'accent-soft', 4.5],
    ['muted', 'inset', 4.5],
    ['accent-ink', 'accent-soft', 4.5],
    ['success', 'success-bg', 4.5],
    ['warning', 'warning-bg', 4.5],
    ['danger', 'danger-bg', 4.5],
    ['control-line', 'panel', 3],
  ]) {
    const ratio = contrast(map[fg], map[bg]);
    console.log(
      `${i ? 'dark' : 'light'} ${fg}/${bg}: ${ratio.toFixed(2)} ${ratio >= min ? 'PASS' : 'FAIL'}`,
    );
    if (ratio < min) failures++;
  }
for (const [i, map] of maps.entries())
  for (const surface of ['glass-soft', 'glass-clear']) {
    const color = map[surface],
      alpha = parseInt(color.slice(7, 9), 16) / 255,
      under = i ? 255 : 0;
    const mixed =
      '#' +
      rgb(color)
        .map((c) =>
          Math.round(c * alpha + under * (1 - alpha))
            .toString(16)
            .padStart(2, '0'),
        )
        .join('');
    const ratio = contrast(map.muted, mixed);
    console.log(
      `${i ? 'dark' : 'light'} muted/${surface} worst background: ${ratio.toFixed(2)} ${ratio >= 4.5 ? 'PASS' : 'FAIL'}`,
    );
    if (ratio < 4.5) failures++;
  }
process.exitCode = failures ? 1 : 0;
