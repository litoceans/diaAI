from fastapi import APIRouter, Depends, HTTPException, status
from motor.motor_asyncio import AsyncIOMotorDatabase
from app.api.deps import get_db, get_current_active_user
from datetime import datetime, timedelta
from typing import List

router = APIRouter()

@router.get("/usage", response_model=dict)
async def get_usage_metrics(
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's usage metrics"""
    # Get total diagrams created
    total_diagrams = await db.diagrams.count_documents({
        "user_id": current_user["_id"]
    })
    
    # Get diagrams created today
    today = datetime.utcnow().replace(hour=0, minute=0, second=0, microsecond=0)
    diagrams_today = await db.diagrams.count_documents({
        "user_id": current_user["_id"],
        "created_at": {"$gte": today}
    })
    
    # Get diagrams created this month
    month_start = today.replace(day=1)
    diagrams_this_month = await db.diagrams.count_documents({
        "user_id": current_user["_id"],
        "created_at": {"$gte": month_start}
    })
    
    return {
        "total_diagrams": total_diagrams,
        "diagrams_today": diagrams_today,
        "diagrams_this_month": diagrams_this_month,
        "credits_remaining": current_user["credits"],
        "plan": current_user["plan"]
    }

@router.get("/history", response_model=List[dict])
async def get_usage_history(
    days: int = 30,
    current_user: dict = Depends(get_current_active_user),
    db: AsyncIOMotorDatabase = Depends(get_db)
):
    """Get user's usage history for the specified number of days"""
    start_date = datetime.utcnow() - timedelta(days=days)
    
    pipeline = [
        {
            "$match": {
                "user_id": current_user["_id"],
                "created_at": {"$gte": start_date}
            }
        },
        {
            "$group": {
                "_id": {
                    "year": {"$year": "$created_at"},
                    "month": {"$month": "$created_at"},
                    "day": {"$dayOfMonth": "$created_at"}
                },
                "count": {"$sum": 1},
                "date": {"$first": "$created_at"}
            }
        },
        {
            "$sort": {"date": 1}
        }
    ]
    
    history = await db.diagrams.aggregate(pipeline).to_list(None)
    
    # Format the response
    formatted_history = []
    current_date = start_date
    end_date = datetime.utcnow()
    
    while current_date <= end_date:
        date_entry = {
            "date": current_date.strftime("%Y-%m-%d"),
            "count": 0
        }
        
        # Find matching entry from aggregation
        for entry in history:
            entry_date = entry["date"].replace(hour=0, minute=0, second=0, microsecond=0)
            if entry_date == current_date.replace(hour=0, minute=0, second=0, microsecond=0):
                date_entry["count"] = entry["count"]
                break
        
        formatted_history.append(date_entry)
        current_date += timedelta(days=1)
    
    return formatted_history
