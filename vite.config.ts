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
    host: '0.0.0.0',
    cors: true,
    hmr: {
      protocol: 'wss',
      host: 'localhost',
      port: 3006,
      clientPort: 3006,
    },
    watch: {
      usePolling: true,
    },
    allowedHosts: ['.ngrok-free.app'],
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
