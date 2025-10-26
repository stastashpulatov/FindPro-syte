#!/bin/bash

echo "🚀 Запуск FindPro..."
echo ""

# Цвета для вывода
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Проверка и запуск backend
echo -e "${BLUE}📦 Запуск Backend...${NC}"
cd backend

if [ ! -d ".venv" ]; then
    echo -e "${RED}❌ Виртуальное окружение не найдено. Создаю...${NC}"
    python -m venv .venv
fi

source .venv/bin/activate

if [ ! -f "findpro.db" ]; then
    echo -e "${BLUE}🗄️  Инициализация базы данных...${NC}"
    python init_db.py
    python create_test_user.py
fi

echo -e "${GREEN}✅ Backend запускается на http://localhost:8000${NC}"
echo -e "${GREEN}📚 Документация: http://localhost:8000/docs${NC}"
echo ""

# Запуск backend в фоне
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &
BACKEND_PID=$!

cd ..

# Небольшая пауза для запуска backend
sleep 3

# Запуск frontend
echo -e "${BLUE}🎨 Запуск Frontend...${NC}"
echo -e "${GREEN}✅ Frontend запускается на http://localhost:5000${NC}"
echo ""
echo -e "${GREEN}🎉 Приложение готово к работе!${NC}"
echo ""
echo -e "${BLUE}Тестовые пользователи:${NC}"
echo "  👤 Пользователь: test@example.com / password123"
echo "  👨‍💼 Администратор: admin@example.com / admin123"
echo ""
echo -e "${RED}Для остановки нажмите Ctrl+C${NC}"
echo ""

# Запуск frontend
npm start

# Остановка backend при завершении
kill $BACKEND_PID
