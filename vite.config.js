import { defineConfig } from 'vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: './',
  publicDir: 'public',
  build: {
    outDir: path.join(__dirname, 'build'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: path.join(__dirname, 'index.html')
      },
      output: {
        manualChunks: undefined
      }
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096,
    copyPublicDir: true,
    write: true
  },
  server: {
    strictPort: true,
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true
      }
    }
  }
}); 