# FindPro - Платформа Поиска Специалистов

Полнофункциональная платформа для поиска и найма специалистов различных категорий.

## 🚀 Быстрый Старт

```bash
./start.sh
```

Сайт откроется на: **http://localhost:3000**

## ✨ Основные Функции

- ✅ Регистрация и авторизация (JWT)
- ✅ Создание заявок с загрузкой фото (до 5 изображений)
- ✅ Система предложений от специалистов
- ✅ Уведомления в реальном времени
- ✅ Поиск специалистов по категориям
- ✅ Рейтинги и отзывы
- ✅ Админ-панель

## 🔧 Технологии

**Backend:**
- FastAPI + SQLAlchemy
- SQLite (готово к PostgreSQL)
- JWT Authentication
- Python 3.14

**Frontend:**
- React 18 + Tailwind CSS
- Axios + React Hot Toast
- Lucide Icons

## 📝 Тестовые Аккаунты

| Роль | Email | Пароль |
|------|-------|--------|
| Пользователь | test@example.com | password123 |
| Администратор | admin@example.com | admin123 |

## 📂 Структура

```
FindPro-syte/
├── backend/          # FastAPI приложение
│   ├── app/
│   │   ├── api/     # API endpoints
│   │   ├── models/  # SQLAlchemy models
│   │   ├── schemas/ # Pydantic schemas
│   │   └── core/    # Config, security
│   └── static/      # Загруженные файлы
├── src/             # React frontend
│   ├── pages/       # Страницы
│   ├── components/  # Компоненты
│   └── services/    # API client
└── start.sh         # Скрипт запуска
```

## 🛠️ Ручной Запуск

**Backend:**
```bash
cd backend
.venv/bin/uvicorn main:app --reload --port 8000
```

**Frontend:**
```bash
npm start
```

## 📚 API Документация

http://localhost:8000/docs

## 🎯 Production

Для production развертывания:
1. Настройте PostgreSQL
2. Обновите `.env`
3. Используйте Nginx
4. Настройте SSL

## 📄 Лицензия

MIT License