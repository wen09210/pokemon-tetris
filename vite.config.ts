import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path for correct loading on GitHub Pages
  define: {
    // Polyfill process.env so the existing code doesn't break
    'process.env': process.env
  }
});