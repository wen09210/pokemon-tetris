import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // Use relative base path for correct loading on GitHub Pages
  define: {
    // Safely replace process.env with a simple object to prevent "process is not defined" error in browser
    'process.env': JSON.stringify({
      API_KEY: process.env.API_KEY || ""
    })
  }
});