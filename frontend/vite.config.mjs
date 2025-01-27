import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enable globals like `describe`, `it`, `expect`
    environment: 'jsdom', // Required for DOM testing
    setupFiles: './vitest.setup.mjs', // Point to your setup file
  },
});
