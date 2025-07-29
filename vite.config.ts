/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3006,
    strictPort: true,
    host: true,
    cors: true,
    hmr: {
      protocol: 'ws',
      host: 'localhost',
      port: 3006,
      clientPort: 3006,
      timeout: 5000,
      overlay: true,
    },
    watch: {
      usePolling: true,
    },
  },
  optimizeDeps: {
    include: ['h3-js', '@2gis/mapgl'],
  },
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          map: ['@2gis/mapgl', 'h3-js'],
        },
      },
    },
  },
});
