import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const context = { exports: {} };
vm.runInNewContext(
  ts.transpileModule(readFileSync(new URL('../showcase/codeGuide.ts', import.meta.url), 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText,
  context,
);
const { describeTags, describeFile } = context.exports;

test('source help identifies used tags once, preserves case and does not invent unknown API roles', () => {
  const notes = describeTags('<Stack><Hero/><button>実行</button><MyPrivateWidget/></Stack>');
  assert.deepEqual(
    Array.from(notes, (item) => item.name),
    ['<Stack>', '<Hero>', '<button>'],
  );
  assert.ok(notes.every((item) => item.description.length > 10));
  assert.equal(describeTags('color: var(--pui-accent);').length, 0);
});

test('the source viewer explains page wiring, editable page content and CSS separately', () => {
  assert.match(describeFile('main.tsx'), /앱 시작/);
  assert.match(describeFile('Spaces.tsx'), /제목·설명·사진/);
  assert.match(describeFile('spaces.css'), /CSS/);
  assert.match(describeFile('theme.ts'), /색상/);
});
