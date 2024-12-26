from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_active_user
from app.models.project import ProjectCreate, ProjectUpdate
from datetime import datetime
from bson import ObjectId
from typing import List

router = APIRouter()

@router.get("/", response_model=List[dict])
async def get_projects(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    projects = await db.projects.find({"user_id": current_user["_id"]}).to_list(None)
    return projects

@router.post("/", response_model=dict)
async def create_project(
    project: ProjectCreate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    project_dict = {
        "_id": str(ObjectId()),
        "user_id": current_user["_id"],
        "name": project.name,
        "description": project.description,
        "diagrams": [],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    await db.projects.insert_one(project_dict)
    return project_dict

@router.get("/{project_id}", response_model=dict)
async def get_project(
    project_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    project = await db.projects.find_one({
        "_id": project_id,
        "user_id": current_user["_id"]
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Get project diagrams
    diagrams = await db.diagrams.find({
        "project_id": project_id
    }).to_list(None)
    
    project["diagrams"] = diagrams
    return project

@router.patch("/{project_id}", response_model=dict)
async def update_project(
    project_id: str,
    project_update: ProjectUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Check if project exists and belongs to user
    project = await db.projects.find_one({
        "_id": project_id,
        "user_id": current_user["_id"]
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update project
    update_data = project_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = await db.projects.update_one(
            {"_id": project_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Project update failed"
            )
    
    return await db.projects.find_one({"_id": project_id})

@router.delete("/{project_id}")
async def delete_project(
    project_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Check if project exists and belongs to user
    project = await db.projects.find_one({
        "_id": project_id,
        "user_id": current_user["_id"]
    })
    
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Delete all diagrams in the project
    await db.diagrams.delete_many({"project_id": project_id})
    
    # Delete project
    result = await db.projects.delete_one({"_id": project_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Project deletion failed"
        )
    
    return {"message": "Project deleted successfully"}
