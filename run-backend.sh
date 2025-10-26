#!/bin/bash

echo "🚀 Запуск Backend..."

cd backend

# Активируем виртуальное окружение
if [ -f ".venv/bin/activate" ]; then
    source .venv/bin/activate
else
    echo "❌ Виртуальное окружение не найдено!"
    echo "Создайте его командой: python -m venv .venv"
    exit 1
fi

# Проверяем наличие БД
if [ ! -f "findpro.db" ]; then
    echo "📦 Инициализация базы данных..."
    python init_db.py
    python create_test_user.py
fi

echo "✅ Запуск сервера на http://localhost:8000"
echo "📚 Документация: http://localhost:8000/docs"
echo ""

# Запускаем сервер
uvicorn main:app --reload --host 0.0.0.0 --port 8000
