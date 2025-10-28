# Как запустить FindPro

## 1. Запуск Backend (FastAPI)

### Установка зависимостей
```bash
cd backend
pip install -r requirements.txt
```

### Настройка окружения
Создайте файл `backend/.env`:
```env
APP_ENV=development
DATABASE_URL=sqlite:///./findpro.db
SECRET_KEY=your-secret-key-change-in-production
```

### Запуск сервера
Из корня проекта:
```bash
cd backend
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend будет доступен:**
- API: http://localhost:8000/api/v1
- Документация: http://localhost:8000/docs
- **Админ-панель: http://localhost:8000/admin** 🎛️
- Health check: http://localhost:8000/health

---

## 2. Запуск Frontend (React)

### Установка зависимостей
Из корня проекта:
```bash
npm install
```

### Запуск приложения
```bash
npm start
```

**Frontend откроется автоматически:**
- Сайт: http://localhost:3000

---

## Важно!

1. **Backend** работает на порту **8000** (API)
2. **Frontend** работает на порту **3000** (сайт)
3. Открывайте в браузере **http://localhost:3000**, а НЕ 8000!
4. Порт 8000 - это только для API, его не нужно открывать в браузере

---

## Проверка работы

1. Запустите backend (порт 8000)
2. Запустите frontend (порт 3000)
3. Откройте http://localhost:3000
4. Попробуйте зарегистрироваться/войти

---

## Решение проблем

### Backend не запускается
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# или .venv\Scripts\activate  # Windows
pip install -r requirements.txt
```

### Frontend не запускается
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

### CORS ошибки
Убедитесь что backend запущен на порту 8000, а frontend на 3000.
Backend уже настроен на прием запросов от любых источников.
