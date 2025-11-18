# 🚀 Развёртывание без доступа к nginx (PHP Proxy)

Если хостинг не позволяет изменить конфигурацию nginx, используйте PHP-прокси.

## 📋 Шаги развёртывания

### 1. Скопируйте файлы в public_html

```bash
# На сервере
cd /home/s1143023/domains/coolbola.uz/public_html

# Скопируйте PHP прокси
cp /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/api-proxy.php .

# Скопируйте .htaccess (если хостинг использует Apache)
cp /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/.htaccess .

# Скопируйте build фронтенда
cp -r /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/* .
```

### 2. Запустите FastAPI

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

### 3. Настройте .htaccess (если Apache)

Если хостинг использует Apache (а не nginx), `.htaccess` должен работать автоматически.

Если хостинг использует nginx, но поддерживает PHP, можно использовать другой подход:

**Вариант А: Прямые ссылки через PHP**

Создайте файл `api/index.php` в `public_html`:

```php
<?php
require_once '../api-proxy.php';
?>
```

И настройте фронтенд на использование `/api/index.php` вместо `/api/v1`.

**Вариант Б: Спросите у поддержки про поддомен**

Напишите в поддержку:

> Здравствуйте! Мне нужно настроить поддомен api.coolbola.uz, который будет указывать на порт 8000.
> 
> Можно ли создать поддомен api.coolbola.uz и настроить его так, чтобы он проксировал запросы на 127.0.0.1:8000?

### 4. Альтернатива: Используйте поддомен для API

Если поддержка может настроить поддомен:

1. Создайте поддомен `api.coolbola.uz` через панель управления
2. Настройте его на порт 8000 (через поддержку)
3. Измените `REACT_APP_API_URL` в `.env` на `https://api.coolbola.uz/api/v1`
4. Пересоберите фронтенд:
   ```bash
   REACT_APP_API_URL=https://api.coolbola.uz/api/v1 npm run build
   ```

### 5. Проверка работы

- `https://coolbola.uz` - должен открыться сайт
- `https://coolbola.uz/api/v1/health` - должен вернуться JSON (через PHP прокси)
- Попробуйте зарегистрироваться/войти

## ⚠️ Важные замечания

1. **PHP должен быть включён** на хостинге
2. **mod_rewrite должен быть доступен** (для .htaccess)
3. **FastAPI должен слушать на 127.0.0.1:8000** (не 0.0.0.0)
4. **Проверьте права доступа** на файлы (chmod 644 для .php, 755 для директорий)

## 🔧 Если PHP прокси не работает

1. Проверьте, что PHP включён: создайте `test.php` с `<?php phpinfo(); ?>`
2. Проверьте логи ошибок PHP
3. Попробуйте напрямую открыть `api-proxy.php?path=/v1/health`
4. Свяжитесь с поддержкой для настройки поддомена

## 📝 Рекомендация

**Лучший вариант** - попросить поддержку настроить поддомен `api.coolbola.uz` на порт 8000. Это самый надёжный способ без изменения конфигурации nginx.

