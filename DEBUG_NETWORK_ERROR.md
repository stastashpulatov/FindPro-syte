# 🔍 Отладка Network Error

## Шаг 1: Проверьте FastAPI напрямую

На сервере выполните:

```bash
curl http://127.0.0.1:8000/health
curl http://127.0.0.1:8000/api/v1/health
```

Оба должны вернуть JSON. Если нет - FastAPI не работает.

## Шаг 2: Проверьте PHP-прокси

На сервере выполните:

```bash
curl https://coolbola.uz/api/v1/health
```

Если не работает, проверьте:

```bash
# Проверьте, что файл существует
ls -la /home/s1143023/domains/coolbola.uz/public_html/api/index.php

# Проверьте права
chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php
chmod 755 /home/s1143023/domains/coolbola.uz/public_html/api
```

## Шаг 3: Проверьте структуру директорий

```bash
ls -la /home/s1143023/domains/coolbola.uz/public_html/
ls -la /home/s1143023/domains/coolbola.uz/public_html/api/
```

Должны быть:
- `index.html` в public_html
- `api/index.php` в public_html/api

## Шаг 4: Создайте тестовый PHP файл

Создайте файл для проверки PHP:

```bash
echo '<?php phpinfo(); ?>' > /home/s1143023/domains/coolbola.uz/public_html/test.php
```

Откройте `https://coolbola.uz/test.php` - должна показаться информация о PHP.

## Шаг 5: Проверьте логи

```bash
# Логи FastAPI
tail -20 /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend/backend.log

# Проверьте, что процесс запущен
ps aux | grep uvicorn
```

## Возможные проблемы:

1. **FastAPI не запущен** - запустите снова
2. **PHP не работает** - проверьте через test.php
3. **Неправильный путь к API** - проверьте структуру директорий
4. **Nginx не обрабатывает /api** - может быть нужна настройка

