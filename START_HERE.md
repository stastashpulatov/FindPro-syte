# 🎯 НАЧНИТЕ ОТСЮДА - FindPro

## 👋 Добро пожаловать!

Это **FindPro** - платформа для поиска специалистов. Всё уже настроено и готово к работе!

---

## ⚡ Быстрый старт (3 шага)

### 1️⃣ Установите зависимости

```bash
# Frontend
npm install

# Backend
cd backend
python -m venv .venv
source .venv/bin/activate  # Linux/Mac
# или .venv\Scripts\activate для Windows
pip install -r requirements.txt
cd ..
```

### 2️⃣ Инициализируйте базу данных

```bash
cd backend
python init_db.py
python create_test_user.py
cd ..
```

### 3️⃣ Запустите приложение

**Самый простой способ:**
```bash
./start.sh
```

**Или вручную в двух терминалах:**

Terminal 1:
```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

Terminal 2:
```bash
npm start
```

---

## 🌐 Откройте в браузере

После запуска откройте:

- **Frontend**: http://localhost:5000
- **API Docs**: http://localhost:8000/docs

---

## 🔑 Войдите в систему

Используйте тестовые аккаунты:

| Email | Пароль | Роль |
|-------|--------|------|
| test@example.com | password123 | Пользователь |
| admin@example.com | admin123 | Администратор |

---

## ✨ Что можно делать?

### Как клиент:
1. Нажмите **"Создать заявку"**
2. Выберите категорию (например, "Ремонт")
3. Опишите задачу
4. Отправьте заявку
5. Перейдите в **"Мои заявки"** чтобы увидеть предложения

### Как специалист:
1. Создайте профиль специалиста
2. Просмотрите доступные заявки
3. Отправьте свое предложение с ценой

### Как администратор:
1. Войдите как admin
2. Управляйте категориями
3. Верифицируйте специалистов

---

## 📚 Документация

Если нужна дополнительная информация:

1. **QUICKSTART.md** - Подробное руководство для начинающих
2. **README.md** - Полное описание проекта
3. **SUMMARY.md** - Сводка всего проекта
4. **http://localhost:8000/docs** - Интерактивная API документация

---

## ❓ Проблемы?

### Frontend не запускается?
```bash
npm install
npm start
```

### Backend не запускается?
```bash
cd backend
pip install -r requirements.txt
python init_db.py
uvicorn main:app --reload
```

### Нет стилей?
Убедитесь что файл `src/index.css` существует и содержит:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### База данных пустая?
```bash
cd backend
python create_test_user.py
```

---

## 🎯 Следующие шаги

1. ✅ Запустите приложение
2. ✅ Войдите в систему
3. ✅ Создайте тестовую заявку
4. ✅ Изучите API документацию
5. ✅ Начните разработку!

---

## 📁 Структура проекта

```
FindPro/
├── src/              # React Frontend
├── backend/          # FastAPI Backend
├── public/           # Статические файлы
├── start.sh          # Скрипт автозапуска
└── *.md              # Документация
```

---

## 🚀 Готово!

**Всё настроено и работает!**

Просто запустите `./start.sh` и начинайте работать! 🎉

---

**Нужна помощь?** Читайте QUICKSTART.md или SUMMARY.md
