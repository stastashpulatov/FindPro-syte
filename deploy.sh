#!/usr/bin/env bash
# Скрипт для развёртывания FindPro на хостинге

set -euo pipefail

# Цвета
RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

log() {
  echo -e "${BLUE}[$(date '+%H:%M:%S')]${NC} $*"
}

error() {
  echo -e "${RED}❌ $*${NC}" >&2
}

success() {
  echo -e "${GREEN}✅ $*${NC}"
}

warning() {
  echo -e "${YELLOW}⚠️  $*${NC}"
}

# Конфигурация
DOMAIN="${DOMAIN:-coolbola.uz}"
PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PUBLIC_HTML="${PUBLIC_HTML:-/home/s1143023/domains/${DOMAIN}/public_html}"
BACKEND_PORT="${BACKEND_PORT:-8000}"

log "🚀 Начинаем развёртывание FindPro"
log "   Домен: ${DOMAIN}"
log "   Проект: ${PROJECT_DIR}"
log "   Public HTML: ${PUBLIC_HTML}"
echo ""

# Шаг 1: Проверка окружения
log "1️⃣  Проверка окружения..."

if [ ! -d "${PUBLIC_HTML}" ]; then
  error "Директория ${PUBLIC_HTML} не существует!"
  exit 1
fi

if ! command -v node >/dev/null 2>&1; then
  error "Node.js не установлен"
  exit 1
fi

if ! command -v python3 >/dev/null 2>&1; then
  error "Python 3 не установлен"
  exit 1
fi

success "Окружение проверено"

# Шаг 2: Сборка фронтенда
log "2️⃣  Сборка фронтенда..."

cd "${PROJECT_DIR}"

# Устанавливаем зависимости если нужно
if [ ! -d "node_modules" ]; then
  log "Установка npm зависимостей..."
  npm install
fi

# Собираем с правильным API URL
log "Сборка React приложения..."
REACT_APP_API_URL="https://${DOMAIN}/api/v1" npm run build

if [ ! -d "build" ]; then
  error "Build директория не создана!"
  exit 1
fi

success "Фронтенд собран"

# Шаг 3: Копирование файлов
log "3️⃣  Копирование файлов в public_html..."

# Бэкап старых файлов
if [ -f "${PUBLIC_HTML}/index.html" ]; then
  warning "Создаю backup старых файлов..."
  mkdir -p "${PUBLIC_HTML}/.backup"
  cp -r "${PUBLIC_HTML}/index.html" "${PUBLIC_HTML}/.backup/" 2>/dev/null || true
  cp -r "${PUBLIC_HTML}/static" "${PUBLIC_HTML}/.backup/" 2>/dev/null || true
fi

# Копируем новые файлы
log "Копирую фронтенд..."
cp -r build/* "${PUBLIC_HTML}/"

# Создаём директорию api
mkdir -p "${PUBLIC_HTML}/api"

# Копируем PHP прокси
log "Копирую PHP прокси..."
cat > "${PUBLIC_HTML}/api/index.php" << 'EOFPHP'
<?php
/**
 * PHP Proxy для FastAPI
 */

// URL FastAPI backend
$fastapi_url = 'http://127.0.0.1:8000';

// Получаем путь запроса
$request_uri = $_SERVER['REQUEST_URI'];

// Убираем /api из начала пути
$api_path = preg_replace('#^/api#', '', $request_uri);

// Если путь пустой или не начинается с /v1, добавляем
if (empty($api_path) || $api_path === '/') {
    $api_path = '/api/v1/health';
} elseif (strpos($api_path, '/v1') !== 0) {
    $api_path = '/api/v1' . $api_path;
} else {
    $api_path = '/api' . $api_path;
}

// Формируем полный URL
$target_url = $fastapi_url . $api_path;

// Добавляем query string
if (!empty($_SERVER['QUERY_STRING'])) {
    $target_url .= '?' . $_SERVER['QUERY_STRING'];
}

// Подготавливаем заголовки
$headers = [];
if (isset($_SERVER['CONTENT_TYPE'])) {
    $headers[] = 'Content-Type: ' . $_SERVER['CONTENT_TYPE'];
}
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $headers[] = 'Authorization: ' . $_SERVER['HTTP_AUTHORIZATION'];
}

// Настраиваем cURL
$ch = curl_init($target_url);
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_FOLLOWLOCATION => true,
    CURLOPT_HEADER => true,
    CURLOPT_HTTPHEADER => $headers,
    CURLOPT_CUSTOMREQUEST => $_SERVER['REQUEST_METHOD'],
    CURLOPT_TIMEOUT => 30,
    CURLOPT_CONNECTTIMEOUT => 10,
]);

// Передаём тело запроса для POST/PUT/PATCH/DELETE
if (in_array($_SERVER['REQUEST_METHOD'], ['POST', 'PUT', 'PATCH', 'DELETE'])) {
    $input = file_get_contents('php://input');
    if (!empty($input)) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, $input);
    }
}

// Выполняем запрос
$response = curl_exec($ch);

if ($response === false) {
    http_response_code(502);
    header('Content-Type: application/json');
    echo json_encode([
        'detail' => 'Backend недоступен. Проверьте, что FastAPI запущен на порту 8000.',
        'error' => curl_error($ch)
    ]);
    curl_close($ch);
    exit;
}

$http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
$header_size = curl_getinfo($ch, CURLINFO_HEADER_SIZE);
curl_close($ch);

// Разделяем заголовки и тело
$response_headers = substr($response, 0, $header_size);
$body = substr($response, $header_size);

// Передаём заголовки ответа
$header_lines = explode("\r\n", $response_headers);
foreach ($header_lines as $header_line) {
    $header_line = trim($header_line);
    if (empty($header_line)) continue;
    if (strpos($header_line, 'HTTP/') === 0) continue;
    
    $lower_header = strtolower($header_line);
    if (strpos($lower_header, 'content-type:') === 0 ||
        strpos($lower_header, 'content-length:') === 0 ||
        strpos($lower_header, 'access-control-') === 0) {
        header($header_line);
    }
}

// Устанавливаем HTTP код ответа
http_response_code($http_code);

// Отдаём тело ответа
echo $body;
?>
EOFPHP

# Создаём .htaccess если нужно
if [ ! -f "${PUBLIC_HTML}/.htaccess" ]; then
  log "Создаю .htaccess..."
  cat > "${PUBLIC_HTML}/.htaccess" << 'EOFHTACCESS'
<IfModule mod_rewrite.c>
    RewriteEngine On
    
    # API через PHP
    RewriteCond %{REQUEST_URI} ^/api
    RewriteRule ^api/(.*)$ api/index.php [QSA,L]
    
    # SPA routing
    RewriteCond %{REQUEST_FILENAME} !-f
    RewriteCond %{REQUEST_FILENAME} !-d
    RewriteCond %{REQUEST_URI} !^/api
    RewriteRule ^(.*)$ index.html [L]
</IfModule>
EOFHTACCESS
fi

# Устанавливаем права
chmod 644 "${PUBLIC_HTML}/api/index.php"
chmod 755 "${PUBLIC_HTML}/api"
chmod 644 "${PUBLIC_HTML}/.htaccess" 2>/dev/null || true

success "Файлы скопированы"

# Шаг 4: Backend
log "4️⃣  Настройка Backend..."

cd "${PROJECT_DIR}/backend"

# Создаём/активируем venv
if [ ! -d ".venv" ]; then
  log "Создаю виртуальное окружение..."
  python3 -m venv .venv
fi

source .venv/bin/activate

# Устанавливаем зависимости
log "Установка Python зависимостей..."
pip install --upgrade pip -q
pip install -r requirements.txt -q

# Инициализируем БД если нужно
if [ ! -f "findpro.db" ]; then
  log "Инициализация базы данных..."
  python init_db.py
  python create_test_user.py
fi

success "Backend настроен"

# Шаг 5: Запуск Backend
log "5️⃣  Запуск Backend..."

# Останавливаем старый процесс если есть
pkill -f "uvicorn app.main:app" 2>/dev/null || true
sleep 2

# Запускаем новый
log "Запуск uvicorn на порту ${BACKEND_PORT}..."
nohup uvicorn app.main:app \
  --host 127.0.0.1 \
  --port "${BACKEND_PORT}" \
  --workers 2 \
  > backend.log 2>&1 &

BACKEND_PID=$!

# Ждём запуска
log "Ожидание запуска backend..."
for i in {1..30}; do
  if curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
    success "Backend запущен (PID: ${BACKEND_PID})"
    break
  fi
  if [ $i -eq 30 ]; then
    error "Backend не запустился!"
    tail -20 backend.log
    exit 1
  fi
  sleep 1
done

# Шаг 6: Финальные проверки
log "6️⃣  Проверка развёртывания..."

# Проверяем backend
if ! curl -sf "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null; then
  error "Backend не отвечает на health check"
  exit 1
fi
success "Backend работает"

# Проверяем PHP прокси
if ! curl -sf "https://${DOMAIN}/api/v1/health" >/dev/null 2>&1; then
  warning "PHP прокси может не работать. Проверьте вручную: https://${DOMAIN}/api/v1/health"
else
  success "PHP прокси работает"
fi

# Проверяем фронтенд
if [ -f "${PUBLIC_HTML}/index.html" ]; then
  success "Фронтенд развёрнут"
else
  error "index.html не найден!"
  exit 1
fi

echo ""
success "✅ Развёртывание завершено успешно!"
echo ""
log "📋 Проверьте работу:"
log "   • Фронтенд: https://${DOMAIN}"
log "   • API: https://${DOMAIN}/api/v1/health"
log "   • Backend: http://127.0.0.1:${BACKEND_PORT}/health"
log "   • API Docs: http://127.0.0.1:${BACKEND_PORT}/docs"
echo ""
log "📝 Логи backend: ${PROJECT_DIR}/backend/backend.log"
log "   Просмотр: tail -f ${PROJECT_DIR}/backend/backend.log"
echo ""
log "🔄 Для остановки backend:"
log "   kill ${BACKEND_PID}"
echo ""