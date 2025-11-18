# 🏗️ Сборка фронтенда локально и развёртывание

Поскольку на хостинге старая версия glibc и node не работает, нужно собрать фронтенд локально.

## 📋 Шаги

### 1. На локальной машине соберите фронтенд

```bash
cd /home/kratos/sayt  # или путь к вашему проекту
npm run build
```

Это создаст директорию `build/` с готовыми статическими файлами.

### 2. Скопируйте build на сервер

**Вариант А: Через rsync (рекомендуется)**

```bash
rsync -avz --delete build/ user@coolbola.uz:/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/
```

**Вариант Б: Через scp**

```bash
scp -r build/* user@coolbola.uz:/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/
```

**Вариант В: Через панель управления хостингом**

1. Заархивируйте `build/` локально
2. Загрузите архив через панель управления
3. Распакуйте в нужную директорию

### 3. На сервере запустите скрипт развёртывания

```bash
cd /home/s1143023/domains/coolbola.uz/public_html/FindPro-syte
./deploy-to-public-html.sh
```

### 4. Запустите FastAPI

```bash
cd backend
source .venv/bin/activate
nohup uvicorn app.main:app --host 127.0.0.1 --port 8000 --workers 4 > backend.log 2>&1 &
```

## 🔄 Обновление фронтенда

При каждом изменении фронтенда:

1. **Локально:**
   ```bash
   npm run build
   rsync -avz --delete build/ user@coolbola.uz:/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/
   ```

2. **На сервере:**
   ```bash
   ./deploy-to-public-html.sh
   ```

## ✅ Проверка

- `https://coolbola.uz` - должен открыться сайт
- `https://coolbola.uz/api/v1/health` - должен вернуться JSON
- Попробуйте зарегистрироваться/войти

## 📝 Автоматизация (опционально)

Можно создать скрипт для автоматической сборки и загрузки:

```bash
#!/bin/bash
# deploy.sh - локальный скрипт

echo "🏗️  Собираю фронтенд..."
npm run build

echo "📤 Копирую на сервер..."
rsync -avz --delete build/ user@coolbola.uz:/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build/

echo "✅ Готово! Теперь на сервере запустите ./deploy-to-public-html.sh"
```

