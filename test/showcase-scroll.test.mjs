import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../src/sectionPosition.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const { sectionBoundaryDestination, sectionDestination, sectionEase } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const sections = [
  { top: 64, bottom: 900 },
  { top: 900, bottom: 1736 },
  { top: 1736, bottom: 3400 },
  { top: 3400, bottom: 4236 },
];
const destination = (position, direction = 1) =>
  sectionDestination(position, sections, 900, 64, 3336, direction);

test('mobile boundaries leave every interior position freely readable', () => {
  for (const position of [1700, 1800, 2050, 2400, 2480]) {
    assert.equal(sectionBoundaryDestination(position, sections, 900, 64, 3336, 1), null);
    assert.equal(sectionBoundaryDestination(position, sections, 900, 64, 3336, -1), null);
  }
  assert.equal(sectionBoundaryDestination(2500, sections, 900, 64, 3336, 1), 3336);
  assert.equal(sectionBoundaryDestination(3336, sections, 900, 64, 3336, -1), 2500);
  assert.equal(sectionBoundaryDestination(0, sections, 900, 64, 3336, -1), null);
  assert.equal(sectionBoundaryDestination(3336, sections, 900, 64, 3336, 1), null);
  assert.equal(sectionBoundaryDestination(0, [], 900, 64, 3336, 1), null);
});

test('boundary transitions never move against the requested direction, including resized sections', () => {
  for (const viewport of [700, 900, 1100]) {
    for (let y = 0; y <= 3336; y += 5) {
      for (const direction of [-1, 1]) {
        const target = sectionBoundaryDestination(y, sections, viewport, 64, 3336, direction);
        assert.ok(target === null || direction * (target - y) > 0);
      }
    }
  }
});

test('boundary gaps respond in both directions without requiring an exact edge position', () => {
  assert.equal(sectionBoundaryDestination(500, sections, 900, 64, 3336, 1), 836);
  assert.equal(sectionBoundaryDestination(500, sections, 900, 64, 3336, -1), 0);
  assert.equal(sectionBoundaryDestination(2800, sections, 900, 64, 3336, 1), 3336);
  assert.equal(sectionBoundaryDestination(2800, sections, 900, 64, 3336, -1), 2500);
});

test('a small forward gesture never returns to the section it came from', () => {
  assert.equal(destination(1), 836);
  assert.equal(destination(700), 836);
  assert.equal(destination(400), 836);
  assert.equal(destination(1000), 1672);
  assert.equal(destination(1000, -1), 836);
  assert.equal(destination(400, -1), 0);
  assert.equal(destination(0, -1), null);
});

test('long sections advance through readable viewport-sized portions', () => {
  assert.equal(destination(1672), 2500);
  assert.equal(destination(2050), 2500);
  assert.equal(destination(2380), 2500);
  assert.equal(destination(2500, -1), 1672);
  assert.equal(destination(3336), null);
  assert.equal(sectionDestination(120, [], 900, 64, 2000, 1), null);
});

test('small mobile overflow does not require another gesture for a few pixels', () => {
  assert.equal(
    sectionDestination(
      0,
      [
        { top: 64, bottom: 852 },
        { top: 852, bottom: 1632 },
      ],
      844,
      64,
      788,
      1,
    ),
    788,
  );
});

test('section motion approaches both ends gently without reversing or overshooting', () => {
  const values = Array.from({ length: 101 }, (_, index) => sectionEase(index / 100));
  assert.equal(sectionEase(-1), 0);
  assert.equal(sectionEase(2), 1);
  assert.ok(
    values.every(
      (value, index) => value >= 0 && value <= 1 && (!index || value >= values[index - 1]),
    ),
  );
  assert.ok(sectionEase(0.05) < 0.002);
  assert.ok(1 - sectionEase(0.95) < 0.002);
});
