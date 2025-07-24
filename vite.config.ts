/// <reference types="node" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3006,
    strictPort: true, // Если порт занят - сразу выдаст ошибку
    host: true, // Разрешаем доступ извне и биндим на все интерфейсы
    watch: {
      usePolling: true // Для лучшей работы с Windows
    },
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  }
}); 