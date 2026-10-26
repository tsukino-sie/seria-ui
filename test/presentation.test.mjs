import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Presentation, BrowserFrame, CodeExample } from '../dist/index.js';

test('a presentation preserves caller headings, actions and a single independently readable frame', () => {
  const html = renderToStaticMarkup(
    h(
      Presentation,
      {
        heading: h('h1', null, '기존 제목'),
        headerOffset: '64px',
        controls: h('button', { type: 'button' }, '재생'),
        actions: h('a', { href: '#start' }, '시작'),
      },
      h(
        BrowserFrame,
        { label: '원래 프로젝트', viewportLabel: '내 내용', height: '30rem' },
        h('img', { src: '/original.png', alt: '원래 이미지' }),
      ),
    ),
  );
  assert.match(html, /<h1>기존 제목<\/h1>/);
  assert.match(html, /role="region" aria-label="내 내용" tabindex="0"/);
  assert.match(html, /src="\/original.png" alt="원래 이미지"/);
  assert.equal((html.match(/class="pui-browser-frame/g) ?? []).length, 1);
  assert.ok(html.indexOf('pui-presentation-footer') > html.indexOf('원래 이미지'));
  assert.match(html, /href="#start"/);
  assert.ok(!/font-family|font-face/.test(html));
});

test('each explained code sample connects its own note and escapes caller code', () => {
  const html = renderToStaticMarkup(
    h(
      'div',
      null,
      h(CodeExample, { inline: true, description: '간격 조절' }, '<Stack gap={6} />'),
      h(CodeExample, { description: '내 서비스 코드' }, '<script>example</script>'),
    ),
  );
  const ids = [...html.matchAll(/aria-describedby="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(ids.length, 2);
  assert.notEqual(ids[0], ids[1]);
  ids.forEach((id) => assert.ok(html.includes(`id="${id}"`)));
  assert.ok(html.includes('&lt;script&gt;'));
  assert.ok(!html.includes('<script>'));
  assert.match(html, /<pre tabindex="0">/);
});

test('tag roles and setting explanations are both connected to the displayed code', () => {
  const html = renderToStaticMarkup(
    h(
      CodeExample,
      {
        inline: true,
        description: 'gap は項目の間隔です。',
        annotations: [{ name: '<Stack>', description: '内容を縦に並べるレイアウトです。' }],
      },
      '<Stack gap={6} />',
    ),
  );
  const ids = html.match(/aria-describedby="([^"]+)"/)[1].split(' ');
  assert.equal(ids.length, 2);
  ids.forEach((id) => assert.ok(html.includes(`id="${id}"`)));
  assert.match(html, /<dl[^>]*>/);
  assert.match(html, /<dt><code>&lt;Stack&gt;<\/code><\/dt>/);
  assert.match(html, /<dd>内容を縦に並べるレイアウトです。<\/dd>/);
});
