# ✅ Проверка развёртывания

## 🔍 Шаг 1: Проверьте FastAPI

На сервере выполните:

```bash
curl http://127.0.0.1:8000/health
```

Должен вернуться: `{"status":"OK","message":"FindPro API работает"}`

Если не работает, проверьте логи:
```bash
tail -f /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend/backend.log
```

## 🔍 Шаг 2: Проверьте PHP-прокси

На сервере выполните:

```bash
curl https://coolbola.uz/api/v1/health
```

Или откройте в браузере: `https://coolbola.uz/api/v1/health`

Должен вернуться тот же JSON от FastAPI.

## 🔍 Шаг 3: Проверьте фронтенд

Откройте в браузере: `https://coolbola.uz`

Должен открыться сайт FindPro.

## 🔍 Шаг 4: Проверьте регистрацию/вход

1. Откройте `https://coolbola.uz`
2. Нажмите "Регистрация"
3. Заполните форму и попробуйте зарегистрироваться

Если появляется "Network Error", проверьте:
- FastAPI запущен: `ps aux | grep uvicorn`
- PHP работает: создайте `test.php` с `<?php phpinfo(); ?>` в public_html
- Права доступа: `chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php`

## 🐛 Решение проблем

### FastAPI не отвечает

```bash
# Проверьте процесс
ps aux | grep uvicorn

# Перезапустите если нужно
pkill -f 'uvicorn app.main:app'
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

### PHP-прокси не работает

```bash
# Проверьте права
chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php
chmod 755 /home/s1143023/domains/coolbola.uz/public_html/api

# Проверьте, что файл существует
ls -la /home/s1143023/domains/coolbola.uz/public_html/api/index.php
```

### Фронтенд не обновляется

1. Очистите кэш браузера (Ctrl+Shift+R)
2. Проверьте, что файлы скопированы:
   ```bash
   ls -la /home/s1143023/domains/coolbola.uz/public_html/index.html
   ```

