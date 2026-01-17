FROM python:3.12-slim

WORKDIR /app

# Install system dependencies if needed (e.g. for psycopg2)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Expose port
EXPOSE 8000

# Command to run at start (init db and start server)
CMD ["bash", "-c", "python init_db.py && python seed_categories.py && python create_test_user.py && uvicorn main:app --host 0.0.0.0 --port 8000"]
