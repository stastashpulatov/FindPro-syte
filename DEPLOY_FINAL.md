# 🚀 Финальное развёртывание FindPro (без nginx)

Полностью автоматическое развёртывание с PHP-прокси.

## 📋 Быстрый старт

### 1. Запустите скрипт развёртывания

```bash
cd /home/kratos/sayt
./deploy-to-public-html.sh
```

Скрипт автоматически:
- Соберёт фронтенд (если нужно)
- Скопирует файлы в `public_html`
- Настроит PHP-прокси

### 2. Запустите FastAPI

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

### 3. Проверьте работу

- `https://coolbola.uz` - должен открыться сайт
- `https://coolbola.uz/api/v1/health` - должен вернуться JSON
- Попробуйте зарегистрироваться/войти

## 🔧 Как это работает

1. **Фронтенд** лежит в `public_html/` и отдаётся nginx напрямую
2. **API запросы** (`/api/*`) перенаправляются через PHP-прокси (`api/index.php`)
3. **PHP-прокси** перенаправляет запросы на FastAPI на порту 8000
4. **FastAPI** обрабатывает API запросы и возвращает ответы

## 📁 Структура файлов в public_html

```
public_html/
├── index.html          # React приложение
├── static/            # Статические файлы (CSS, JS)
├── api/
│   └── index.php      # PHP прокси для API
└── .htaccess          # Правила для Apache (если используется)
```

## ⚙️ Ручная настройка (если скрипт не работает)

### 1. Соберите фронтенд

```bash
cd /home/kratos/sayt
npm run build
```

### 2. Скопируйте файлы

```bash
# Фронтенд
cp -r build/* /home/s1143023/domains/coolbola.uz/public_html/

# PHP прокси
mkdir -p /home/s1143023/domains/coolbola.uz/public_html/api
cp api-proxy.php /home/s1143023/domains/coolbola.uz/public_html/api/index.php
```

### 3. Запустите FastAPI

```bash
cd backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

## 🔍 Проверка и отладка

### Проверьте PHP

Создайте файл `test.php` в `public_html`:

```php
<?php phpinfo(); ?>
```

Откройте `https://coolbola.uz/test.php` - должна показаться информация о PHP.

### Проверьте FastAPI

```bash
curl http://127.0.0.1:8000/health
```

Должен вернуться: `{"status":"OK","message":"FindPro API работает"}`

### Проверьте PHP прокси

Откройте `https://coolbola.uz/api/v1/health` - должен вернуться JSON от FastAPI.

### Логи

```bash
# Логи FastAPI
tail -f backend.log

# Логи PHP (если доступны)
tail -f /var/log/php-fpm/error.log
```

## ⚠️ Решение проблем

### "Network Error" при запросах к API

1. Проверьте, что FastAPI запущен:
   ```bash
   ps aux | grep uvicorn
   ```

2. Проверьте порт:
   ```bash
   netstat -tlnp | grep 8000
   ```

3. Проверьте PHP прокси:
   ```bash
   curl https://coolbola.uz/api/v1/health
   ```

### Фронтенд не обновляется

1. Очистите кэш браузера (Ctrl+Shift+R)
2. Проверьте, что файлы скопированы:
   ```bash
   ls -la /home/s1143023/domains/coolbola.uz/public_html/
   ```

### PHP ошибки

1. Проверьте права доступа:
   ```bash
   chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php
   chmod 755 /home/s1143023/domains/coolbola.uz/public_html/api
   ```

2. Проверьте логи PHP (через панель управления хостингом)

## 📝 Обновление

При обновлении кода:

1. Пересоберите фронтенд:
   ```bash
   cd /home/kratos/sayt
   npm run build
   ```

2. Скопируйте новые файлы:
   ```bash
   ./deploy-to-public-html.sh
   ```

3. Перезапустите FastAPI:
   ```bash
   pkill -f 'uvicorn app.main:app'
   cd backend
   source .venv/bin/activate
   nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
   ```

## ✅ Готово!

После выполнения всех шагов сайт должен работать полностью:
- ✅ Фронтенд отдаётся через nginx
- ✅ API запросы проксируются через PHP на FastAPI
- ✅ Регистрация и вход работают
- ✅ Все функции доступны

