from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from datetime import timedelta
from app.core.security import create_access_token, ACCESS_TOKEN_EXPIRE_MINUTES, verify_google_token
from app.api.deps import get_db, get_current_user_id
from app.models.user import UserCreate, User, GoogleSignInRequest
from datetime import datetime
from bson import ObjectId
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
import os
import dotenv
dotenv.load_dotenv()
getfreePlan = os.getenv("FREE_PLAN_CREDITS")

router = APIRouter()
security = HTTPBearer()

@router.post("/google", response_model=dict)
async def google_signin(
    request: GoogleSignInRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Verify Google token
        decoded_token = await verify_google_token(request.id_token)
        
        # Check if user exists
        user = await db.users.find_one({"firebase_uid": decoded_token["uid"]})
        
        if not user:
            # Create new user
            user_dict = {
                "_id": str(ObjectId()),
                "firebase_uid": decoded_token["uid"],
                "email": decoded_token["email"],
                "name": decoded_token.get("name", ""),
                "photo_url": decoded_token.get("picture", ""),
                "credits": int(getfreePlan),  # Default credits
                "total_credits": int(getfreePlan),
                "plan": "free",
                "account_status": "active",
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow()
            }
            
            await db.users.insert_one(user_dict)
            user = user_dict
        else:
            # Update user's last login
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {"updated_at": datetime.utcnow()}}
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["_id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/signup", response_model=dict)
async def signup(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Get user from database
        user = await db.users.find_one({"_id": current_user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        if user["account_status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["_id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/login", response_model=dict)
async def login(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Get user from database
        user = await db.users.find_one({"_id": current_user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        if user["account_status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        # Create access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["_id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )

@router.post("/refresh", response_model=dict)
async def refresh_token(
    current_user_id: str = Depends(get_current_user_id),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Get user from database
        user = await db.users.find_one({"_id": current_user_id})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
            
        if user["account_status"] != "active":
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Account is not active"
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user["_id"]},
            expires_delta=access_token_expires
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": user
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=str(e)
        )
