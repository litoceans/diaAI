from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
import os
from app.api.v1 import auth, users, projects, diagrams, admin, health, metrics
from app.core.config import get_settings
from app.middleware.rate_limit import RateLimitMiddleware
from app.middleware.logging import LoggingMiddleware
from app.middleware.metrics import MetricsMiddleware
from app.core.logger import logger
from app.core.docs import custom_openapi
from app.core.scheduler import scheduler
from app.core.cache import cache
from app.core.database import db

# Load environment variables
load_dotenv()

# Get settings
settings = get_settings()

app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="API for DiaAI - AI-powered diagram generation",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# Customize OpenAPI documentation
app.openapi = custom_openapi()

# Add middlewares
app.add_middleware(LoggingMiddleware)  # Add logging first to catch all requests
app.add_middleware(MetricsMiddleware)  # Add metrics middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(RateLimitMiddleware)

# Mount static files
app.mount("/storage", StaticFiles(directory=settings.STORAGE_PATH), name="storage")

# Startup event
@app.on_event("startup")
async def startup():
    try:
        # Connect to database
        await db.connect_to_database()
        logger.info("Successfully connected to MongoDB")
        
        # Create indexes
        database = db.get_db()
        await database.users.create_index("email", unique=True)
        await database.users.create_index("firebase_uid", unique=True)
        await database.projects.create_index([("user_id", 1), ("name", 1)])
        await database.diagrams.create_index([("user_id", 1), ("project_id", 1)])
        logger.info("Database indexes created")
        
        # Initialize cache
        await cache.init()
        logger.info("Memory cache initialized")
        
        # Start scheduler
        scheduler.start()
        logger.info("Background scheduler started")
        
    except Exception as e:
        logger.error(f"Error during startup: {str(e)}", exc_info=True)
        raise

# Shutdown event
@app.on_event("shutdown")
async def shutdown():
    # Close database connection
    await db.close_database_connection()
    logger.info("Database connection closed")
    
    # Close cache
    await cache.close()
    logger.info("Memory cache cleared")
    
    # Shutdown scheduler
    scheduler.shutdown()
    logger.info("Background scheduler shutdown")

# Include routers
app.include_router(auth.router, prefix=f"{settings.API_V1_STR}/auth", tags=["Authentication"])
app.include_router(users.router, prefix=f"{settings.API_V1_STR}/users", tags=["Users"])
app.include_router(projects.router, prefix=f"{settings.API_V1_STR}/projects", tags=["Projects"])
app.include_router(diagrams.router, prefix=f"{settings.API_V1_STR}/diagrams", tags=["Diagrams"])
app.include_router(admin.router, prefix=f"{settings.API_V1_STR}/admin", tags=["Admin"])
app.include_router(health.router, prefix=f"{settings.API_V1_STR}/health", tags=["Health"])
app.include_router(metrics.router, prefix=f"{settings.API_V1_STR}/metrics", tags=["Metrics"])

# Root endpoint
@app.get("/")
async def root():
    return {
        "message": f"Welcome to {settings.PROJECT_NAME} API",
        "version": "1.0.0",
        "documentation": "/docs",
        "environment": os.getenv("ENV", "development")
    }
