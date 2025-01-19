from typing import Generator, Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from firebase_admin import auth as firebase_auth
from app.core.database import db
from app.core.config import get_settings
from app.core.security import verify_token

settings = get_settings()
security = HTTPBearer()

async def get_db():
    """Get database instance."""
    try:
        database = db.get_db()
        return database
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database connection error: {str(e)}"
        )

async def get_current_user_id(
    credentials: HTTPAuthorizationCredentials = Depends(security)
) -> str:
    """Get current user ID from JWT token."""
    try:
        token = credentials.credentials
        payload = await verify_token(token)
        if not payload or "sub" not in payload:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return payload["sub"]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=f"Could not validate credentials: {str(e)}"
        )

async def get_current_active_user(
    user_id: str = Depends(get_current_user_id),
    db = Depends(get_db)
) -> dict:
    """Get current active user."""
    try:
        user = await db.users.find_one({"_id": user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        if user.get("disabled"):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is disabled"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error retrieving user: {str(e)}"
        )

async def get_current_admin_user(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """Get current admin user."""
    if not current_user.get("is_admin", False):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="User does not have admin privileges"
        )
    return current_user
