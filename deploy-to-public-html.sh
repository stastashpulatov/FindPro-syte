#!/usr/bin/env bash
# Скрипт для развёртывания в public_html с PHP-прокси

set -euo pipefail

# Пути
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_HTML="${PUBLIC_HTML:-/home/s1143023/domains/coolbola.uz/public_html}"

echo "🚀 Развёртывание FindPro в public_html"
echo "   Проект: ${PROJECT_DIR}"
echo "   Целевая директория: ${PUBLIC_HTML}"
echo ""

# Проверяем существование public_html
if [ ! -d "${PUBLIC_HTML}" ]; then
    echo "❌ Директория ${PUBLIC_HTML} не существует!"
    echo "   Укажите правильный путь через переменную PUBLIC_HTML"
    exit 1
fi

# Создаём директорию api в public_html
echo "📁 Создаю директорию api..."
mkdir -p "${PUBLIC_HTML}/api"

# Копируем PHP прокси
echo "📄 Копирую PHP прокси..."
cp "${PROJECT_DIR}/api-proxy.php" "${PUBLIC_HTML}/api/index.php"

# Проверяем наличие build директории
if [ ! -d "${PROJECT_DIR}/build" ]; then
    echo "⚠️  Директория build не найдена!"
    echo ""
    echo "📋 Соберите фронтенд локально и скопируйте build на сервер:"
    echo "   1. На локальной машине:"
    echo "      cd /путь/к/проекту"
    echo "      npm run build"
    echo ""
    echo "   2. Скопируйте build на сервер:"
    echo "      rsync -avz build/ user@server:/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/"
    echo ""
    echo "   3. Затем запустите этот скрипт снова"
    echo ""
    exit 1
fi

# Копируем build фронтенда
echo "📦 Копирую статические файлы фронтенда..."
cp -r "${PROJECT_DIR}/build/"* "${PUBLIC_HTML}/"

# Копируем .htaccess, если он есть
if [ -f "${PROJECT_DIR}/.htaccess" ]; then
    echo "📄 Копирую .htaccess..."
    cp "${PROJECT_DIR}/.htaccess" "${PUBLIC_HTML}/"
fi

echo ""
echo "✅ Развёртывание завершено!"
echo ""
echo "📋 Следующие шаги:"
echo "   1. Убедитесь, что FastAPI запущен:"
echo "      cd ${PROJECT_DIR}/backend"
echo "      source .venv/bin/activate"
echo "      nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &"
echo ""
echo "   2. Проверьте работу:"
echo "      - https://coolbola.uz - должен открыться сайт"
echo "      - https://coolbola.uz/api/v1/health - должен вернуться JSON"
echo ""
echo "   3. Если не работает, проверьте:"
echo "      - PHP включён на хостинге (создайте test.php с <?php phpinfo(); ?>)"
echo "      - FastAPI запущен на порту 8000 (ps aux | grep uvicorn)"
echo "      - Права доступа на файлы:"
echo "        chmod 644 ${PUBLIC_HTML}/api/index.php"
echo "        chmod 755 ${PUBLIC_HTML}/api"
echo ""
echo "📝 Примечание: Если build директории нет, соберите фронтенд локально"
echo "   и скопируйте build/ на сервер через rsync или scp"

