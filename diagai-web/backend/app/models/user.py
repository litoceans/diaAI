from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional, List, Dict
from datetime import datetime
from app.core.config import get_settings

settings = get_settings()

class UserBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None
    avatar_url: Optional[str] = None

class UserCreate(UserBase):
    firebase_uid: str
    
class UserUpdate(BaseModel):
    name: Optional[str] = None
    avatar_url: Optional[str] = None
    credits: Optional[int] = None
    plan: Optional[str] = None
    account_status: Optional[str] = None
    preferences: Optional[Dict] = None
    company: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None

    @validator('plan')
    def validate_plan(cls, v):
        if v and v not in settings.PLANS:
            raise ValueError(f"Invalid plan. Must be one of: {list(settings.PLANS.keys())}")
        return v

    @validator('account_status')
    def validate_status(cls, v):
        valid_statuses = ['active', 'inactive', 'suspended']
        if v and v not in valid_statuses:
            raise ValueError(f"Invalid status. Must be one of: {valid_statuses}")
        return v

class User(UserBase):
    id: str = Field(..., alias="_id")
    firebase_uid: str
    credits: int = 10  # Default credits for new users
    plan: str = "free"  # Default plan
    account_status: str = "active"
    preferences: Dict = Field(default_factory=lambda: {
        "theme": "light",
        "notifications": True,
        "language": "en"
    })
    is_admin: bool = False
    last_login: Optional[datetime] = None
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)
    company: Optional[str] = None
    role: Optional[str] = None
    bio: Optional[str] = None

    class Config:
        from_attributes = True
        populate_by_name = True
        json_encoders = {
            datetime: lambda v: v.isoformat()
        }

    @property
    def features(self) -> List[str]:
        """Get available features based on user's plan."""
        return settings.PLANS[self.plan]["features"]

    @property
    def max_projects(self) -> int:
        """Get maximum allowed projects based on user's plan."""
        return settings.PLANS[self.plan]["max_projects"]

    @property
    def monthly_credits(self) -> int:
        """Get monthly credit allowance based on user's plan."""
        return settings.PLANS[self.plan]["credits_per_month"]

class GoogleSignInRequest(BaseModel):
    id_token: str
