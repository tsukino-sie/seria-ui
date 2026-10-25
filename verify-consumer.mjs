import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import assert from 'node:assert/strict';
import path from 'node:path';

const root = import.meta.dirname;
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const prepared = path.join(root, '.release', version, 'seria-starter');
const { packageSha256, studio: studioName } = JSON.parse(
  readFileSync(path.join(root, 'showcase/public/downloads/release.json'), 'utf8'),
);
const consumerRoot = path.join(root, '.release', 'consumers', packageSha256.slice(0, 12));
const starter = path.join(consumerRoot, 'react19');
const files = [
  'src',
  'public',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  `seria-ui-${version}.tgz`,
  'package.json',
];
mkdirSync(starter, { recursive: true });
for (const file of files)
  cpSync(path.join(prepared, file), path.join(starter, file), { recursive: true });
const npm = (args, cwd) =>
  execFileSync(process.execPath, [process.env.npm_execpath, ...args], { cwd, stdio: 'inherit' });
if (!process.env.npm_execpath) throw new Error('Run npm run test:consumer.');
const verifyGlassBuild = (cwd) => {
  const assets = path.join(cwd, 'dist', 'assets');
  const css = readdirSync(assets)
    .filter((file) => file.endsWith('.css'))
    .map((file) => readFileSync(path.join(assets, file), 'utf8'))
    .join('\n');
  // A prefix-order regression left only the unsupported WebKit property after minification.
  assert.match(
    css,
    /(?<![-\w])backdrop-filter:\s*blur\(var\(--pui-glass-blur/,
    'The consumer production CSS must preserve adjustable, unprefixed glass filters.',
  );
};
// Use the actual generated package, with no alias to src or access to showcase CSS.
npm(['install', '--no-audit', '--no-fund'], starter);
npm(['run', 'build'], starter);
verifyGlassBuild(starter);
const react18 = path.join(consumerRoot, 'react18');
mkdirSync(react18, { recursive: true });
for (const file of [
  'src',
  'public',
  'index.html',
  'tsconfig.json',
  'vite.config.ts',
  `seria-ui-${version}.tgz`,
])
  cpSync(path.join(starter, file), path.join(react18, file), { recursive: true });
const pkg = JSON.parse(readFileSync(path.join(starter, 'package.json'), 'utf8'));
Object.assign(pkg.dependencies, { react: '18.3.1', 'react-dom': '18.3.1' });
Object.assign(pkg.devDependencies, { '@types/react': '^18.3.0', '@types/react-dom': '^18.3.0' });
writeFileSync(path.join(react18, 'package.json'), JSON.stringify(pkg, null, 2));
npm(['install', '--no-audit', '--no-fund'], react18);
npm(['run', 'build'], react18);
verifyGlassBuild(react18);
console.log(`Seria ${version}: standalone React 19 and React 18.3 consumer builds passed.`);

// Extract the archive users download. No src aliases or original showcase files are available.
const extracted = path.join(consumerRoot, 'studio-archive');
mkdirSync(extracted, { recursive: true });
execFileSync('tar', [
  '-xzf',
  path.join(root, 'showcase/public/downloads', studioName),
  '-C',
  extracted,
]);
const studioSource = path.join(extracted, 'seria-studio');
for (const file of readdirSync(path.join(root, 'showcase'))) {
  if (
    !/\.(tsx?|css)$/.test(file) ||
    ['main.tsx', 'vite.config.ts', 'compatibility.tsx', 'sectionPosition.ts'].includes(file)
  )
    continue;
  assert.equal(
    readFileSync(path.join(studioSource, 'src/showcase', file), 'utf8'),
    readFileSync(path.join(root, 'showcase', file), 'utf8'),
    `Studio source drift: ${file}`,
  );
}
for (const major of [19, 18]) {
  const destination = path.join(consumerRoot, `studio-react${major}`);
  mkdirSync(destination, { recursive: true });
  for (const file of readdirSync(studioSource))
    cpSync(path.join(studioSource, file), path.join(destination, file), { recursive: true });
  const studioPackage = JSON.parse(readFileSync(path.join(destination, 'package.json'), 'utf8'));
  if (major === 18) {
    Object.assign(studioPackage.dependencies, { react: '18.3.1', 'react-dom': '18.3.1' });
    Object.assign(studioPackage.devDependencies, {
      '@types/react': '^18.3.0',
      '@types/react-dom': '^18.3.0',
    });
  }
  writeFileSync(path.join(destination, 'package.json'), JSON.stringify(studioPackage, null, 2));
  npm(['install', '--no-audit', '--no-fund'], destination);
  const installed = JSON.parse(
    readFileSync(path.join(destination, 'node_modules/seria-ui/package.json'), 'utf8'),
  );
  assert.equal(installed.version, version, 'The installed Studio package must match this release.');
  npm(['run', 'build'], destination);
  verifyGlassBuild(destination);
}
console.log(`Seria ${version}: exact Studio archive builds passed with React 19 and React 18.3.`);
