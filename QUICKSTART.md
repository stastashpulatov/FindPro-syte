# 🚀 Быстрый старт FindPro

## Самый простой способ запуска

```bash
./start.sh
```

Этот скрипт автоматически:
- ✅ Создаст виртуальное окружение для Python
- ✅ Инициализирует базу данных
- ✅ Создаст тестовых пользователей
- ✅ Запустит backend на порту 8000
- ✅ Запустит frontend на порту 3000

## Ручной запуск

### 1. Backend (Terminal 1)

```bash
cd backend
source .venv/bin/activate
python init_db.py              # Только первый раз
python create_test_user.py     # Только первый раз
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### 2. Frontend (Terminal 2)

```bash
npm start
```

## 📍 Адреса

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **API Docs**: http://localhost:8000/docs

## 🔑 Тестовые пользователи

| Email | Пароль | Роль |
|-------|--------|------|
| test@example.com | password123 | Пользователь |
| admin@example.com | admin123 | Администратор |

## 📝 Как использовать

### Создание заявки

1. Откройте http://localhost:3000
2. Нажмите "Создать заявку"
3. Выберите категорию
4. Заполните форму
5. Отправьте заявку

### Просмотр заявок

1. Перейдите в "Мои заявки"
2. Выберите заявку для просмотра деталей
3. Просмотрите предложения от специалистов
4. Примите или отклоните предложение

### Просмотр специалистов

1. Перейдите в "Специалисты"
2. Просмотрите список доступных профессионалов
3. Отправьте заявку напрямую

## 🛠 Разработка

### Структура API

```
POST   /api/v1/auth/register     - Регистрация
POST   /api/v1/auth/login        - Вход
GET    /api/v1/requests          - Список заявок
POST   /api/v1/requests          - Создать заявку
GET    /api/v1/quotes            - Список предложений
POST   /api/v1/quotes            - Создать предложение
POST   /api/v1/quotes/{id}/accept - Принять предложение
GET    /api/v1/providers         - Список специалистов
GET    /api/v1/categories        - Список категорий
```

### Тестирование API

Откройте http://localhost:8000/docs для интерактивного тестирования всех endpoints.

## ❓ Частые проблемы

### Backend не запускается

```bash
cd backend
pip install -r requirements.txt
python init_db.py
```

### Frontend показывает ошибки стилей

```bash
npm install
# Убедитесь что файл src/index.css существует
```

### Ошибки CORS

Убедитесь что:
- Backend запущен на порту 8000
- Frontend использует правильный API URL в `src/services/api.js`

### База данных пустая

```bash
cd backend
python create_test_user.py
```

## 🎯 Следующие шаги

1. Изучите API документацию: http://localhost:8000/docs
2. Посмотрите код в `src/pages/` для понимания структуры
3. Изучите модели в `backend/app/models/`
4. Настройте PostgreSQL для production (опционально)

## 📚 Дополнительная информация

- Полная документация: [README.md](README.md)
- Backend документация: [backend/README.md](backend/README.md)
- Структура проекта описана в README.md

---

**Готово! Теперь вы можете начать работу с FindPro! 🎉**
