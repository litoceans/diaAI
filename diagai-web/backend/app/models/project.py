from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime

class ProjectBase(BaseModel):
    name: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass  # Removed user_id requirement since it comes from the auth token

class ProjectUpdate(ProjectBase):
    pass

class Project(ProjectBase):
    id: str
    user_id: str
    diagrams: List[str] = []
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
