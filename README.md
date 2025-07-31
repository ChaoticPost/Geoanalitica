# 🌍 geoanalitics

Платформа для геоаналитики и анализа локаций для бизнеса. Помогает принимать решения о размещении торговых точек на основе данных о проходимости, конкуренции и других важных факторов.

## 📋 Содержание

- [Возможности](#возможности)
- [Технологии](#технологии)
- [Дизайн](#дизайн)
- [Начало работы](#начало-работы)
- [Структура проекта](#структура-проекта)
- [API Документация](#api-документация)
- [Разработка](#разработка)
- [Деплой](#деплой)
- [Тестирование](#тестирование)

## Возможности

- Интерактивная карта с визуализацией данных
- Анализ проходимости и конкуренции
- Рекомендации по размещению торговых точек
- Адаптивный дизайн для всех устройств
- Темная тема
- Адаптив под планшет / мобилку / web
- Детальная аналитика и отчеты
- Система аутентификации и авторизации
- Форма обратной связи

## 🛠 Технологии

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- Framer Motion
- 2GIS MapGL API
- H3-js (геопространственная индексация)

### Backend
- FastAPI
- PostgreSQL
- SQLAlchemy
- Alembic (миграции)
- JWT аутентификация
- TOTP (2FA)

## Дизайн

- На данный момент готов лендинг
- Экраны логина и пароля
- Экран восстановления пароля

## Начало работы

### Предварительные требования

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+
- Git

### Установка

1. Клонируйте репозиторий:
\`\`\`bash
git clone https://github.com/your-username/geoanalitica.git
cd geoanalitica
\`\`\`

2. Установите зависимости frontend:
\`\`\`bash
npm install
\`\`\`

3. Настройте переменные окружения:
\`\`\`bash
cp .env.example .env
# Отредактируйте .env файл, добавив необходимые ключи
\`\`\`

4. Настройте backend:
\`\`\`bash
cd backend
python -m venv venv
source venv/bin/activate  # На Windows: .\venv\Scripts\activate
pip install -r requirements.txt
\`\`\`

5. Настройте базу данных:
\`\`\`bash
alembic upgrade head
\`\`\`

### Запуск для разработки

1. Запустите frontend:
\`\`\`bash
npm run dev
\`\`\`

2. Запустите backend:
\`\`\`bash
cd backend
.\start.ps1  # На Windows
# или
./start.sh   # На Linux/Mac
\`\`\`

## 📁 Структура проекта

### Frontend

```
src/
├── assets/          # Статические ресурсы
├── components/      # React компоненты
│   ├── map/        # Компоненты карты
│   ├── sections/   # Секции страниц
│   └── ui/         # UI компоненты
├── config/         # Конфигурация
├── features/       # Функциональные модули
├── hooks/          # React хуки
├── layouts/        # Шаблоны страниц
├── pages/          # Страницы приложения
├── providers/      # React контекст провайдеры
├── services/       # Сервисы для работы с API
├── shared/         # Общие утилиты и типы
├── store/          # Управление состоянием
├── styles/         # CSS стили
├── types/          # TypeScript типы
└── utils/          # Вспомогательные функции
```

### Backend

```
backend/
├── api/           # API endpoints
│   └── v1/        # API версия 1
├── core/          # Ядро приложения
├── db/            # Работа с базой данных
├── models/        # Модели данных
├── schemas/       # Pydantic схемы
├── services/      # Бизнес-логика
└── tests/         # Тесты
```

## API Документация

После запуска backend, документация API доступна по адресам:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Разработка

### Рекомендации по стилю кода

- Используйте TypeScript для типизации
- Следуйте принципам Clean Architecture
- Используйте ESLint и Prettier для форматирования кода
- Пишите тесты для новой функциональности

### Ветки

- \`main\` - продакшн версия
- \`develop\` - основная ветка разработки
- \`feature/*\` - новый функционал
- \`fix/*\` - исправление багов
- \`refactor/*\` - рефакторинг

### Коммиты

Используйте conventional commits с русскими комментариями:
- \`feat: Добавлена новая функция\`
- \`fix: Исправлен баг\`
- \`docs: Обновлена документация\`
- \`refactor: Переработан компонент\`
- \`test: Добавлены тесты\`

## Деплой

### Frontend

1. Сборка проекта:
\`\`\`bash
npm run build
\`\`\`

2. Статика будет доступна в директории \`dist/\`

### Backend

1. Установите зависимости продакшн:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

2. Настройте переменные окружения для продакшн
3. Запустите через WSGI сервер (например, Gunicorn)

## Тестирование

### Frontend

\`\`\`bash
npm run test        # Запуск тестов
npm run test:watch  # Запуск тестов в режиме наблюдения
npm run test:coverage # Проверка покрытия кода тестами
\`\`\`

### Backend

\`\`\`bash
pytest              # Запуск всех тестов
pytest tests/test_users.py  # Запуск конкретного теста
pytest --cov=app tests/  # Проверка покрытия
\`\`\`


## 👥 Команда

- FullStack-разработчик и UX/UI- [Дарья Чугунова](https://github.com/ChaoricPost)

- Product management - [Максим Шилкин](https://t.me/shilkinm)
- Аналитик / Data Scientist [Артур Артиков](https://t.me/ArturArtikov)


## 📞 Контакты

По всем вопросам обращайтесь:
- Email: dariachugu_work@inbox.ru
- Telegram: [@daria_chugu](https://t.me/daria_chugu)