import { defineConfig } from 'vitest/config';
export default defineConfig({
  base: process.env.NEXOCERT_BASE || '/',
  build: { target: 'es2022', chunkSizeWarningLimit: 500, rollupOptions: { output: { manualChunks: { react: ['react', 'react-dom'], validation: ['zod'] } } } },
  test: { include: ['tests/unit/**/*.test.ts'], environment: 'node' }
});
