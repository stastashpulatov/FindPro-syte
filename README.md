# FindPro

Полноценное приложение с клиентом на React и backend на Express. Предназначено для работы с пользовательскими данными и аутентификацией (JWT), использует MongoDB через Mongoose.

## Возможности
- **Клиент**: React 18, Create React App, TailwindCSS, иконки Lucide
- **API**: Express, CORS, загрузка переменных окружения через dotenv
- **Безопасность**: bcryptjs для хеширования, JWT для авторизации
- **База данных**: MongoDB (Mongoose)

## Технологии
- **Frontend**: `react`, `react-dom`, `react-scripts`, `tailwindcss`, `lucide-react`
- **Backend**: `express`, `mongoose`, `cors`, `dotenv`
- **Auth/Utils**: `bcryptjs`, `jsonwebtoken`
- **Dev**: `nodemon`

## Быстрый старт
1. Установите зависимости

```bash
npm install
```

2. Создайте файл `.env` в корне проекта и укажите переменные окружения (примеры ниже).

3. Запустите фронтенд и backend в отдельных терминалах.

## Переменные окружения
Создайте файл `.env` рядом с `package.json`:

```env
# Порт backend-сервера
PORT=5000

# Подключение к MongoDB
MONGODB_URI=mongodb://localhost:27017/findpro

# Секрет для JWT
JWT_SECRET=supersecret_change_me

# Базовый URL API для фронтенда (опционально)
# Если backend запущен на другом хосте/порту
REACT_APP_API_URL=http://localhost:5000/api
```

## Скрипты
Скрипты из `package.json`:

- `npm start` — запуск React‑приложения (CRA dev server)
- `npm run build` — production‑сборка фронтенда
- `npm test` — тесты CRA
- `npm run eject` — eject CRA (безвозвратно)
- `npm run start:server` — запуск backend на Node.js (`server.js`)
- `npm run dev:server` — запуск backend с авто‑перезапуском (`nodemon`)
- `npm run seed` — заполнение БД начальными данными (если предусмотрено `seeders/seed.js`)

## Запуск разработки
В двух терминалах:

```bash
# 1) Frontend (CRA)
npm start

# 2) Backend (Express)
npm run dev:server
```

По умолчанию CRA поднимет клиент на `http://localhost:3000`, а сервер — на `http://localhost:5000` (при `PORT=5000`). Настройте прокси или CORS при необходимости.

## Сборка и продакшен
```bash
npm run build
```
Сборка появится в директории `build/`. Backend запускается так:

```bash
npm run start:server
```

## Требования
- Node.js (актуальная LTS)
- Доступный MongoDB (локально или в облаке)

## Полезно знать
- Основная точка входа backend: `server.js` (см. скрипты)
- TailwindCSS подключён на стороне фронтенда (см. конфигурацию в проекте)
- Для фронтенда переменная `REACT_APP_API_URL` управляет базовым адресом API

## Лицензия
Укажите лицензию проекта при необходимости.