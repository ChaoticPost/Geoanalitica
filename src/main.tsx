import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './providers/ThemeProvider';
import App from './App';

// Импортируем стили
import './styles/index.css';
import './styles/animations.css';
import './styles/globals.css';
import './styles/phone-input.css';

// Глобальный обработчик ошибок
window.onerror = (message, source, lineno, colno, error) => {
  console.error('Global error:', { message, source, lineno, colno, error });
  return false;
};

// Отладочная информация
console.log('Environment:', import.meta.env);
console.log('Base URL:', import.meta.env.BASE_URL);
console.log('Development mode:', import.meta.env.DEV);

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error('Root element not found!');
  throw new Error('Root element not found!');
}

console.log('Root element found, mounting app...');

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);

// Отлавливаем ошибки при рендеринге
try {
  ReactDOM.createRoot(rootElement).render(app);
  console.log('App mounted successfully');
} catch (error) {
  console.error('Error mounting app:', error);
  // Показываем fallback UI при ошибке
  rootElement.innerHTML = `
        <div style="padding: 20px; text-align: center;">
            <h1>Произошла ошибка при загрузке приложения</h1>
            <p>Пожалуйста, обновите страницу или попробуйте позже.</p>
            <pre style="text-align: left; background: #f5f5f5; padding: 10px; margin-top: 20px;">
                ${error?.toString()}
            </pre>
        </div>
    `;
} 