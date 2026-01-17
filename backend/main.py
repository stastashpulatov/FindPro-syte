from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.api import api_router
from app.core.config import settings
from app.db.base import Base
from app.db.session import engine
from app.admin import setup_admin

from fastapi.staticfiles import StaticFiles

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    description="FindPro API - Service Marketplace",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# Mount static files
app.mount("/static", StaticFiles(directory="static"), name="static")

# Setup Admin Panel
setup_admin(app, engine)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS if settings.APP_ENV != "production" else settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    """Startup event handler"""
    print("=" * 60)
    print(f"🚀 {settings.PROJECT_NAME} starting...")
    print("=" * 60)
    print(f"Environment: {settings.APP_ENV}")
    print(f"Database: {settings.DATABASE_URL.split('://')[0]}")
    print(f"API Docs: http://localhost:8000/docs")
    print(f"Admin Panel: http://localhost:8000/admin")
    print("=" * 60)
    
    # Auto-create tables in non-production environments
    if settings.APP_ENV.lower() != "production":
        print("Creating database tables (development mode)...")
        Base.metadata.create_all(bind=engine)
        print("✓ Database tables ready")
    print("=" * 60)

@app.get("/")
async def read_root():
    """Root endpoint with API information"""
    return {
        "message": f"Welcome to {settings.PROJECT_NAME}!", 
        "version": "2.0.0",
        "docs": "/docs",
        "redoc": "/redoc", 
        "api": settings.API_V1_STR,
        "admin": "/admin",
        "environment": settings.APP_ENV
    }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "OK",
        "environment": settings.APP_ENV,
        "database": "connected"
    }
