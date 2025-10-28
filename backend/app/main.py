from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .core.config import settings
from .api.v1.api import api_router
from .db.base import Base
from .db.session import engine
from .admin import setup_admin

app = FastAPI(title=settings.PROJECT_NAME)

# Setup Admin Panel
setup_admin(app, engine)

# Set up CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix=settings.API_V1_STR)

@app.on_event("startup")
async def on_startup():
    # Auto-create tables in non-production environments
    if getattr(settings, "APP_ENV", "development").lower() != "production":
        Base.metadata.create_all(bind=engine)

@app.get("/")
async def read_root():
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

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
