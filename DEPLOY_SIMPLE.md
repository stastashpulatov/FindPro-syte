# 🚀 Простое развёртывание FindPro (без nginx)

FastAPI теперь отдаёт и API, и фронтенд через один порт. Это упрощает развёртывание!

## 📋 Что нужно сделать

### 1. На сервере запустите FastAPI

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte
./scripts/run-prod.sh
```

Или вручную:

```bash
cd backend
source .venv/bin/activate
export FRONTEND_BUILD_DIR="/home/s1143023/coolbola.uz"  # путь к build
nohup uvicorn app.main:app --host 0.0.0.0 --port 8000 --workers 4 > backend.log 2>&1 &
```

### 2. Настройте nginx (один раз, через поддержку хостинга)

**Вариант А: Проксировать весь домен на FastAPI (рекомендуется)**

Напишите в поддержку хостинга:

> Здравствуйте! Мне нужно настроить проксирование для домена coolbola.uz.
> 
> Пожалуйста, добавьте в конфигурацию nginx для домена coolbola.uz следующее:
> 
> ```
> location / {
>     proxy_pass http://127.0.0.1:8000;
>     proxy_set_header Host $host;
>     proxy_set_header X-Real-IP $remote_addr;
>     proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
>     proxy_set_header X-Forwarded-Proto $scheme;
> }
> ```
> 
> FastAPI уже настроен для отдачи статики и API через один порт.

**Вариант Б: Только API (если фронтенд уже отдаётся nginx)**

Если nginx уже отдаёт статику из `public_html`, попросите добавить только:

```
location /api/ {
    proxy_pass http://127.0.0.1:8000/api/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
}
```

### 3. Проверьте работу

После настройки nginx:

- Откройте `https://coolbola.uz` - должен открыться сайт
- Откройте `https://coolbola.uz/api/v1/health` - должен вернуться JSON
- Попробуйте зарегистрироваться/войти - должно работать без ошибок

## ✅ Преимущества этого подхода

1. **Один процесс** - FastAPI отдаёт всё (API + фронтенд)
2. **Простое обновление** - просто перезапустите FastAPI
3. **Меньше конфигурации** - не нужно настраивать два сервера
4. **Автоматический поиск build** - FastAPI сам найдёт папку с фронтендом

## 🔧 Переменные окружения

Можно задать путь к build директории:

```bash
export FRONTEND_BUILD_DIR="/путь/к/build"
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

## 📝 Примечания

- FastAPI автоматически ищет `build/` в нескольких местах
- Если build не найден, FastAPI работает только как API
- Все запросы, кроме `/api`, `/docs`, `/admin` отдаются как SPA (index.html)

