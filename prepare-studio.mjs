import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

/** Package the production source, not a second implementation of the Studio. */
export function prepareStudio({ root, work, downloads, version, packageFilename, starterPackage }) {
  const studio = path.join(work, 'seria-studio');
  const write = (file, content) => {
    const target = path.join(studio, file);
    mkdirSync(path.dirname(target), { recursive: true });
    writeFileSync(target, content);
  };
  const copy = (from, to) => {
    const target = path.join(studio, to);
    mkdirSync(path.dirname(target), { recursive: true });
    cpSync(path.join(root, from), target, { recursive: true });
  };
  for (const file of readdirSync(path.join(root, 'showcase'))) {
    if (
      !/\.(tsx?|css)$/.test(file) ||
      ['vite.config.ts', 'compatibility.tsx', 'sectionPosition.ts'].includes(file)
    )
      continue;
    copy(`showcase/${file}`, `src/showcase/${file}`);
  }
  for (const file of readdirSync(path.join(root, 'examples')))
    copy(`examples/${file}`, `src/examples/${file}`);
  // Only the entry's wiring changes. App and every UI/layout source stay identical.
  write(
    'src/showcase/main.tsx',
    readFileSync(path.join(root, 'showcase/main.tsx'), 'utf8')
      .replace("'../src/styles.css'", "'seria-ui/styles.css'")
      .replace(
        '<App />',
        '<App downloadBase="https://seria-ui-studio.honey-puppy-6755.chatgpt.site/downloads" />',
      ),
  );
  copy('showcase/public/images', 'public/images');
  copy('docs', 'docs');
  for (const file of [
    'LICENSE',
    'NOTICE',
    'THIRD-PARTY-NOTICES.md',
    'DESIGN-REFERENCES.md',
    packageFilename,
  ])
    copy(file, file);
  write(
    'package.json',
    JSON.stringify({ ...starterPackage, name: 'my-seria-studio' }, null, 2) + '\n',
  );
  write(
    'tsconfig.json',
    JSON.stringify(
      {
        compilerOptions: {
          target: 'ES2022',
          lib: ['ES2022', 'DOM', 'DOM.Iterable'],
          module: 'ESNext',
          moduleResolution: 'Bundler',
          jsx: 'react-jsx',
          strict: true,
          noEmit: true,
          skipLibCheck: true,
          esModuleInterop: true,
          types: ['vite/client'],
        },
        include: ['src'],
      },
      null,
      2,
    ) + '\n',
  );
  write(
    'vite.config.ts',
    "import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n",
  );
  write(
    'index.html',
    readFileSync(path.join(root, 'showcase/index.html'), 'utf8').replace(
      'src="/main.tsx"',
      'src="/src/showcase/main.tsx"',
    ),
  );
  write(
    'README.md',
    `# Seria UI ${version} · 전체 소개 페이지 시작 프로젝트

현재 소개 페이지와 같은 원본으로 구성한 실행 프로젝트입니다. 축약한 예제가 아닙니다.

\`\`\`sh
npm install
npm run dev
\`\`\`

\`npm run build\`는 타입 검사와 배포 파일 생성을 실행합니다. Node.js 22.12 이상이 필요합니다.

- src/showcase/App.tsx: 상단 메뉴, 소개·플레이그라운드·재생 예시·원칙·시작·마무리의 전체 순서
- src/showcase/KeynoteHero.tsx: 장면 데이터, 자동 재생, 코드 설명, 아래쪽 재생부
- src/showcase/StudioPlayground.tsx: 모든 실시간 설정, 코드 복사·파일 저장, 반응형 미리보기
- src/showcase/studio.css: 현재 사이트와 같은 올리브 디자인·섹션 배경·반응형 레이아웃
- src/examples/: 네 가지 실제 예시, 공유 스타일과 선택적인 색상
- public/images/: 예제 이미지. 자신의 이미지로 바꿀 수 있습니다.
- docs/studio.md: 모든 구성 요소와 재사용 API, 적용 방법

자동 재생·설명 전환·배치 이동·섹션 이동·배율 계산은 설치된 seria-ui 패키지의 공개 API를 사용합니다.
src/ 별칭이나 원본 저장소 접근 없이 실행됩니다. 서버·특정 호스팅·비밀 키가 필요하지 않습니다.
다운로드 링크만 원래 소개 사이트를 가리킵니다. 자신의 파일을 배포하면 main.tsx의 downloadBase를 바꾸세요.

**Seria는 글꼴을 선택하거나 로드하지 않습니다.** 전체 페이지의 서체는 이 프로젝트가 소유한 studio.css 첫 줄에서 바꿉니다.
기존 페이지에는 전체 studio.css를 불러오지 말고 필요한 공개 컴포넌트와 docs/adoption.md를 사용하세요.
기존 이미지·문구·라우팅·저장 기능은 자신의 프로젝트에서 연결합니다.

원작자 Sie 표기를 유지하고 LICENSE, NOTICE와 외부 라이선스를 함께 보관하세요.
`,
  );
  const filename = `seria-ui-studio-${version}.tar.gz`;
  execFileSync('tar', [
    '--exclude=seria-studio/node_modules',
    '--exclude=seria-studio/dist',
    '--exclude=seria-studio/package-lock.json',
    '-czf',
    path.join(downloads, filename),
    '-C',
    work,
    'seria-studio',
  ]);
  return filename;
}
