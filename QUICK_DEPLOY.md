# ⚡ Быстрое развёртывание - следующие шаги

## ✅ Шаг 1: Build скопирован на сервер

Отлично! Build директория уже на сервере.

## 📋 Шаг 2: На сервере запустите скрипт

Подключитесь к серверу и выполните:

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte
./deploy-to-public-html.sh
```

Этот скрипт:
- Скопирует файлы из `build/` в `public_html/`
- Настроит PHP-прокси в `public_html/api/index.php`

## 🚀 Шаг 3: Запустите FastAPI

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

## ✅ Шаг 4: Проверьте работу

- `https://coolbola.uz` - должен открыться сайт
- `https://coolbola.uz/api/v1/health` - должен вернуться JSON
- Попробуйте зарегистрироваться/войти

## 🔍 Если что-то не работает

1. **Проверьте PHP:**
   ```bash
   echo '<?php phpinfo(); ?>' > /home/s1143023/domains/coolbola.uz/public_html/test.php
   ```
   Откройте `https://coolbola.uz/test.php` - должна показаться информация о PHP

2. **Проверьте FastAPI:**
   ```bash
   curl http://127.0.0.1:8000/health
   ```

3. **Проверьте права доступа:**
   ```bash
   chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php
   chmod 755 /home/s1143023/domains/coolbola.uz/public_html/api
   ```

4. **Проверьте логи:**
   ```bash
   tail -f /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend/backend.log
   ```

