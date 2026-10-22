import assert from 'node:assert/strict';
import { test } from 'node:test';
import { readFileSync } from 'node:fs';
import ts from 'typescript';

const source = readFileSync(new URL('../showcase/sectionPosition.ts', import.meta.url), 'utf8');
const { outputText } = ts.transpileModule(source, {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
});
const { sectionDestination, sectionEase } = await import(
  `data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`
);

const sections = [
  { top: 64, bottom: 900 },
  { top: 900, bottom: 1736 },
  { top: 1736, bottom: 3400 },
  { top: 3400, bottom: 4236 },
];
const destination = (position) => sectionDestination(position, sections, 900, 64, 3336);

test('section settling is local and leaves the middle of tall content readable', () => {
  assert.equal(destination(700), 836);
  assert.equal(destination(1000), 836);
  assert.equal(destination(400), null);
  assert.equal(destination(2050), null);
  assert.equal(destination(2380), 2500);
  assert.equal(destination(3336), null);
  assert.equal(sectionDestination(120, [], 900, 64, 2000), null);
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
