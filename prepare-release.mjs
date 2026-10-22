import { readFileSync, writeFileSync, mkdirSync, copyFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import path from 'node:path';

const root = import.meta.dirname;
const pkg = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const lock = JSON.parse(readFileSync(path.join(root, 'package-lock.json'), 'utf8'));
const version = pkg.version;
if (!readFileSync(path.join(root, 'src/version.ts'), 'utf8').includes(`'${version}'`)) {
  throw new Error('package.json and SERIA_VERSION must match before packaging.');
}
if (!process.env.npm_execpath) throw new Error('Run npm run package:release.');
const packedOutput = execFileSync(process.execPath, [process.env.npm_execpath, 'pack', '--json'], {
  cwd: root,
  encoding: 'utf8',
  maxBuffer: 10 * 1024 * 1024,
});
const jsonStart = packedOutput.lastIndexOf('\n[');
const packed = JSON.parse(packedOutput.slice(jsonStart < 0 ? 0 : jsonStart + 1))[0];
const work = path.join(root, '.release', version);
const starter = path.join(work, 'seria-starter');
const downloads = path.join(root, 'showcase/public/downloads');
for (const folder of [
  starter,
  downloads,
  path.join(starter, 'src'),
  path.join(starter, 'public/images'),
])
  mkdirSync(folder, { recursive: true });
for (const file of [
  'StarterPage.tsx',
  'Spaces.tsx',
  'ComponentPage.tsx',
  'spaces.css',
  'theme.ts',
]) {
  copyFileSync(path.join(root, 'examples', file), path.join(starter, 'src', file));
}
copyFileSync(
  path.join(root, 'showcase/public/images/seria-space.png'),
  path.join(starter, 'public/images/seria-space.png'),
);
for (const file of ['LICENSE', 'NOTICE', 'THIRD-PARTY-NOTICES.md'])
  copyFileSync(path.join(root, file), path.join(starter, file));
copyFileSync(path.join(root, packed.filename), path.join(starter, packed.filename));
copyFileSync(path.join(root, packed.filename), path.join(downloads, packed.filename));
const installed = (name) => lock.packages[`node_modules/${name}`].version;
const starterPackage = {
  name: 'my-seria-page',
  version: '1.0.0',
  private: true,
  type: 'module',
  scripts: {
    dev: 'vite --host 127.0.0.1',
    build: 'tsc --noEmit && vite build',
    preview: 'vite preview --host 127.0.0.1',
  },
  dependencies: {
    'seria-ui': `file:./${packed.filename}`,
    react: installed('react'),
    'react-dom': installed('react-dom'),
    '@headlessui/react': installed('@headlessui/react'),
  },
  devDependencies: {
    '@types/react': installed('@types/react'),
    '@types/react-dom': installed('@types/react-dom'),
    typescript: installed('typescript'),
    vite: installed('vite'),
    '@vitejs/plugin-react': installed('@vitejs/plugin-react'),
  },
};
writeFileSync(path.join(starter, 'package.json'), JSON.stringify(starterPackage, null, 2) + '\n');
writeFileSync(
  path.join(starter, 'tsconfig.json'),
  JSON.stringify(
    {
      compilerOptions: {
        target: 'ES2022',
        lib: ['ES2022', 'DOM', 'DOM.Iterable'],
        module: 'ESNext',
        moduleResolution: 'Bundler',
        jsx: 'react-jsx',
        strict: true,
        skipLibCheck: true,
        types: ['vite/client'],
        noEmit: true,
      },
      include: ['src'],
    },
    null,
    2,
  ) + '\n',
);
writeFileSync(
  path.join(starter, 'vite.config.ts'),
  `import { defineConfig } from 'vite';\nimport react from '@vitejs/plugin-react';\nexport default defineConfig({ plugins: [react()] });\n`,
);
writeFileSync(
  path.join(starter, 'index.html'),
  `<!doctype html><html lang="ko"><head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width, initial-scale=1.0"/><title>My Seria Page</title><style>body{margin:0;font-family:system-ui,sans-serif}button,select,input{font:inherit}</style></head><body><div id="root"></div><script type="module" src="/src/main.tsx"></script></body></html>`,
);
writeFileSync(
  path.join(starter, 'src/main.tsx'),
  `import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { ThemeProvider, ThemePicker, PageSection, Cluster, Button } from 'seria-ui';
import 'seria-ui/styles.css';
import StarterPage, { type StarterPageProps } from './StarterPage';
import { exampleThemes } from './theme';
function App() {
  const [composition, setComposition] = useState<StarterPageProps['composition']>('intro');
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState('');
  return <ThemeProvider accent="#68783e" themes={exampleThemes} storageKey="my-seria-page">
    <PageSection spacing="compact" aria-label="예제 설정"><Cluster justify="between">
      <Cluster>{(['intro', 'journal', 'workspace', 'components'] as const).map((kind, index) => <Button key={kind} aria-pressed={composition === kind} onClick={() => setComposition(kind)}>{['서비스 소개', '콘텐츠·기록', '업무·도구', '컴포넌트'][index]}</Button>)}</Cluster>
      <ThemePicker />
    </Cluster><p role="status">{notice || '구성을 고르고 소스를 내 내용으로 바꿔보세요.'}</p></PageSection>
    <div className="example-backdrop" data-backdrop="light"><StarterPage composition={composition} saved={saved} onSave={() => setSaved(!saved)} onAction={() => setNotice('예제 동작입니다. 이 자리에 프로젝트의 이동·저장 기능을 연결하세요.')} /></div>
  </ThemeProvider>;
}
createRoot(document.getElementById('root')!).render(<App />);
`,
);
writeFileSync(
  path.join(starter, 'README.md'),
  `# Seria UI ${version} 시작 파일\n\n압축을 풀고 이 폴더에서:\n\n\`\`\`sh\nnpm install\nnpm run dev\n\`\`\`\n\n출력된 로컬 주소를 열어요. \`npm run build\`로 타입 검사와 배포 파일 생성을 실행해요.\n\n- src/StarterPage.tsx: 소개·콘텐츠·업무·컴포넌트 구성\n- src/Spaces.tsx, spaces.css: 편집 가능한 소개 예제와 스타일\n- src/theme.ts: 선택적인 예제 색상\n- public/images/seria-space.png: 예제용 AI 생성 이미지. 자신의 이미지로 바꿔주세요.\n- 서체는 index.html의 body에서 지정하며 Seria는 서체를 로드하지 않아요.\n- onAction/onSave에서 실제 이동·저장 동작을 연결하세요.\n- 기존 프로젝트 적용 방법: https://github.com/tsukino-sie/seria-ui/blob/main/docs/adoption.md\n\n원작자 Sie 표기를 유지해주세요. LICENSE와 NOTICE를 함께 보관하세요.\n`,
);
const starterName = `seria-ui-starter-${version}.tar.gz`;
execFileSync('tar', [
  '--exclude=seria-starter/node_modules',
  '--exclude=seria-starter/dist',
  '--exclude=seria-starter/package-lock.json',
  '-czf',
  path.join(downloads, starterName),
  '-C',
  work,
  'seria-starter',
]);
const hash = (file) =>
  createHash('sha256')
    .update(readFileSync(path.join(downloads, file)))
    .digest('hex');
const manifest = {
  version,
  package: packed.filename,
  packageSha256: hash(packed.filename),
  starter: starterName,
  starterSha256: hash(starterName),
};
writeFileSync(path.join(downloads, 'release.json'), JSON.stringify(manifest, null, 2) + '\n');
console.log(JSON.stringify(manifest, null, 2));
