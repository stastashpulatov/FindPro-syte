# 🚀 КАК ЗАПУСТИТЬ ПРОЕКТ

## ⚡ Простой способ (2 терминала)

### Terminal 1 - Backend (порт 8000)
```bash
./run-backend.sh
```

### Terminal 2 - Frontend (порт 5000 или 3000)
```bash
npm start
```

---

## 🌐 После запуска откройте:

1. **Frontend**: http://localhost:5000 или http://localhost:3000
2. **Backend API**: http://localhost:8000
3. **API Документация**: http://localhost:8000/docs

---

## ✅ Проверка что всё работает:

### 1. Проверьте Backend
Откройте: http://localhost:8000

Должны увидеть:
```json
{
  "message": "Welcome to FindPro API!",
  "docs": "/docs",
  "api": "/api/v1"
}
```

### 2. Проверьте API документацию
Откройте: http://localhost:8000/docs

Должны увидеть интерактивную документацию Swagger UI

### 3. Проверьте Frontend
Откройте: http://localhost:5000

Должны увидеть красивую главную страницу FindPro

---

## 🔑 Тестовые пользователи

| Email | Пароль | Роль |
|-------|--------|------|
| test@example.com | password123 | Пользователь |
| admin@example.com | admin123 | Администратор |

---

## ❓ Проблемы?

### Backend не запускается?
```bash
cd backend
source .venv/bin/activate
pip install -r requirements.txt
python init_db.py
python create_test_user.py
```

### Frontend не запускается?
```bash
npm install
npm start
```

### Порт 8000 занят?
```bash
# Найдите процесс
lsof -i :8000

# Убейте процесс
kill -9 <PID>
```

### Порт 5000 занят?
```bash
# Найдите процесс
lsof -i :5000

# Убейте процесс
kill -9 <PID>
```

---

## 📝 Важно!

**Backend ДОЛЖЕН быть на порту 8000!**  
**Frontend будет на порту 5000 или 3000!**

Если backend на другом порту, фронтенд не сможет подключиться к API.

---

## 🎯 Быстрая проверка

После запуска обоих серверов:

1. ✅ http://localhost:8000 - должен отвечать
2. ✅ http://localhost:8000/docs - должна открыться документация
3. ✅ http://localhost:5000 - должен открыться сайт
4. ✅ Кнопки на сайте должны работать

---

**Готово! Теперь всё должно работать!** 🎉
