/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import type { Plugin } from 'vite';

// Плагин для заголовков ngrok
const ngrokPlugin = (): Plugin => ({
  name: 'configure-server',
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      res.setHeader('ngrok-skip-browser-warning', 'true');
      res.setHeader('Cache-Control', 'no-store, max-age=0');
      res.setHeader('Access-Control-Allow-Origin', '*');
      next();
    });
  },
});

export default defineConfig({
  plugins: [
    react(),
    ngrokPlugin(),
  ],
  server: {
    port: 3006,
    host: '0.0.0.0',
    strictPort: true,
    cors: true,
    hmr: {
      clientPort: 443,
      protocol: 'wss',
      host: process.env.VITE_HMR_HOST || 'localhost',
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    allowedHosts: ['.ngrok-free.app', 'localhost', '127.0.0.1'],
    // Добавляем fallback для React Router
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Добавляем base для корректной загрузки ассетов
  base: process.env.VITE_BASE_URL || '/',
  // Добавляем обработку статических файлов
  publicDir: 'public',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    // Оптимизация для продакшена
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui': ['@radix-ui/react-slot', 'class-variance-authority', 'clsx', 'tailwind-merge'],
          'animations': ['framer-motion'],
        },
      },
    },
  },
});
