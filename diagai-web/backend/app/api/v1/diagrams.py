from fastapi import APIRouter, Depends, HTTPException, status, BackgroundTasks
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_active_user
from app.models.diagram import DiagramCreate, DiagramUpdate
from datetime import datetime
from bson import ObjectId
import aiohttp
import os
from PIL import Image
import io
from app.services.diagram_generator import DiagramGenerator
import traceback

router = APIRouter()

# Initialize diagram generator
diagram_generator = DiagramGenerator()

@router.post("/generate", response_model=dict)
async def generate_diagram(
    diagram: DiagramCreate,
    background_tasks: BackgroundTasks,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    try:
        # Check user credits
        user = await db.users.find_one({"_id": current_user["_id"]})
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        
        # Calculate required credits
        required_credits = 3 if diagram.type == "gif" else 1
        if user["credits"] < required_credits:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Insufficient credits"
            )
        
        # Create diagram entry
        diagram_dict = {
            "_id": str(ObjectId()),
            "user_id": current_user["_id"],
            "project_id": diagram.project_id,
            "prompt": diagram.prompt,
            "type": diagram.type,
            "diagramType": diagram.generation_type,
            "url": "",  # Will be updated after generation
            "frames": [],  # For GIFs
            "credits_used": required_credits,
            "status": "processing",
            "created_at": datetime.utcnow(),
            "updated_at": datetime.utcnow()
        }
        
        # Insert diagram with initial status
        await db.diagrams.insert_one(diagram_dict)
        
        # Update status to processing
        await db.diagrams.update_one(
            {"_id": diagram_dict["_id"]},
            {
                "$set": {
                    "status": "processing",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Deduct credits
        await db.users.update_one(
            {"_id": current_user["_id"]},
            {"$inc": {"credits": -required_credits}}
        )
        
        # Generate diagram in background
        background_tasks.add_task(
            generate_and_update_diagram,
            db,
            diagram_dict["_id"],
            diagram.prompt,
            diagram.type,
            diagram.generation_type
        )
        
        return diagram_dict
        
    except Exception as e:
        # Log the error
        print(f"Error in generate_diagram: {str(e)}")
        print(traceback.format_exc())
        
        # Update diagram with error status if it was created
        if 'diagram_dict' in locals():
            await db.diagrams.update_one(
                {"_id": diagram_dict["_id"]},
                {
                    "$set": {
                        "status": "failed",
                        "error": str(e),
                        "updated_at": datetime.utcnow()
                    }
                }
            )
            
            # Refund credits
            await db.users.update_one(
                {"_id": current_user["_id"]},
                {"$inc": {"credits": required_credits}}
            )
        
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate diagram: {str(e)}"
        )

@router.get("/{diagram_id}", response_model=dict)
async def get_diagram(
    diagram_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    diagram = await db.diagrams.find_one({
        "_id": diagram_id,
        "user_id": current_user["_id"]
    })
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    return diagram

@router.patch("/{diagram_id}", response_model=dict)
async def update_diagram(
    diagram_id: str,
    diagram_update: DiagramUpdate,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Check if diagram exists and belongs to user
    diagram = await db.diagrams.find_one({
        "_id": diagram_id,
        "user_id": current_user["_id"]
    })
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    # Update diagram
    update_data = diagram_update.dict(exclude_unset=True)
    if update_data:
        update_data["updated_at"] = datetime.utcnow()
        result = await db.diagrams.update_one(
            {"_id": diagram_id},
            {"$set": update_data}
        )
        
        if result.modified_count == 0:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Diagram update failed"
            )
    
    return await db.diagrams.find_one({"_id": diagram_id})

@router.delete("/{diagram_id}")
async def delete_diagram(
    diagram_id: str,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    # Check if diagram exists and belongs to user
    diagram = await db.diagrams.find_one({
        "_id": diagram_id,
        "user_id": current_user["_id"]
    })
    
    if not diagram:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Diagram not found"
        )
    
    # Delete diagram
    result = await db.diagrams.delete_one({"_id": diagram_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Diagram deletion failed"
        )
    
    # TODO: Delete diagram files from storage
    
    return {"message": "Diagram deleted successfully"}

async def generate_and_update_diagram(
    db: AsyncIOMotorDatabase,
    diagram_id: str,
    prompt: str,
    diagram_type: str,
    generation_type: str
):
    try:
        # Update status to generating
        await db.diagrams.update_one(
            {"_id": diagram_id},
            {
                "$set": {
                    "status": "generating",
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Generate diagram
        url, _ = await diagram_generator.generate_diagram(prompt, diagram_type,generation_type)
        
        # Update diagram with generated URL
        await db.diagrams.update_one(
            {"_id": diagram_id},
            {
                "$set": {
                    "url": url,
                    "status": "completed",
                    "updated_at": datetime.utcnow()
                }
            }
        )
    except Exception as e:
        print(f"Error in generate_and_update_diagram: {str(e)}")
        print(traceback.format_exc())
        
        # Update diagram with error status
        await db.diagrams.update_one(
            {"_id": diagram_id},
            {
                "$set": {
                    "status": "failed",
                    "error": str(e),
                    "updated_at": datetime.utcnow()
                }
            }
        )
        
        # Refund credits to user
        diagram = await db.diagrams.find_one({"_id": diagram_id})
        if diagram:
            await db.users.update_one(
                {"_id": diagram["user_id"]},
                {"$inc": {"credits": diagram["credits_used"]}}
            )
