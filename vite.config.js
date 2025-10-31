// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// ✅ This is the modern ESM format — no require(), no module.exports
// ✅ Compatible with Vitest and React setups

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.js'],
    css: false,
  },
});
