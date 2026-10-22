import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  resolve: {
    alias: [
      { find: /^seria-ui$/, replacement: path.resolve(import.meta.dirname, '../src/index.tsx') },
    ],
  },
  server: { host: '127.0.0.1', port: 5207, strictPort: true },
  build: { outDir: path.resolve(import.meta.dirname, '../showcase-dist'), emptyOutDir: true },
});
