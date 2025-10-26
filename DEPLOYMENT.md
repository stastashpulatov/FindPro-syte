# 🚀 Руководство по развертыванию FindPro

## Варианты развертывания

### 1. Локальная разработка (Development)

Используйте SQLite и встроенный сервер разработки.

```bash
./start.sh
```

---

### 2. Production на VPS (Ubuntu/Debian)

#### Требования
- Ubuntu 20.04+ / Debian 11+
- Python 3.8+
- Node.js 16+
- Nginx
- PostgreSQL (опционально)

#### Шаг 1: Подготовка сервера

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите зависимости
sudo apt install -y python3-pip python3-venv nginx postgresql postgresql-contrib nodejs npm

# Установите PM2 для управления процессами
sudo npm install -g pm2
```

#### Шаг 2: Настройка PostgreSQL

```bash
# Войдите в PostgreSQL
sudo -u postgres psql

# Создайте базу данных и пользователя
CREATE DATABASE findpro;
CREATE USER findpro_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE findpro TO findpro_user;
\q
```

#### Шаг 3: Клонирование проекта

```bash
cd /var/www
sudo git clone https://github.com/yourusername/findpro.git
sudo chown -R $USER:$USER findpro
cd findpro
```

#### Шаг 4: Настройка Backend

```bash
cd backend

# Создайте виртуальное окружение
python3 -m venv .venv
source .venv/bin/activate

# Установите зависимости
pip install -r requirements.txt

# Настройте .env
cat > .env << EOF
DATABASE_URL=postgresql://findpro_user:your_secure_password@localhost/findpro
SECRET_KEY=$(openssl rand -hex 32)
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=1440
API_V1_STR=/api/v1
PROJECT_NAME=FindPro API
BACKEND_CORS_ORIGINS=["https://yourdomain.com"]
EOF

# Инициализируйте базу данных
python init_db.py
python create_test_user.py
```

#### Шаг 5: Настройка Frontend

```bash
cd /var/www/findpro

# Установите зависимости
npm install

# Создайте .env для production
cat > .env << EOF
REACT_APP_API_URL=https://api.yourdomain.com/api/v1
EOF

# Соберите production версию
npm run build
```

#### Шаг 6: Настройка Nginx

```bash
sudo nano /etc/nginx/sites-available/findpro
```

Добавьте конфигурацию:

```nginx
# Frontend
server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;

    root /var/www/findpro/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /static/ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}

# Backend API
server {
    listen 80;
    server_name api.yourdomain.com;

    location / {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Активируйте конфигурацию:

```bash
sudo ln -s /etc/nginx/sites-available/findpro /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Шаг 7: Настройка SSL (Let's Encrypt)

```bash
# Установите Certbot
sudo apt install -y certbot python3-certbot-nginx

# Получите сертификаты
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com -d api.yourdomain.com

# Автообновление сертификатов
sudo certbot renew --dry-run
```

#### Шаг 8: Запуск Backend с PM2

```bash
cd /var/www/findpro/backend

# Создайте ecosystem файл для PM2
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: 'findpro-api',
    script: '.venv/bin/uvicorn',
    args: 'main:app --host 0.0.0.0 --port 8000',
    cwd: '/var/www/findpro/backend',
    instances: 2,
    exec_mode: 'cluster',
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production'
    }
  }]
}
EOF

# Запустите приложение
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

#### Шаг 9: Настройка firewall

```bash
sudo ufw allow 'Nginx Full'
sudo ufw allow OpenSSH
sudo ufw enable
```

---

### 3. Docker развертывание

#### Создайте Dockerfile для Backend

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Создайте Dockerfile для Frontend

```dockerfile
# Dockerfile
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: findpro
      POSTGRES_USER: findpro_user
      POSTGRES_PASSWORD: secure_password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://findpro_user:secure_password@postgres/findpro
      SECRET_KEY: your-secret-key
    depends_on:
      - postgres
    volumes:
      - ./backend:/app
    command: uvicorn main:app --host 0.0.0.0 --port 8000 --reload

  frontend:
    build: .
    ports:
      - "80:80"
    depends_on:
      - backend

volumes:
  postgres_data:
```

Запуск:

```bash
docker-compose up -d
```

---

### 4. Heroku развертывание

#### Backend на Heroku

```bash
# Создайте Procfile
echo "web: uvicorn main:app --host 0.0.0.0 --port \$PORT" > backend/Procfile

# Создайте runtime.txt
echo "python-3.11.0" > backend/runtime.txt

# Деплой
cd backend
heroku create findpro-api
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set SECRET_KEY=$(openssl rand -hex 32)
git push heroku main
```

#### Frontend на Vercel/Netlify

**Vercel:**
```bash
npm install -g vercel
vercel --prod
```

**Netlify:**
```bash
npm install -g netlify-cli
netlify deploy --prod
```

---

### 5. AWS развертывание

#### Backend на AWS Elastic Beanstalk

```bash
# Установите EB CLI
pip install awsebcli

# Инициализируйте
cd backend
eb init -p python-3.11 findpro-api

# Создайте окружение
eb create findpro-api-env

# Деплой
eb deploy
```

#### Frontend на AWS S3 + CloudFront

```bash
# Соберите проект
npm run build

# Загрузите на S3
aws s3 sync build/ s3://findpro-frontend --delete

# Настройте CloudFront для CDN
```

---

## Мониторинг и обслуживание

### Логи

```bash
# PM2 логи
pm2 logs findpro-api

# Nginx логи
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# PostgreSQL логи
sudo tail -f /var/log/postgresql/postgresql-*.log
```

### Backup базы данных

```bash
# Создайте backup скрипт
cat > /home/$USER/backup-db.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/$USER/backups"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR
pg_dump -U findpro_user findpro > $BACKUP_DIR/findpro_$DATE.sql
find $BACKUP_DIR -name "findpro_*.sql" -mtime +7 -delete
EOF

chmod +x /home/$USER/backup-db.sh

# Добавьте в crontab (ежедневно в 2:00)
(crontab -l 2>/dev/null; echo "0 2 * * * /home/$USER/backup-db.sh") | crontab -
```

### Обновление приложения

```bash
# Backend
cd /var/www/findpro/backend
git pull
source .venv/bin/activate
pip install -r requirements.txt
pm2 restart findpro-api

# Frontend
cd /var/www/findpro
git pull
npm install
npm run build
sudo systemctl reload nginx
```

---

## Checklist перед деплоем

- [ ] Изменен SECRET_KEY в .env
- [ ] Настроен PostgreSQL
- [ ] Настроен CORS для production домена
- [ ] Установлен SSL сертификат
- [ ] Настроен firewall
- [ ] Настроены backup'ы
- [ ] Настроен мониторинг
- [ ] Проверены все environment variables
- [ ] Удалены тестовые пользователи (опционально)
- [ ] Настроен email сервис
- [ ] Проверена производительность

---

**Готово! Ваше приложение развернуто! 🎉**
