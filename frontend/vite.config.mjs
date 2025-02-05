import path from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';


export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Nota: eliminé la barra inicial para evitar problemas
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  test: {
    globals: true, // Enable globals like `describe`, `it`, `expect`
    environment: 'jsdom', // Required for DOM testing
    setupFiles: './vitest.setup.mjs', // Point to your setup file
  },
});
