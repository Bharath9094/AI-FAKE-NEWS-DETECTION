import os

try:
    from pydantic_settings import BaseSettings
except ImportError:
    try:
        from pydantic import BaseSettings
    except ImportError:
        class BaseSettings:
            pass

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Fake News Detection Platform"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-jwt-key-change-in-production-2026-fake-news-detector")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7 # 7 days
    
    # Database (Default to SQLite in app root, easily configured for PostgreSQL)
    DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql://neondb_owner:npg_OWP9xaX0ieRr@ep-broad-mud-avwvj2lw-pooler.c-11.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require")
    
    # NVIDIA NIM LLM Settings
    NVIDIA_NIM_API_KEY: str = os.getenv("NVIDIA_NIM_API_KEY", "")
    NVIDIA_NIM_BASE_URL: str = os.getenv("NVIDIA_NIM_BASE_URL", "https://integrate.api.nvidia.com/v1")
    NVIDIA_MODEL_NAME: str = "meta/llama-3.3-70b-instruct"
    
    # CORS
    CORS_ORIGINS: list = [
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "*"
    ]

settings = Settings()
