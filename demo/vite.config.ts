import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';
export default defineConfig({
  root: import.meta.dirname,
  base: './',
  plugins: [react()],
  server: { host: '127.0.0.1', port: 5206, strictPort: true },
  build: { outDir: path.resolve(import.meta.dirname, '../preview'), emptyOutDir: true },
});
