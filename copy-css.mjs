import { copyFileSync } from 'node:fs';
for (const file of ['styles.css', 'tokens.css', 'presentation.css'])
  copyFileSync(
    new URL(`./src/${file}`, import.meta.url),
    new URL(`./dist/${file}`, import.meta.url),
  );
