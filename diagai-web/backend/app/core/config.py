from typing import Dict, List, Optional
from pydantic_settings import BaseSettings
from pydantic import Field, model_validator
from functools import lru_cache
import os

# Define plan structure as a constant
DEFAULT_PLANS = {
    "free": {
        "credits_per_month": 10,
        "max_projects": 3,
        "features": ["image_generation"]
    },
    "pro": {
        "credits_per_month": 100,
        "max_projects": 10,
        "features": ["image_generation", "gif_generation"]
    },
    "enterprise": {
        "credits_per_month": 1000,
        "max_projects": -1,
        "features": ["image_generation", "gif_generation", "priority_support"]
    }
}

class Settings(BaseSettings):
    # Environment settings
    ENV: str = Field(default="development")
    DEBUG: bool = Field(default=True)
    
    # API settings
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "DiaAI"
    
    # CORS settings
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:3000",  # Next.js frontend
        "http://localhost:8000",  # FastAPI backend
    ]
    
    # MongoDB settings
    MONGODB_URL: str = Field(default="mongodb://localhost:27017")
    MONGODB_TEST_URL: str = Field(default="mongodb://localhost:27017/diagai_test_db")
    
    # JWT settings
    SECRET_KEY: str = Field(default="your-secret-key")
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 240
    
    # Firebase settings
    FIREBASE_PROJECT_ID: str = Field(default="")
    FIREBASE_PRIVATE_KEY: str = Field(default="")
    FIREBASE_CLIENT_EMAIL: str = Field(default="")
    FIREBASE_CREDENTIALS: str = Field(default="firebase-credentials.json")
    
    # Storage settings
    STORAGE_PATH: str = Field(default="storage")
    STORAGE_URL: str = Field(default="http://localhost:8000/storage")
    
    # AWS settings
    AWS_ACCESS_KEY: str = Field(default="your-aws-access-key")
    AWS_SECRET_KEY: str = Field(default="your-aws-secret-key")
    AWS_BACKUP_BUCKET: str = Field(default="your-backup-bucket-name")
    
    # OpenAI settings
    OPENAI_API_KEY: str = Field(default="")
    OPENAI_MODEL: str = "dall-e-3"
    OPENAI_IMAGE_SIZE: str = "1024x1024"
    OPENAI_IMAGE_QUALITY: str = "standard"
    
    # Rate limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_ENABLED: bool = Field(default=True)
    
    # Logging
    LOG_LEVEL: str = Field(default="INFO")
    LOG_FORMAT: str = Field(default="json")
    LOG_FILE: str = Field(default="app.log")
    
    # Metrics
    ENABLE_METRICS: bool = Field(default=True)
    METRICS_AUTH_TOKEN: str = Field(default="your-metrics-auth-token")
    
    # Plan credits
    FREE_PLAN_CREDITS: int = Field(default=10)
    PRO_PLAN_CREDITS: int = Field(default=100)
    ENTERPRISE_PLAN_CREDITS: int = Field(default=1000)

    GROQ_API_KEY: str = Field(default="your-groq-api-key")

    # Plans configuration - this will be populated in the model_validator
    PLANS: Dict = Field(default_factory=lambda: DEFAULT_PLANS)
    
    class Config:
        env_file = ".env"
        case_sensitive = True

    @model_validator(mode='after')
    def validate_plans(self):
        """Validate and set the plans after model initialization"""
        if not hasattr(self, 'PLANS'):
            self.PLANS = DEFAULT_PLANS.copy()
        
        # Update plan credits from environment variables
        if hasattr(self, 'FREE_PLAN_CREDITS'):
            self.PLANS['free']['credits_per_month'] = self.FREE_PLAN_CREDITS
        if hasattr(self, 'PRO_PLAN_CREDITS'):
            self.PLANS['pro']['credits_per_month'] = self.PRO_PLAN_CREDITS
        if hasattr(self, 'ENTERPRISE_PLAN_CREDITS'):
            self.PLANS['enterprise']['credits_per_month'] = self.ENTERPRISE_PLAN_CREDITS
        
        return self

@lru_cache()
def get_settings() -> Settings:
    return Settings()
