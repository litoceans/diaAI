from fastapi import APIRouter, Depends, HTTPException, status, Body
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_active_user
from app.models.user import UserUpdate, User, UpgradeRequest, ContactRequest
from datetime import datetime
from bson import ObjectId
from app.core.security import verify_google_token, create_access_token
from pydantic import BaseModel
from typing import Optional
from fastapi.security import OAuth2PasswordBearer

class GoogleAuthRequest(BaseModel):
    token: str

class UpgradeRequest(BaseModel):
    user_id: str
    plan: str
    firstName: str
    lastName: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None

class ContactRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    company: Optional[str] = None
    phone: Optional[str] = None
    message: str

router = APIRouter()

@router.get("/me", response_model=dict)
async def get_current_user_info(
    current_user: dict = Depends(get_current_active_user)
):
    """Get current user info"""
    return current_user

@router.patch("/me", response_model=dict)
async def update_user(
    user_update: UserUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Update user fields
    update_data = user_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User update failed"
            )
    
    return await db.users.find_one({"_id": current_user["_id"]})

@router.get("/credits", response_model=dict)
async def get_user_credits(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Get usage statistics
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    daily_usage = await db.diagrams.count_documents({
        "user_id": current_user["_id"],
        "created_at": {"$gte": today}
    })
    
    return {
        "credits": current_user["credits"],
        "plan": current_user["plan"],
        "daily_usage": daily_usage
    }

@router.get("/dashboard", response_model=dict)
async def get_dashboard_stats(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's dashboard statistics"""
    # Get user's diagrams count
    total_diagrams = await db.diagrams.count_documents({"user_id": str(current_user["_id"])})
    
    # Calculate credits usage
    total_credits = current_user.get("credits", 0)
    getTotalCredits = current_user.get("total_credits", 0)
    avlCredits = current_user.get("credits", 0)
    getTotalProjects = await db.projects.count_documents({"user_id": str(current_user["_id"])})
    credits_used = await db.diagrams.count_documents({
        "user_id": str(current_user["_id"]),
        "status": "completed"
    })

    return {
        "stats": {
            "creditsUsed": credits_used,
            "totalCredits": total_credits,
            "fullCredits": getTotalCredits,
            "totalDiagrams": total_diagrams,
            "totalProjects": getTotalProjects,
            "avlCredits": avlCredits
        },
        "user": {
            "plan": current_user.get("plan", "free"),
            "name": current_user.get("name"),
            "email": current_user.get("email"),
        }
    }

@router.get("/diagrams", response_model=list)
async def get_user_diagrams(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db),
    limit: int = 10
):
    """Get user's diagrams"""
    cursor = db.diagrams.find(
        {"user_id": str(current_user["_id"])}
    ).sort("created_at", -1).limit(limit)
    
    diagrams = []
    async for diagram in cursor:
        diagram["id"] = str(diagram["_id"])
        diagrams.append(diagram)
    
    return diagrams

@router.post("/auth/google")
async def google_auth(
    auth_request: GoogleAuthRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Authenticate user with Google Firebase token"""
    try:
        # Verify Firebase token using existing function
        decoded_token = await verify_google_token(auth_request.token)
        
        # Get user info from token
        email = decoded_token['email']
        name = decoded_token['name']
        picture = decoded_token['picture']
        firebase_uid = decoded_token['uid']
        
        # Check if user exists
        user = await db.users.find_one({"email": email})
        
        if not user:
            # Create new user
            user = {
                "_id": ObjectId(),
                "email": email,
                "name": name,
                "picture": picture,
                "firebase_uid": firebase_uid,
                "is_active": True,
                "created_at": datetime.utcnow(),
                "updated_at": datetime.utcnow(),
                "credits": 100  # Default credits for new users
            }
            await db.users.insert_one(user)
        else:
            # Update user's last login and Firebase UID
            await db.users.update_one(
                {"_id": user["_id"]},
                {"$set": {
                    "updated_at": datetime.utcnow(),
                    "name": name,
                    "picture": picture,
                    "firebase_uid": firebase_uid
                }}
            )
        
        # Create access token
        access_token = create_access_token(
            data={"sub": str(user["_id"]), "email": email}
        )
        
        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user": {
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user["name"],
                "picture": user["picture"],
                "credits": user.get("credits", 0)
            }
        }
        
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Authentication failed: {str(e)}"
        )

@router.post("/upgrade", response_model=dict)
async def upgrade_user(
    upgrade_request: UpgradeRequest,
    current_user: User = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Save upgrade request
        upgrade_data = upgrade_request.dict(exclude_unset=True)
        upgrade_data["created_at"] = datetime.utcnow()
        
        result = await db.upgrade_requests.insert_one(upgrade_data)
        
        # Update user's pending upgrade status
        await db.users.update_one(
            {"_id": ObjectId(upgrade_request.user_id)},
            {"$set": {"pending_upgrade": upgrade_request.plan}}
        )
        
        return {
            "message": "Upgrade request submitted successfully",
            "request_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.post("/contact", response_model=dict)
async def submit_contact(
    contact_request: ContactRequest,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Save contact request
        contact_data = contact_request.dict(exclude_unset=True)
        contact_data["created_at"] = datetime.utcnow()
        
        result = await db.contact_requests.insert_one(contact_data)
        
        return {
            "message": "Contact request submitted successfully",
            "request_id": str(result.inserted_id)
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(e)
        )

@router.get("/credits/usage", response_model=dict)
async def get_credits_usage(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get daily and monthly credits usage statistics"""
    from datetime import datetime, timedelta
    import calendar

    # Get current date and first day of current month
    today = datetime.utcnow()
    start_of_month = today.replace(day=1, hour=0, minute=0, second=0, microsecond=0)
    
    # Get last 7 days for daily stats
    daily_stats = []
    for i in range(7):
        date = today - timedelta(days=i)
        start_of_day = date.replace(hour=0, minute=0, second=0, microsecond=0)
        end_of_day = start_of_day + timedelta(days=1)
        
        count = await db.diagrams.count_documents({
            "user_id": str(current_user["_id"]),
            "created_at": {
                "$gte": start_of_day,
                "$lt": end_of_day
            },
            "status": "completed"
        })
        
        daily_stats.append({
            "date": start_of_day.strftime("%Y-%m-%d"),
            "count": count
        })
    
    # Get last 6 months for monthly stats
    monthly_stats = []
    for i in range(6):
        date = start_of_month - timedelta(days=30*i)
        end_of_month = date.replace(
            day=calendar.monthrange(date.year, date.month)[1],
            hour=23, minute=59, second=59
        )
        
        count = await db.diagrams.count_documents({
            "user_id": str(current_user["_id"]),
            "created_at": {
                "$gte": date,
                "$lt": end_of_month
            },
            "status": "completed"
        })
        
        monthly_stats.append({
            "month": date.strftime("%Y-%m"),
            "count": count
        })
    
    return {
        "daily": list(reversed(daily_stats)),
        "monthly": list(reversed(monthly_stats))
    }
