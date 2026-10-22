import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createElement as h } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { Hero, PageSection, MediaFrame } from '../dist/index.js';

test('compositions preserve caller content, heading hierarchy and image descriptions', () => {
  const html = renderToStaticMarkup(
    h(Hero, {
      headingLevel: 3,
      layout: 'split',
      align: 'start',
      tone: 'transparent',
      title: h('span', { className: 'existing-brand' }, '내 서비스'),
      description: '기존 안내 문구',
      actions: h('a', { href: '/messages' }, '문자 보기'),
      visual: h(
        MediaFrame,
        { caption: '원래 이미지 설명' },
        h('img', { src: '/my-photo.png', alt: '내 사진' }),
      ),
    }),
  );
  assert.match(html, /<h3><span class="existing-brand">내 서비스<\/span><\/h3>/);
  assert.match(html, /href="\/messages"/);
  assert.match(html, /alt="내 사진"/);
  assert.match(html, /<figcaption>원래 이미지 설명<\/figcaption>/);
  assert.equal((html.match(/<a /g) || []).length, 1);
});

test('repeated titled sections have distinct accessible names without forcing a surface', () => {
  const html = renderToStaticMarkup(
    h(
      'main',
      null,
      h(PageSection, { title: '첫 구역' }, '첫 내용'),
      h(PageSection, { title: '다음 구역', headingLevel: 3 }, '다음 내용'),
    ),
  );
  const names = [...html.matchAll(/aria-labelledby="([^"]+)"/g)].map((match) => match[1]);
  assert.equal(names.length, 2);
  assert.notEqual(names[0], names[1]);
  for (const name of names) assert.ok(html.includes(`id="${name}"`));
  assert.ok(!html.includes('pui-surface'));
});
