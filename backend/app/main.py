from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pathlib import Path
import os
from .core.config import settings
from .api.v1.api import api_router
from .db.base import Base
from .db.session import engine
from .admin import setup_admin

app = FastAPI(title=settings.PROJECT_NAME)

# Определяем путь к статическим файлам фронтенда
# Ищем build директорию: сначала в родительской директории, потом в корне проекта
FRONTEND_BUILD_DIR = None
env_build_dir = os.getenv("FRONTEND_BUILD_DIR")
if env_build_dir:
    FRONTEND_BUILD_DIR = Path(env_build_dir)
else:
    # Пробуем разные варианты путей
    backend_dir = Path(__file__).parent.parent.parent  # backend/
    project_root = backend_dir.parent  # корень проекта
    possible_paths = [
        project_root / "build",  # /home/.../sayt/build
        project_root / "frontend" / "build",  # если frontend в отдельной папке
        Path("/home/s1143023/coolbola.uz"),  # путь на сервере
        Path("/home/s1143023/domains/coolbola.uz/public_html/FindPro-syte/build"),  # альтернативный путь
    ]
    for path in possible_paths:
        if path.exists() and (path / "index.html").exists():
            FRONTEND_BUILD_DIR = path
            break

# Если нашли build директорию, подключаем статику
if FRONTEND_BUILD_DIR and FRONTEND_BUILD_DIR.exists():
    static_dir = Path(FRONTEND_BUILD_DIR) / "static"
    if static_dir.exists():
        app.mount("/static", StaticFiles(directory=str(static_dir)), name="static")

# Setup Admin Panel
setup_admin(app, engine)

# Initialize DB data
from .db.init_data import init
init()

from starlette.middleware.sessions import SessionMiddleware

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Add Session Middleware for Admin Panel
app.add_middleware(SessionMiddleware, secret_key=settings.SECRET_KEY)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    # Auto-create tables in non-production environments
    if getattr(settings, "APP_ENV", "development").lower() != "production":
        Base.metadata.create_all(bind=engine)

# Если есть фронтенд, отдаём его index.html, иначе JSON
@app.get("/")
async def read_root():
    if FRONTEND_BUILD_DIR and FRONTEND_BUILD_DIR.exists():
        index_path = Path(FRONTEND_BUILD_DIR) / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
    return {
        "message": "Welcome to FindPro API!", 
        "docs": "/docs", 
        "api": settings.API_V1_STR,
        "admin": "/admin"
    }

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "OK", "message": "FindPro API работает"}

# Catch-all маршрут для SPA: все запросы, которые не API/docs/admin, отдаём index.html
# Это должно быть последним, чтобы не перехватывать API маршруты
if FRONTEND_BUILD_DIR and FRONTEND_BUILD_DIR.exists():
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        # Пропускаем API, docs, admin, openapi.json, static
        if full_path.startswith(("api/", "docs", "admin", "openapi.json", "static", "health")):
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Not found")
        
        # Для всех остальных путей отдаём index.html (SPA routing)
        index_path = Path(FRONTEND_BUILD_DIR) / "index.html"
        if index_path.exists():
            return FileResponse(str(index_path))
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Frontend not found")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
