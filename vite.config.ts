import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // IMPORTANT: Matches your GitHub repository name
  base: '/pokemon-tetris/', 
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  define: {
    // Safely replace process.env to avoid "process is not defined" in browser
    'process.env': JSON.stringify({
      API_KEY: process.env.API_KEY || ""
    })
  }
});