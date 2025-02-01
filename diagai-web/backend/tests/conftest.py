import pytest
from fastapi.testclient import TestClient
from motor.motor_asyncio import AsyncIOMotorClient
import asyncio
from datetime import datetime
import os
from typing import Generator, Dict
import jwt

from app.core.config import get_settings
from main import app

settings = get_settings()

# Test database
TEST_MONGODB_URL = "mongodb://localhost:27017/diagai_test"

@pytest.fixture(scope="session")
def event_loop():
    """Create an instance of the default event loop for the test session."""
    loop = asyncio.get_event_loop_policy().new_event_loop()
    yield loop
    loop.close()

@pytest.fixture(scope="session")
async def db():
    """Create a test database."""
    client = AsyncIOMotorClient(TEST_MONGODB_URL)
    db = client.diagai_test
    
    # Clear database before tests
    await db.command("dropDatabase")
    
    # Create indexes
    await db.users.create_index("email", unique=True)
    await db.users.create_index("firebase_uid", unique=True)
    await db.projects.create_index([("user_id", 1), ("name", 1)])
    await db.diagrams.create_index([("user_id", 1), ("project_id", 1)])
    
    yield db
    
    # Clear database after tests
    await db.command("dropDatabase")
    client.close()

@pytest.fixture(scope="session")
def client() -> Generator:
    """Create a test client."""
    with TestClient(app) as test_client:
        yield test_client

@pytest.fixture(scope="session")
def test_user() -> Dict:
    """Create a test user data."""
    return {
        "email": "test@example.com",
        "name": "Test User",
        "firebase_uid": "test123",
        "credits": 10,
        "plan": "free",
        "account_status": "active"
    }

@pytest.fixture(scope="session")
def test_admin() -> Dict:
    """Create a test admin data."""
    return {
        "email": "admin@example.com",
        "name": "Admin User",
        "firebase_uid": "admin123",
        "credits": 1000,
        "plan": "enterprise",
        "account_status": "active",
        "is_admin": True
    }

@pytest.fixture(scope="session")
def user_token(test_user) -> str:
    """Create a JWT token for test user."""
    access_token = jwt.encode(
        {
            "sub": str(test_user["_id"]),
            "exp": datetime.utcnow().timestamp() + 3600
        },
        settings.SECRET_KEY,
        algorithm="HS256"
    )
    return access_token

@pytest.fixture(scope="session")
def admin_token(test_admin) -> str:
    """Create a JWT token for test admin."""
    access_token = jwt.encode(
        {
            "sub": str(test_admin["_id"]),
            "is_admin": True,
            "exp": datetime.utcnow().timestamp() + 3600
        },
        settings.SECRET_KEY,
        algorithm="HS256"
    )
    return access_token

@pytest.fixture(autouse=True)
async def setup_test_data(db, test_user, test_admin):
    """Setup test data before each test."""
    # Insert test user
    await db.users.insert_one(test_user)
    
    # Insert test admin
    await db.users.insert_one(test_admin)
    
    yield
    
    # Cleanup after test
    await db.users.delete_many({})
    await db.projects.delete_many({})
    await db.diagrams.delete_many({})
