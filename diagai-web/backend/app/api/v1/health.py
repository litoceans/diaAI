from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_admin_user
from app.core.config import get_settings
import psutil
import os
from datetime import datetime

router = APIRouter()
settings = get_settings()

@router.get("/", response_model=dict)
async def health_check():
    """Basic health check endpoint"""
    return {
        "status": "healthy",
        "timestamp": datetime.utcnow().isoformat()
    }

@router.get("/system", response_model=dict)
async def system_health():
    """System health metrics"""
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system": {
                "cpu_percent": cpu_percent,
                "memory_percent": memory.percent,
                "memory_available_mb": memory.available // (1024 * 1024),
                "disk_percent": disk.percent,
                "disk_free_gb": disk.free // (1024 * 1024 * 1024)
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"System health check failed: {str(e)}"
        )

@router.get("/database", response_model=dict)
async def database_health(
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Database health check"""
    try:
        # Check database connection
        await db.command('ping')
        
        # Get database stats
        stats = await db.command('dbStats')
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "database": {
                "collections": stats["collections"],
                "objects": stats["objects"],
                "avg_obj_size_bytes": stats["avgObjSize"] if "avgObjSize" in stats else 0,
                "storage_size_mb": stats["storageSize"] // (1024 * 1024),
                "indexes": stats["indexes"]
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Database health check failed: {str(e)}"
        )

@router.get("/storage", response_model=dict)
async def storage_health():
    """Storage health check"""
    try:
        storage_path = settings.STORAGE_PATH
        storage_stats = os.statvfs(storage_path)
        
        # Calculate storage metrics
        total_space = storage_stats.f_blocks * storage_stats.f_frsize
        free_space = storage_stats.f_bfree * storage_stats.f_frsize
        used_space = total_space - free_space
        
        # Count files
        total_files = sum([len(files) for _, _, files in os.walk(storage_path)])
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "storage": {
                "total_space_gb": total_space // (1024 * 1024 * 1024),
                "used_space_gb": used_space // (1024 * 1024 * 1024),
                "free_space_gb": free_space // (1024 * 1024 * 1024),
                "usage_percent": (used_space / total_space) * 100,
                "total_files": total_files
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Storage health check failed: {str(e)}"
        )

@router.get("/full", response_model=dict)
async def full_health_check(
    db: AsyncIOMotorDatabase = Depends(get_db),
    admin_user_id: str = Depends(get_admin_user)
):
    """Comprehensive health check (admin only)"""
    try:
        # Get all health metrics
        system = await system_health()
        database = await database_health(db)
        storage = await storage_health()
        
        # Additional checks
        active_users = await db.users.count_documents({"account_status": "active"})
        total_projects = await db.projects.count_documents({})
        total_diagrams = await db.diagrams.count_documents({})
        
        return {
            "status": "healthy",
            "timestamp": datetime.utcnow().isoformat(),
            "system": system["system"],
            "database": database["database"],
            "storage": storage["storage"],
            "application": {
                "active_users": active_users,
                "total_projects": total_projects,
                "total_diagrams": total_diagrams,
                "version": "1.0.0",
                "environment": os.getenv("ENV", "development")
            }
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Full health check failed: {str(e)}"
        )
