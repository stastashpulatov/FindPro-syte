#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}"
BACKEND_VENV="${BACKEND_DIR}/.venv"

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
PYTHON_BIN="${PYTHON_BIN:-python3}"

free_port() {
  local port="$1"
  local service="$2"
  local pids
  pids=$(lsof -tiTCP:"${port}" -sTCP:LISTEN 2>/dev/null || true)
  if [ -n "${pids}" ]; then
    log "⚠️ Порт ${port} занят (${service}). Завершаю процессы: ${pids}"
    while read -r pid; do
      if kill -0 "${pid}" 2>/dev/null; then
        kill "${pid}" 2>/dev/null || true
        sleep 1
        if kill -0 "${pid}" 2>/dev/null; then
          log "   PID ${pid} не завершился, отправляю SIGKILL"
          kill -9 "${pid}" 2>/dev/null || true
        fi
      fi
    done <<<"${pids}"
    # дополнительная проверка
    for _ in {1..5}; do
      if ! lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
        break
      fi
      sleep 1
    done
    if lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
      log "❌ Не удалось освободить порт ${port}. Укажите другой порт: ${service^^}_PORT=<номер> ./scripts/run-dev.sh"
      exit 1
    fi
    log "✅ Порт ${port} освобождён"
  fi
}

log() {
  printf '%s %s\n' "[$(date '+%H:%M:%S')]" "$*"
}

ensure_python() {
  if ! command -v "${PYTHON_BIN}" >/dev/null 2>&1; then
    log "❌ Python interpreter '${PYTHON_BIN}' не найден. Укажите PYTHON_BIN=python3.11 (или другой) перед запуском."
    exit 1
  fi
}

create_venv() {
  if [ ! -d "${BACKEND_VENV}" ]; then
    log "🧱 Создаю виртуальное окружение в ${BACKEND_VENV}"
    "${PYTHON_BIN}" -m venv "${BACKEND_VENV}"
  fi
  # shellcheck disable=SC1090
  source "${BACKEND_VENV}/bin/activate"
}

install_backend_deps() {
  log "📦 Установка Python зависимостей..."
  pip install --upgrade pip >/dev/null
  pip install -r "${BACKEND_DIR}/requirements.txt"
}

prepare_database() {
  cd "${BACKEND_DIR}"
  if [ ! -f "findpro.db" ]; then
    log "🗄️  Инициализация базы данных..."
    python init_db.py
    python create_test_user.py
  fi
}

start_backend() {
  cd "${BACKEND_DIR}"
  free_port "${BACKEND_PORT}" "backend"
  log "🚀 Запуск backend на http://127.0.0.1:${BACKEND_PORT}"
  uvicorn app.main:app --reload --host 0.0.0.0 --port "${BACKEND_PORT}" &
  BACKEND_PID=$!
}

wait_for_backend() {
  log "⏳ Ожидание готовности backend..."
  for _ in {1..40}; do
    if curl -fsS "http://127.0.0.1:${BACKEND_PORT}/health" >/dev/null 2>&1; then
      log "✅ Backend отвечает"
      return
    fi
    sleep 1
  done
  log "❌ Backend не запустился вовремя"
  exit 1
}

install_frontend_deps() {
  cd "${FRONTEND_DIR}"
  if [ ! -d "node_modules" ]; then
    log "📦 Установка npm зависимостей..."
    npm install
  fi
}

start_frontend() {
  cd "${FRONTEND_DIR}"
  free_port "${FRONTEND_PORT}" "frontend"
  log "🎨 Запуск frontend на http://127.0.0.1:${FRONTEND_PORT}"
  REACT_APP_API_URL="${REACT_APP_API_URL:-http://127.0.0.1:${BACKEND_PORT}/api/v1}" \
  PORT="${FRONTEND_PORT}" \
  npm start
}

cleanup() {
  if [ -n "${BACKEND_PID:-}" ] && ps -p "${BACKEND_PID}" >/dev/null 2>&1; then
    log "🧹 Останавливаю backend (PID ${BACKEND_PID})"
    kill "${BACKEND_PID}"
  fi
}

trap cleanup EXIT

ensure_python
create_venv
install_backend_deps
prepare_database
start_backend
wait_for_backend
install_frontend_deps
start_frontend

