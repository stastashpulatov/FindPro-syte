from pydantic import BaseSettings, validator, root_validator, Field
from typing import Optional, List, Dict, Any

class Settings(BaseSettings):
    """Application settings and configuration"""
    
    # Project Info
    PROJECT_NAME: str = "FindPro API"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-secret-key-here"  # Change in production
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days
    
    # Database
    DATABASE_URL: str = "sqlite:///./findpro.db"
    TEST_DATABASE_URL: str = "sqlite:///./test_findpro.db"
    
    # Environment
    APP_ENV: str = "development"  # development, test, production
    DEBUG: bool = False
    
    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5000",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5000",
    ]
    
    # Optional database URLs
    MYSQL_DATABASE_URL: str = ""
    POSTGRES_DATABASE_URL: str = ""
    
    # Admin
    FIRST_SUPERUSER_EMAIL: str = ""
    FIRST_SUPERUSER_PASSWORD: str = ""
    
    @validator('ALLOWED_ORIGINS', pre=True)
    def parse_cors_origins(cls, v: Any) -> Any:
        """Parse CORS origins from string or list"""
        if isinstance(v, str):
            return [origin.strip() for origin in v.split(',')]
        return v
    
    @root_validator(pre=False)
    def set_database_url(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Select DB URL based on environment"""
        app_env = values.get("APP_ENV", "development")
        mysql_url = values.get("MYSQL_DATABASE_URL")
        postgres_url = values.get("POSTGRES_DATABASE_URL")
        
        if app_env.lower() == "test" and mysql_url:
            values["DATABASE_URL"] = mysql_url
        elif app_env.lower() == "production" and postgres_url:
            values["DATABASE_URL"] = postgres_url
        return values
    
    @root_validator(pre=False)
    def validate_production_settings(cls, values: Dict[str, Any]) -> Dict[str, Any]:
        """Validate critical settings for production"""
        app_env = values.get("APP_ENV", "development")
        secret_key = values.get("SECRET_KEY")
        
        if app_env.lower() == "production":
            if secret_key == "your-secret-key-here":
                raise ValueError(
                    "SECRET_KEY must be changed in production! "
                    "Generate with: python -c 'import secrets; print(secrets.token_urlsafe(32))'"
                )
        return values
    
    class Config:
        case_sensitive = True
        env_file = ".env"
        extra = "ignore"

settings = Settings()
