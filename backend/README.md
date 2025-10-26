# FindPro Backend API

FastAPI backend для платформы поиска специалистов FindPro.

## 🚀 Быстрый старт

### 1. Установка зависимостей

```bash
# Создайте виртуальное окружение
python -m venv .venv

# Активируйте его
source .venv/bin/activate  # Linux/Mac
# или
.venv\Scripts\activate  # Windows

# Установите зависимости
pip install -r requirements.txt
```

### 2. Настройка окружения

Скопируйте `.env.example` в `.env` и настройте переменные:

```bash
cp .env.example .env
```

### 3. Инициализация базы данных

```bash
# Создайте таблицы
python init_db.py

# Создайте тестовые данные
python create_test_user.py
```

### 4. Запуск сервера

```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Сервер будет доступен по адресу:
- API: http://localhost:8000
- Документация Swagger: http://localhost:8000/docs
- Документация ReDoc: http://localhost:8000/redoc

## 📚 API Endpoints

### Authentication
- `POST /api/v1/auth/register` - Регистрация нового пользователя
- `POST /api/v1/auth/login` - Вход в систему

### Users
- `GET /api/v1/users/me` - Получить текущего пользователя
- `PUT /api/v1/users/me` - Обновить профиль

### Requests (Заявки)
- `GET /api/v1/requests` - Список заявок
- `POST /api/v1/requests` - Создать заявку
- `GET /api/v1/requests/{id}` - Получить заявку
- `PUT /api/v1/requests/{id}` - Обновить заявку
- `DELETE /api/v1/requests/{id}` - Удалить заявку

### Quotes (Предложения)
- `GET /api/v1/quotes` - Список предложений
- `POST /api/v1/quotes` - Создать предложение
- `POST /api/v1/quotes/{id}/accept` - Принять предложение
- `POST /api/v1/quotes/{id}/reject` - Отклонить предложение

### Providers (Специалисты)
- `GET /api/v1/providers` - Список специалистов
- `POST /api/v1/providers` - Создать профиль специалиста
- `GET /api/v1/providers/{id}` - Получить специалиста
- `PUT /api/v1/providers/{id}` - Обновить профиль

### Categories (Категории)
- `GET /api/v1/categories` - Список категорий
- `POST /api/v1/categories` - Создать категорию (admin)
- `GET /api/v1/categories/{id}` - Получить категорию

## 🔐 Тестовые пользователи

После запуска `create_test_user.py`:

- **Пользователь**: test@example.com / password123
- **Администратор**: admin@example.com / admin123

## 🛠 Технологии

- **FastAPI** - современный веб-фреймворк
- **SQLAlchemy** - ORM для работы с БД
- **Pydantic** - валидация данных
- **JWT** - аутентификация
- **SQLite** - база данных (можно заменить на PostgreSQL)

## 📝 Структура проекта

```
backend/
├── app/
│   ├── api/
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── auth.py
│   │       │   ├── users.py
│   │       │   ├── requests.py
│   │       │   ├── quotes.py
│   │       │   ├── providers.py
│   │       │   └── categories.py
│   │       └── api.py
│   ├── core/
│   │   ├── config.py
│   │   └── security.py
│   ├── db/
│   │   ├── base.py
│   │   └── session.py
│   ├── models/
│   │   ├── user.py
│   │   ├── request.py
│   │   ├── quote.py
│   │   ├── provider.py
│   │   ├── category.py
│   │   └── service.py
│   ├── schemas/
│   │   ├── user.py
│   │   ├── token.py
│   │   ├── request.py
│   │   ├── quote.py
│   │   ├── provider.py
│   │   └── category.py
│   └── main.py
├── init_db.py
├── create_test_user.py
├── requirements.txt
└── .env
```

## 🐛 Отладка

Для просмотра логов и отладки используйте интерактивную документацию:
http://localhost:8000/docs

Там вы можете тестировать все API endpoints напрямую из браузера.
