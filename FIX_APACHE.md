# 🔧 Исправление для Apache

Если на хостинге используется Apache (видна ошибка 404 с упоминанием Apache), нужно:

## 1. Обновите .htaccess на сервере

Скопируйте обновлённый `.htaccess` на сервер:

```bash
# Локально
scp .htaccess s1143023@coolbola.uz:/home/s1143023/domains/coolbola.uz/public_html/
```

Или через панель управления хостингом - отредактируйте файл `.htaccess` в `public_html`.

## 2. Проверьте структуру файлов

На сервере должно быть:

```
public_html/
├── index.html
├── static/
├── .htaccess          ← должен быть здесь
└── api/
    └── index.php      ← PHP прокси
```

## 3. Проверьте права доступа

```bash
chmod 644 /home/s1143023/domains/coolbola.uz/public_html/.htaccess
chmod 644 /home/s1143023/domains/coolbola.uz/public_html/api/index.php
chmod 755 /home/s1143023/domains/coolbola.uz/public_html/api
```

## 4. Проверьте работу

```bash
# Проверьте FastAPI
curl http://127.0.0.1:8000/api/v1/health

# Проверьте через Apache
curl https://coolbola.uz/api/v1/health
```

## 5. Если не работает, проверьте логи Apache

Обычно логи находятся в панели управления хостингом или:
```bash
tail -f /var/log/apache2/error.log
```

## Альтернатива: Прямой доступ к PHP

Если `.htaccess` не работает, можно создать файл `api.php` в корне `public_html`:

```php
<?php
// api.php - прямой доступ
require_once __DIR__ . '/api/index.php';
?>
```

И обращаться к `https://coolbola.uz/api.php/v1/health` (но это не идеально).

