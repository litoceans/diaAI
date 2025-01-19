from fastapi import APIRouter, Depends, HTTPException, status, Query, Request
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_admin_user
from datetime import datetime, timedelta
from typing import Optional, List
from bson import ObjectId
from fastapi.responses import JSONResponse
from app.core.security import create_access_token
from app.core.config import get_settings
from pydantic import BaseModel
import math
import logging

settings = get_settings()
logger = logging.getLogger(__name__)

router = APIRouter()

class AdminLoginRequest(BaseModel):
    email: str
    password: str

# Static admin credentials (in production, use environment variables and proper hashing)
ADMIN_EMAIL = "admin@example.com"
ADMIN_PASSWORD = "admin123"

@router.get("/users", response_model=dict)
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(""),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get paginated list of users"""
    try:
        # Build query
        query = {}
        if search:
            query["$or"] = [
                {"email": {"$regex": search, "$options": "i"}},
                {"name": {"$regex": search, "$options": "i"}}
            ]

        # Get total count
        total = await db.users.count_documents(query)

        # Sort direction
        sort_direction = -1 if sort_order.lower() == "desc" else 1

        # Get users with pagination
        users = await db.users.find(query) \
            .sort(sort_by, sort_direction) \
            .skip((page - 1) * limit) \
            .limit(limit) \
            .to_list(length=None)

        # Process users for response
        user_list = []
        for user in users:
            user_list.append({
                "id": str(user["_id"]),
                "email": user["email"],
                "name": user.get("name", ""),
                "credits": user.get("credits", 0),
                "is_admin": user.get("is_admin", False),
                "created_at": user.get("created_at", ""),
                "last_login": user.get("last_login", ""),
                "status": user.get("status", "active"),
                "total_diagrams": await db.diagrams.count_documents({"user_id": str(user["_id"])})
            })

        return {
            "users": user_list,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit) if total > 0 else 1
        }

    except Exception as e:
        logger.error(f"Error getting users: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting users"
        )

@router.get("/stats")
async def get_admin_stats(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get admin dashboard statistics"""
    try:
        logger.info("Fetching admin dashboard statistics...")
        
        # Get total users
        total_users = await db.users.count_documents({})
        logger.info(f"Total users: {total_users}")
        
        # Get users registered in last 30 days
        thirty_days_ago = datetime.utcnow() - timedelta(days=30)
        new_users_query = {
            "$or": [
                {"created_at": {"$gte": thirty_days_ago}},
                {"createdAt": {"$gte": thirty_days_ago}}  # Handle both field names
            ]
        }
        new_users = await db.users.count_documents(new_users_query)
        logger.info(f"New users in last 30 days: {new_users}")
        
        # Get total diagrams
        total_diagrams = await db.diagrams.count_documents({})
        logger.info(f"Total diagrams: {total_diagrams}")
        
        # Get diagrams created in last 30 days
        new_diagrams_query = {
            "$or": [
                {"created_at": {"$gte": thirty_days_ago}},
                {"createdAt": {"$gte": thirty_days_ago}}  # Handle both field names
            ]
        }
        new_diagrams = await db.diagrams.count_documents(new_diagrams_query)
        logger.info(f"New diagrams in last 30 days: {new_diagrams}")
        
        # Get total credits used
        credits_pipeline = [
            {
                "$group": {
                    "_id": None,
                    "total_credits": {
                        "$sum": {
                            "$cond": [
                                {"$ifNull": ["$credits", False]},
                                "$credits",
                                0
                            ]
                        }
                    }
                }
            }
        ]
        credits_result = await db.users.aggregate(credits_pipeline).to_list(length=1)
        total_credits = credits_result[0]["total_credits"] if credits_result else 0
        logger.info(f"Total credits used: {total_credits}")
        
        # Get active users (users who created diagrams in last 30 days)
        active_users_query = {
            "$or": [
                {"created_at": {"$gte": thirty_days_ago}},
                {"createdAt": {"$gte": thirty_days_ago}}
            ]
        }
        active_users = await db.diagrams.distinct("user_id", active_users_query)
        active_users_count = len(active_users) if active_users else 0
        logger.info(f"Active users in last 30 days: {active_users_count}")
        
        # Get diagrams by status
        status_pipeline = [
            {
                "$group": {
                    "_id": {
                        "$ifNull": ["$status", "pending"]  # Default status if not set
                    },
                    "count": {"$sum": 1}
                }
            }
        ]
        status_counts = await db.diagrams.aggregate(status_pipeline).to_list(length=None)
        diagrams_by_status = {
            item["_id"]: item["count"] 
            for item in status_counts
        }
        logger.info(f"Diagrams by status: {diagrams_by_status}")
        
        # Add some sample data if no data exists (for testing)
        if total_users == 0 and total_diagrams == 0:
            logger.warning("No data found in database, adding sample data...")
            await add_sample_data(db)
            return await get_admin_stats(db)
        
        stats = {
            "users": {
                "total": total_users,
                "new": new_users,
                "active": active_users_count
            },
            "diagrams": {
                "total": total_diagrams,
                "new": new_diagrams,
                "by_status": diagrams_by_status or {"pending": 0, "completed": 0}
            },
            "credits": {
                "total": total_credits
            }
        }
        
        logger.info(f"Returning stats: {stats}")
        return stats
        
    except Exception as e:
        logger.error(f"Error getting admin stats: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error getting admin statistics: {str(e)}"
        )

async def add_sample_data(db: AsyncIOMotorDatabase):
    """Add sample data for testing"""
    try:
        # Add sample users
        sample_users = [
            {
                "_id": ObjectId(),
                "email": "user1@example.com",
                "name": "User 1",
                "credits": 100,
                "created_at": datetime.utcnow() - timedelta(days=40),
                "is_admin": False
            },
            {
                "_id": ObjectId(),
                "email": "user2@example.com",
                "name": "User 2",
                "credits": 50,
                "created_at": datetime.utcnow() - timedelta(days=15),
                "is_admin": False
            }
        ]
        await db.users.insert_many(sample_users)
        
        # Add sample diagrams
        sample_diagrams = [
            {
                "user_id": str(sample_users[0]["_id"]),
                "status": "completed",
                "created_at": datetime.utcnow() - timedelta(days=35)
            },
            {
                "user_id": str(sample_users[0]["_id"]),
                "status": "pending",
                "created_at": datetime.utcnow() - timedelta(days=10)
            },
            {
                "user_id": str(sample_users[1]["_id"]),
                "status": "completed",
                "created_at": datetime.utcnow() - timedelta(days=5)
            }
        ]
        await db.diagrams.insert_many(sample_diagrams)
        
        logger.info("Added sample data successfully")
    except Exception as e:
        logger.error(f"Error adding sample data: {str(e)}")
        raise

@router.get("/diagrams", response_model=dict)
async def get_diagrams(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: Optional[str] = None,
    status: Optional[str] = Query(None, enum=["completed", "failed"]),
    type: Optional[str] = Query(None, enum=["image", "gif"]),
    sort_by: Optional[str] = Query(None, enum=["created_at", "status", "type"]),
    sort_order: Optional[str] = Query("desc", enum=["asc", "desc"]),
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get paginated list of diagrams with filters"""
    skip = (page - 1) * limit
    query = {}
    
    if search:
        query["title"] = {"$regex": search, "$options": "i"}
    if status:
        query["status"] = status
    if type:
        query["type"] = type
    
    # Get total count for pagination
    total_count = await db.diagrams.count_documents(query)
    
    # Prepare sort query
    sort_field = sort_by if sort_by else "created_at"
    sort_direction = -1 if sort_order == "desc" else 1
    
    # Get diagrams with pagination
    diagrams = await db.diagrams.find(query) \
        .sort(sort_field, sort_direction) \
        .skip(skip) \
        .limit(limit) \
        .to_list(None)
    
    # Get user details for each diagram
    for diagram in diagrams:
        user = await db.users.find_one({"_id": diagram["user_id"]})
        diagram["user"] = {
            "email": user["email"],
            "name": user.get("name", "")
        } if user else None
    
    return {
        "diagrams": diagrams,
        "total": total_count,
        "page": page,
        "limit": limit,
        "total_pages": (total_count + limit - 1) // limit
    }

@router.post("/users/{user_id}/credits", response_model=dict)
async def update_user_credits(
    user_id: str,
    credits: int,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Update user credits"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    await db.users.update_one(
        {"_id": user_id},
        {"$inc": {"credits": credits}}
    )
    
    return {"message": "Credits updated successfully"}

@router.delete("/users/{user_id}", response_model=dict)
async def delete_user(
    user_id: str,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete user and all associated data"""
    user = await db.users.find_one({"_id": user_id})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    # Delete user's diagrams
    await db.diagrams.delete_many({"user_id": user_id})
    
    # Delete user's projects
    await db.projects.delete_many({"user_id": user_id})
    
    # Delete user
    await db.users.delete_one({"_id": user_id})
    
    return {"message": "User and associated data deleted successfully"}

@router.delete("/diagrams/{diagram_id}", response_model=dict)
async def delete_diagram(
    diagram_id: str,
    current_admin: dict = Depends(get_current_admin_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete a diagram"""
    diagram = await db.diagrams.find_one({"_id": diagram_id})
    if not diagram:
        raise HTTPException(status_code=404, detail="Diagram not found")
    
    # Delete the diagram
    await db.diagrams.delete_one({"_id": diagram_id})
    
    return {"message": "Diagram deleted successfully"}

@router.post("/login", response_model=dict)
async def admin_login(
    request_body: AdminLoginRequest,
    request: Request,
):
    """Admin login endpoint with static credentials"""
    if request_body.email != ADMIN_EMAIL or request_body.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials"
        )
    
    # Create access token
    access_token = create_access_token(
        data={"sub": ADMIN_EMAIL, "is_admin": True}
    )
    
    # Return admin user data
    admin_user = {
        "id": "admin",
        "email": ADMIN_EMAIL,
        "name": "Admin",
        "is_admin": True
    }
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": admin_user
    }

@router.get("/projects")
async def get_projects(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    search: str = Query(""),
    sort_by: str = Query("created_at"),
    sort_order: str = Query("desc"),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get paginated list of projects"""
    try:
        # Build query
        query = {}
        if search:
            query["$or"] = [
                {"name": {"$regex": search, "$options": "i"}},
                {"description": {"$regex": search, "$options": "i"}}
            ]

        # Get total count
        total = await db.projects.count_documents(query)

        # Sort direction
        sort_direction = -1 if sort_order.lower() == "desc" else 1

        # Get projects with pagination
        projects = await db.projects.find(query) \
            .sort(sort_by, sort_direction) \
            .skip((page - 1) * limit) \
            .limit(limit) \
            .to_list(length=None)

        # Process projects for response
        project_list = []
        for project in projects:
            # Get user info
            user = await db.users.find_one({"_id": ObjectId(project["user_id"])})
            
            # Get diagrams count
            diagrams_count = await db.diagrams.count_documents({
                "project_id": str(project["_id"])
            })
            
            project_list.append({
                "id": str(project["_id"]),
                "name": project.get("name", ""),
                "description": project.get("description", ""),
                "user": {
                    "id": str(user["_id"]) if user else None,
                    "email": user["email"] if user else None,
                    "name": user.get("name", "") if user else "Unknown"
                },
                "status": project.get("status", "active"),
                "diagrams_count": diagrams_count,
                "created_at": project.get("created_at", ""),
                "updated_at": project.get("updated_at", "")
            })

        return {
            "projects": project_list,
            "total": total,
            "page": page,
            "limit": limit,
            "pages": math.ceil(total / limit) if total > 0 else 1
        }

    except Exception as e:
        logger.error(f"Error getting projects: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting projects"
        )

@router.get("/projects/{project_id}")
async def get_project(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get project details by ID"""
    try:
        project = await db.projects.find_one({"_id": ObjectId(project_id)})
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Get user info
        user = await db.users.find_one({"_id": ObjectId(project["user_id"])})
        
        # Get diagrams with their output URLs
        diagrams = await db.diagrams.find({
            "project_id": str(project["_id"])
        }).to_list(length=None)
        
        diagrams_list = []
        for diagram in diagrams:
            # Get the latest output for the diagram
            output = await db.outputs.find_one(
                {"diagram_id": str(diagram["_id"])},
                sort=[("created_at", -1)]
            )
            
            diagrams_list.append({
                "id": str(diagram["_id"]),
                "name": diagram.get("name", ""),
                "description": diagram.get("description", ""),
                "status": diagram.get("status", "pending"),
                "type": diagram.get("type", ""),
                "created_at": diagram.get("created_at", ""),
                "image_url": output.get("url") if output else None
            })

        return {
            "id": str(project["_id"]),
            "name": project.get("name", ""),
            "description": project.get("description", ""),
            "user": {
                "id": str(user["_id"]) if user else None,
                "email": user["email"] if user else None,
                "name": user.get("name", "") if user else "Unknown"
            },
            "status": project.get("status", "active"),
            "diagrams": diagrams_list,
            "created_at": project.get("created_at", ""),
            "updated_at": project.get("updated_at", "")
        }

    except Exception as e:
        logger.error(f"Error getting project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error getting project"
        )

@router.delete("/projects/{project_id}")
async def delete_project(
    project_id: str,
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Delete project and its diagrams"""
    try:
        # Delete project
        result = await db.projects.delete_one({"_id": ObjectId(project_id)})
        if result.deleted_count == 0:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        # Delete associated diagrams
        await db.diagrams.delete_many({"project_id": project_id})

        return {"message": "Project and associated diagrams deleted successfully"}

    except Exception as e:
        logger.error(f"Error deleting project: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting project"
        )
