from pydantic_settings import BaseSettings
from typing import Optional
from pydantic import model_validator

class Settings(BaseSettings):
    PROJECT_NAME: str = "FindPro API"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    # Base default (development)
    DATABASE_URL: str = "sqlite:///./findpro.db"
    TEST_DATABASE_URL: str = "sqlite:///./test_findpro.db"

    # Environment selection
    APP_ENV: str = "development"  # values: development, test, production

    # Optional alternative URLs
    MYSQL_DATABASE_URL: Optional[str] = None
    POSTGRES_DATABASE_URL: Optional[str] = None

    @model_validator(mode="after")
    def set_database_url(self):
        # Select DB URL based on environment if provided
        if self.APP_ENV.lower() == "test" and self.MYSQL_DATABASE_URL:
            self.DATABASE_URL = self.MYSQL_DATABASE_URL
        elif self.APP_ENV.lower() == "production" and self.POSTGRES_DATABASE_URL:
            self.DATABASE_URL = self.POSTGRES_DATABASE_URL
        # otherwise keep default DATABASE_URL
        return self
    
    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
