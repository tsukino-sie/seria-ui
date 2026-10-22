import { execFileSync } from 'node:child_process';
import { cpSync, readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import path from 'node:path';

const root = import.meta.dirname;
const { version } = JSON.parse(readFileSync(path.join(root, 'package.json'), 'utf8'));
const prepared = path.join(root, '.release', version, 'seria-starter');
const { packageSha256 } = JSON.parse(
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
// Use the actual generated package, with no alias to src or access to showcase CSS.
npm(['install', '--no-audit', '--no-fund'], starter);
npm(['run', 'build'], starter);
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
console.log(`Seria ${version}: standalone React 19 and React 18.3 consumer builds passed.`);
