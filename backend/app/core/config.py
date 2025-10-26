from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "FindPro API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./findpro.db"
    TEST_DATABASE_URL: str = "sqlite:///./test_findpro.db"
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
