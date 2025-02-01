from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime

class DiagramBase(BaseModel):
    prompt: str
    type: str = "image"  # Default to static image
    project_id: str

class DiagramCreate(DiagramBase):
    generation_type: str
    pass  # Remove user_id requirement since it comes from auth token

class DiagramUpdate(BaseModel):
    prompt: Optional[str] = None
    type: Optional[str] = None
    status: Optional[str] = None
    url: Optional[str] = None
    frames: Optional[List[str]] = None

class Diagram(DiagramBase):
    id: str
    user_id: str
    status: str = "processing"
    url: Optional[str] = None
    frames: List[str] = []
    credits_used: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
