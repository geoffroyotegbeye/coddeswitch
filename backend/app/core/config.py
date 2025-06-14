from pydantic import BaseModel
from typing import List
import os
from dotenv import load_dotenv

# Charger les variables d'environnement depuis .env
load_dotenv()

class Settings(BaseModel):
    # Base
    PROJECT_NAME: str = "CodeSwitch API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Security
    SECRET_KEY: str = "your-super-secret-key-change-in-production"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    MONGODB_URL: str = "mongodb://localhost:27017"
    DATABASE_NAME: str = "codeswitch"
    
    # CORS
    ALLOWED_HOSTS: List[str] = [
        "http://localhost:5174",  # React dev server
        "http://localhost:5173",  # Vite dev server
        "http://127.0.0.1:5174",
        "http://127.0.0.1:5173"
    ]
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    
    class Config:
        case_sensitive = True

settings = Settings()