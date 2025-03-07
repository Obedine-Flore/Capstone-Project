import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/setupTests.ts'],
    css: true,
    include: ['**/*.{test,spec}.{js,jsx,ts,tsx}'],
    exclude: ['node_modules', 'dist', '.idea', '.git', '.cache'],
    transformMode: {
      web: [/\.[jt]sx?$/]
    },
    deps: {
      // Inline lucide-react to properly transform it
      inline: [/lucide-react/]
    },
    // Prevent memory issues
    pool: 'forks',
    poolOptions: {
      forks: {
        isolate: false,
      },
    },
    testTimeout: 10000,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
});