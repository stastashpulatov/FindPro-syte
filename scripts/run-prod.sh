#!/usr/bin/env bash

set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
BACKEND_DIR="${ROOT_DIR}/backend"
FRONTEND_DIR="${ROOT_DIR}"
BACKEND_VENV="${BACKEND_DIR}/.venv"

BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-4173}"
PYTHON_BIN="${PYTHON_BIN:-python3}"
UVICORN_WORKERS="${UVICORN_WORKERS:-4}"
HOST_DOMAIN="${HOST_DOMAIN:-}"
HOST_DATA_ROOT="${HOST_DATA_ROOT:-${ROOT_DIR}/data}"
DATABASE_PATH="${DATABASE_PATH:-${HOST_DATA_ROOT}/findpro.db}"

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
    for _ in {1..5}; do
      if ! lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
        break
      fi
      sleep 1
    done
    if lsof -tiTCP:"${port}" -sTCP:LISTEN >/dev/null 2>&1; then
      log "❌ Не удалось освободить порт ${port}. Укажите другой порт: ${service^^}_PORT=<номер> ./scripts/run-prod.sh"
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
    log "❌ Python interpreter '${PYTHON_BIN}' не найден. Укажите PYTHON_BIN=python3.11 (или другой совместимый)."
    exit 1
  fi
}

create_venv() {
  if [ ! -d "${BACKEND_VENV}" ]; then
    log "🧱 Создаю виртуальное окружение..."
    "${PYTHON_BIN}" -m venv "${BACKEND_VENV}"
  fi
  # shellcheck disable=SC1090
  source "${BACKEND_VENV}/bin/activate"
}

install_backend_deps() {
  log "📦 Проверяю Python зависимости..."
  pip install --upgrade pip >/dev/null
  pip install -r "${BACKEND_DIR}/requirements.txt"
}

prepare_database() {
  cd "${BACKEND_DIR}"
  mkdir -p "$(dirname "${DATABASE_PATH}")"
  local abs_path
  abs_path="$(readlink -f "${DATABASE_PATH}")"
  DATABASE_PATH="${abs_path}"
  if [ -z "${DATABASE_URL:-}" ]; then
    export DATABASE_URL="sqlite:////${abs_path#/}"
  fi
  if [ ! -f "${abs_path}" ]; then
    log "🗄️  Инициализация базы данных..."
    python init_db.py
    python create_test_user.py
  fi
}

start_backend() {
  cd "${BACKEND_DIR}"
  free_port "${BACKEND_PORT}" "backend"
  local host="${BACKEND_HOST:-0.0.0.0}"
  log "🚀 Запуск backend (prod) на ${host}:${BACKEND_PORT} (workers=${UVICORN_WORKERS})"
  uvicorn app.main:app --host "${host}" --port "${BACKEND_PORT}" --workers "${UVICORN_WORKERS}" &
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

build_frontend() {
  cd "${FRONTEND_DIR}"
  if [ ! -d "node_modules" ]; then
    log "📦 Установка npm зависимостей..."
    npm install
  fi
  log "🏗️  Сборка frontend..."
  local api_url="${REACT_APP_API_URL:-}"
  if [ -z "${api_url}" ] && [ -n "${HOST_DOMAIN}" ]; then
    api_url="https://${HOST_DOMAIN}/api/v1"
  fi
  REACT_APP_API_URL="${api_url:-https://example.com/api/v1}" npm run build
}

serve_frontend() {
  cd "${FRONTEND_DIR}"
  local port="${FRONTEND_PORT}"
  if [ -n "${HOST_DOMAIN}" ] && [ "${port}" -eq 4173 ]; then
    port=80
  fi
  free_port "${port}" "frontend"
  local listen_host="${FRONTEND_HOST:-0.0.0.0}"
  log "🌐 Сервер статических файлов (serve) на ${listen_host}:${port}"
  npx serve -s build -l "${listen_host}:${port}"
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
build_frontend
serve_frontend

