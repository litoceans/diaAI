from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_admin_user
from app.models.user import UserUpdate
from datetime import datetime, timedelta
from typing import List, Optional

router = APIRouter()

@router.get("/users", response_model=List[dict])
async def list_users(
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """List all users (admin only)"""
    users = await db.users.find().to_list(None)
    return users

@router.get("/users/{user_id}", response_model=dict)
async def get_user(
    user_id: str,
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user by ID (admin only)"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    return user

@router.patch("/users/{user_id}", response_model=dict)
async def update_user(
    user_id: str,
    user_update: UserUpdate,
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user (admin only)"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    update_data = user_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = await db.users.update_one(
            {"_id": user_id},
            {"$set": update_data}
        )
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="User update failed"
            )
    
    return await db.users.find_one({"_id": user_id})

@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete user (admin only)"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Delete user's projects and diagrams
    projects = await db.projects.find({"user_id": user_id}).to_list(None)
    for project in projects:
        await db.diagrams.delete_many({"project_id": project["_id"]})
    await db.projects.delete_many({"user_id": user_id})
    
    # Delete user
    await db.users.delete_one({"_id": user_id})
    
    return {"message": "User and all associated data deleted successfully"}

@router.get("/stats", response_model=dict)
async def get_admin_stats(
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get overall statistics (admin only)"""
    total_users = await db.users.count_documents({})
    total_projects = await db.projects.count_documents({})
    total_diagrams = await db.diagrams.count_documents({})
    
    # Get active users in last 7 days
    week_ago = datetime.utcnow() - timedelta(days=7)
    active_users = await db.users.count_documents({
        "updated_at": {"$gte": week_ago}
    })
    
    # Get user plan distribution
    plan_distribution = await db.users.aggregate([
        {
            "$group": {
                "_id": "$plan",
                "count": {"$sum": 1}
            }
        }
    ]).to_list(None)
    
    # Get diagrams created per day for last 30 days
    month_ago = datetime.utcnow() - timedelta(days=30)
    daily_diagrams = await db.diagrams.aggregate([
        {
            "$match": {
                "created_at": {"$gte": month_ago}
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "count": {"$sum": 1}
            }
        },
        {
            "$sort": {"_id": 1}
        }
    ]).to_list(None)
    
    return {
        "total_users": total_users,
        "total_projects": total_projects,
        "total_diagrams": total_diagrams,
        "active_users_7d": active_users,
        "plan_distribution": {
            item["_id"]: item["count"] 
            for item in plan_distribution
        },
        "daily_diagrams": [
            {
                "date": f"{item['_id']['year']}-{item['_id']['month']}-{item['_id']['day']}",
                "count": item["count"]
            }
            for item in daily_diagrams
        ]
    }

@router.get("/projects", response_model=List[dict])
async def list_all_projects(
    skip: int = 0,
    limit: int = 10,
    user_id: Optional[str] = None,
    admin_id: str = Depends(get_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """List all projects (admin only)"""
    query = {}
    if user_id:
        query["user_id"] = user_id
        
    projects = await db.projects.find(query).skip(skip).limit(limit).to_list(None)
    return projects
